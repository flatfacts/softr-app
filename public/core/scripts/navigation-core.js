/**
 * FlatFacts Navigation Core
 * Reusable navigation framework for multi-step forms
 * @version 1.0.0
 * @requires jQuery
 * @requires common-helpers.js
 */

/**
 * Global object to track current step transition
 */
window.currentStepInfo = {
    fromStep: null,
    toStep: null
};

/**
 * Form step manager with comprehensive functionality and validation
 * This function should be called with a configuration object specific to each page
 * 
 * @param {Object} options - Configuration options
 * @param {string} [options.direction] - "next" or "previous" for transitions
 * @param {number} [options.stepIndex] - Direct step index to set
 * @param {string} [options.stepName] - Name of step to set
 * @param {Function} [options.callback] - Optional callback when operation completes
 * @param {Array} options.stepSignatures - Array of step configurations (required, provided by page-specific config)
 * @param {Object} options.transitions - Transition definitions (required, provided by page-specific config)
 * @param {Object} options.stepContainers - Container mappings (required, provided by page-specific config)
 */
function setFormStep(options) {
    // Handle string input for backward compatibility
    if (typeof options === 'string') {
        options = { direction: options };
    }

    // Debug: Log what options were received
    console.log('setFormStep called with options:', Object.keys(options || {}));

    const { direction, stepIndex, stepName, callback, stepSignatures, transitions, stepContainers } = options;

    // Validation: Ensure required configurations are provided
    if (!stepSignatures || !Array.isArray(stepSignatures) || stepSignatures.length === 0) {
        console.error('setFormStep: stepSignatures configuration is required. Received:', typeof stepSignatures);
        console.error('Full options received:', options);
        if (callback) callback(false);
        return;
    }

    if (!transitions || typeof transitions !== 'object') {
        console.error('setFormStep: transitions configuration is required. Received:', typeof transitions);
        if (callback) callback(false);
        return;
    }

    if (!stepContainers || typeof stepContainers !== 'object') {
        console.error('setFormStep: stepContainers configuration is required. Received:', typeof stepContainers);
        if (callback) callback(false);
        return;
    }

    // Helper function to get step index by name
    function getStepIndexByName(name) {
        for (let i = 0; i < stepSignatures.length; i++) {
            if (stepSignatures[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    // Helper function to detect the current step
    async function detectCurrentStep() {
        for (let i = 0; i < stepSignatures.length; i++) {
            const signature = stepSignatures[i];

            // Try to find an element matching this step's identifier
            const element = await Promise.resolve(__findElement({
                textContent: signature.textIdentifier,
                useTimeout: false // Quick check
            }));

            if (element && element.length > 0 && element.is(":visible")) {
                return i; // Return the index of the matched step
            }
        }

        return -1; // No matching step found
    }

    // Validate the current step before transitioning
    async function validateCurrentStep(currentStepIndex) {
        const currentStep = stepSignatures[currentStepIndex];

        // If the step has a validation function, execute it
        if (currentStep && typeof currentStep.validate === 'function') {
            return currentStep.validate();
        }

        // If no validation function exists, consider it valid
        return true;
    }

    // Helper function to hide elements based on criteria with retry logic
    async function processHideElements(step) {
        if (!step.hideElements || !step.hideElements.length) return;

        for (const hideConfig of step.hideElements) {
            const { type, text, operation } = hideConfig;

            let element = null;

            // Find the element based on type
            if (type === "labelContaining") {
                element = await Promise.resolve(__findElement({
                    labelContent: text,
                    useTimeout: true,
                    maxRetries: 20
                }));
            }

            if (element && element.length > 0) {
                console.log(`Processing hideElement for "${text}" with operation "${operation}"`);
                // Execute the operation
                if (operation === "hideParentDiv") {
                    // Use the exact same approach as the original code
                    element.closest('div.de2bf75_1m5yg2g0').hide();
                    console.log(`✅ Hidden parent div for "${text}"`);
                } else if (operation === "hide") {
                    element.hide();
                    console.log(`✅ Hidden element "${text}"`);
                }
            } else {
                console.log(`⚠️ Element not found for "${text}"`);
            }
        }
    }

    // Set initial step (without transition animations)
    async function setInitialStep(targetStepIndex) {
        console.log('🎯 setInitialStep called for index:', targetStepIndex);
        
        if (targetStepIndex < 0 || targetStepIndex >= stepSignatures.length) {
            console.error(`Invalid step index: ${targetStepIndex}`);
            if (callback) callback(false);
            return false;
        }

        console.log(`Setting initial step to: ${stepSignatures[targetStepIndex].name}`);

        // Hide all step containers first (move to idle-container)
        console.log('🔄 Hiding all non-target step containers...');
        for (let i = 0; i < stepSignatures.length; i++) {
            // Hide containers for non-target steps
            if (i !== targetStepIndex && stepContainers[i]) {
                console.log(`Hiding containers for step ${i}:`, stepContainers[i]);
                for (const item of stepContainers[i]) {
                    // Handle both string IDs and object configs
                    const containerId = typeof item === 'string' ? item : item.id;
                    
                    const container = await Promise.resolve(__findElement({
                        id: containerId,
                        useTimeout: false
                    }));

                    if (container && container.length) {
                        console.log(`✅ Found container ${containerId}, moving to idle`);
                        // Move to idle container
                        await __moveElement({
                            sourceElement: container,
                            targetElement: { id: "idle-container" },
                            moveInside: true
                        });
                    } else {
                        console.log(`⚠️ Container ${containerId} not found`);
                    }
                }
            }
        }

        // Now show the target step containers
        console.log('🔄 Showing target step containers for step', targetStepIndex);
        const targetContainerConfigs = stepContainers[targetStepIndex];
        if (targetContainerConfigs) {
            console.log('Target containers config:', targetContainerConfigs);
            for (const item of targetContainerConfigs) {
                // Handle both string IDs and object configs
                const containerId = typeof item === 'string' ? item : item.id;
                const target = typeof item === 'string' 
                    ? { textContent: stepSignatures[targetStepIndex].textIdentifier }
                    : item.target;
                
                console.log(`Looking for container ${containerId}...`);
                const container = await Promise.resolve(__findElement({
                    id: containerId,
                    useTimeout: true
                }));

                if (container && container.length) {
                    console.log(`✅ Found container ${containerId}, moving to target`, target);
                    await __moveElement({
                        sourceElement: container,
                        targetElement: target,
                        useTimeout: true,
                        maxRetries: 20
                    });
                } else {
                    console.log(`⚠️ Container ${containerId} not found`);
                }
            }
        }

        // Process any hiding operations for the target step
        console.log('🔄 Processing hideElements for target step...');
        await processHideElements(stepSignatures[targetStepIndex]);

        console.log('✅ Initial step setup complete');
        if (callback) callback(true);
        return true;
    }

    // Transition between steps
    async function transitionToStep(fromStep, toStep) {
        
        // Store step transition info globally
        window.currentStepInfo = {
            fromStep: fromStep,
            toStep: toStep
        };

        console.log(`Transitioning from ${stepSignatures[fromStep].name} to ${stepSignatures[toStep].name}`);

        const transitionKey = `${fromStep}-${toStep}`;
        const transitionSteps = transitions[transitionKey];

        if (!transitionSteps) {
            console.error(`No transition defined for ${transitionKey}`);
            if (callback) callback(false);
            return false;
        }

        // Execute each move operation in sequence
        for (const step of transitionSteps) {
            await __moveElement(step);
        }

        // Process any hiding operations for the target step
        await processHideElements(stepSignatures[toStep]);

        // Execute step-specific handlers if they exist
        console.log(`🔍 Checking for handler on step ${toStep} (${stepSignatures[toStep].name})...`);
        const stepHandler = stepSignatures[toStep].handler;
        if (stepHandler && typeof stepHandler === 'function') {
            console.log(`✅ Handler found, executing for step: ${stepSignatures[toStep].name}`);
            await stepHandler();
            console.log(`✅ Handler completed for step: ${stepSignatures[toStep].name}`);
        } else {
            console.log(`ℹ️ No handler defined for step: ${stepSignatures[toStep].name}`);
        }

        if (callback) callback(true);
        return true;
    }

    // Main execution
    async function execute() {
        console.log('🚀 execute() called with stepIndex:', stepIndex, 'stepName:', stepName, 'direction:', direction);
        
        // If stepIndex or stepName is provided, set initial step
        if (stepIndex !== undefined || stepName !== undefined) {
            let targetStepIndex = stepIndex;

            // If step name is provided, convert to index
            if (stepName !== undefined) {
                targetStepIndex = getStepIndexByName(stepName);
                if (targetStepIndex === -1) {
                    console.error(`Step name not found: ${stepName}`);
                    if (callback) callback(false);
                    return;
                }
            }

            console.log('📍 Calling setInitialStep with index:', targetStepIndex);
            // Set initial step
            return setInitialStep(targetStepIndex);
        }

        // Otherwise handle transitions based on direction
        console.log('🔄 No stepIndex provided, detecting current step...');
        const currentStep = await detectCurrentStep();

        if (currentStep === -1) {
            console.error("Could not determine current step");
            if (callback) callback(false);
            return;
        }

        console.log(`Current step: ${stepSignatures[currentStep].name}`);

        let targetStep;
        if (direction.toLowerCase() === "next") {
            // Validate current step before moving to next
            const isValid = await validateCurrentStep(currentStep);
            if (!isValid) {
                console.log("Validation failed. Staying on current step.");
                if (callback) callback(false);
                return;
            }

            targetStep = currentStep + 1;
        } else if (direction.toLowerCase() === "previous") {
            // No validation needed when going back
            targetStep = currentStep - 1;
        } else {
            console.error("Invalid direction. Use 'next' or 'previous'");
            if (callback) callback(false);
            return;
        }

        // Check if target step exists
        if (targetStep < 0 || targetStep >= stepSignatures.length) {
            console.error(`Invalid step transition: ${currentStep} to ${targetStep}`);
            if (callback) callback(false);
            return;
        }

        // Perform the transition
        await transitionToStep(currentStep, targetStep);
    }

    // Start execution
    execute();
}

/**
 * Attach navigation button listeners
 * This should be called after the form is loaded
 * 
 * @param {string} formSelector - jQuery selector for the form container
 */
function attachNavigationListeners(formSelector, navigationConfig) {
    // Function to attach click events to buttons with "Next" or "Previous" text
    function attachButtonListeners() {
        $(`${formSelector} button`).each(function () {
            const buttonText = $(this).text();

            // Check if the button contains "Next" or "Previous"
            if (buttonText.includes('Next') || buttonText.includes('Previous') || buttonText.includes('Finish')) {
                $(this).off('click').on('click', function () {
                    console.log(buttonText + ' button clicked');

                    if (buttonText.includes('Next')) {
                        setFormStep({
                            direction: "next",
                            ...navigationConfig,
                            callback: function (result) {
                                if (result) console.log("Successfully moved to next step");
                                else console.log("Failed to move to next step");
                            }
                        });
                    }

                    if (buttonText.includes('Previous')) {
                        setFormStep({
                            direction: "previous",
                            ...navigationConfig,
                            callback: function (result) {
                                if (result) console.log("Successfully moved to previous step");
                                else console.log("Failed to move to previous step");
                            }
                        });
                    }

                    if (buttonText.includes('Finish')) {
                        setFormStep({
                            direction: "next",
                            ...navigationConfig,
                            callback: function (result) {
                                if (result) console.log("Successfully moved to next step");
                                else console.log("Failed to move to previous step");
                            }
                        });
                    }

                    // Check for new buttons after a delay, if necessary
                    checkForNewButtons();
                });
            }
        });
    }

    // Function to repeatedly check for buttons with "Next", "Previous" or "Finish" text
    function checkForNewButtons() {
        const intervalId = setInterval(function () {
            // Select any new buttons that might appear
            const newButtons = $(`${formSelector} button`).filter(function () {
                const buttonText = $(this).text();
                return buttonText.includes('Next') || buttonText.includes('Previous') || buttonText.includes('Finish');
            });

            if (newButtons.length > 0) {
                // Attach listeners to the new buttons
                attachButtonListeners();

                // Clear the interval once buttons are found and listeners are attached
                clearInterval(intervalId);
            }
        }, 500); // Check every 500 milliseconds (you can adjust the delay)
    }

    attachButtonListeners();
}
