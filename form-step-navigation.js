/**
 * Form Step Navigation Manager
 * Multi-step form handler with validation, transitions, and dynamic element management
 * 
 * @author Rubens
 * @version 1.0.0
 */

(function() {
    'use strict';

    // Global step tracking
    window.currentStepInfo = {
        fromStep: null,
        toStep: null
    };

    /**
     * Form step manager with comprehensive functionality and validation
     * @param {Object} options - Configuration options
     * @param {string} [options.direction] - "next" or "previous" for transitions
     * @param {number} [options.stepIndex] - Direct step index to set
     * @param {string} [options.stepName] - Name of step to set
     * @param {Function} [options.callback] - Optional callback when operation completes
     */
    function setFormStep(options) {
        // Handle string input for backward compatibility
        if (typeof options === 'string') {
            options = { direction: options };
        }

        const { direction, stepIndex, stepName, callback } = options;

        // Define step signatures - using unique text content to identify each step
        const stepSignatures = [
            // Step 1 - Address
            {
                name: "address-entry",
                textIdentifier: "Flat Address",
                hideElements: [
                    {
                        type: "labelContaining",
                        text: "flat_address_key",
                        operation: "hideParentDiv"
                    },
                    {
                        type: "labelContaining",
                        text: "flat_formatted_address",
                        operation: "hideParentDiv"
                    },
                    {
                        type: "labelContaining",
                        text: "flat_address_obj",
                        operation: "hideParentDiv"
                    }
                ],
                validate: function () {
                    const validAddressInput = $('#valid-address');
                    if (!validAddressInput.length || !validAddressInput.val().trim()) {
                        __showNotification('Enter a valid address');
                        return false;
                    }
                    if (validAddressInput.val() === "false") {
                        __showNotification('Address must be residential');
                        return false;
                    }
                    return true;
                }
            },
            // Step 2 - Category
            {
                name: "category-selection",
                textIdentifier: "Choose one or more categories",
                hideElements: [
                    {
                        type: "labelContaining",
                        text: "category_ids_link",
                        operation: "hideParentDiv"
                    }
                ],
                validate: function () {
                    const categoryContainer = document.getElementById('categories-container');
                    if (!categoryContainer) {
                        console.error('Category button container not found');
                        return false;
                    }

                    const allButtons = categoryContainer.getElementsByTagName('div');
                    const selectedValues = [];

                    for (let i = 0; i < allButtons.length; i++) {
                        const button = allButtons[i];
                        if (button.className && button.className.includes('selected')) {
                            const value = button.getAttribute('data-value');
                            if (value) {
                                selectedValues.push(value);
                            }
                        }
                    }

                    if (!selectedValues.length) {
                        __showNotification('Select at least one category');
                        return false;
                    }
                    return true;
                }
            },
            // Step 3 - Scores
            {
                name: "score-entry",
                textIdentifier: "Score only the relevant issues",
                hideElements: [
                    {
                        type: "labelContaining",
                        text: "score_ids_link",
                        operation: "hideParentDiv"
                    }
                ],
                validate: function () { return true; }
            },
            // Step 4 - Email
            {
                name: "email-entry",
                textIdentifier: "Submit it",
                hideElements: [
                    {
                        type: "labelContaining",
                        text: "reporter_sys_info",
                        operation: "hideParentDiv"
                    }
                ],
                validate: function () {
                    const isValidEmail = localStorage.getItem('validatedEmail');

                    if (!isValidEmail) {
                        __showNotification("You have to validate your email");
                        return false;
                    }
                    return true;
                }
            },
            // Step 5 - Finish
            {
                name: "finish-message",
                textIdentifier: "Know someone",
                hideElements: [],
                validate: function () { return true; }
            }
        ];

        /**
         * Helper function to hide elements based on criteria with retry logic
         */
        async function processHideElements(step) {
            if (!step.hideElements || !step.hideElements.length) return;

            for (const hideConfig of step.hideElements) {
                // Configure options for __findElement with retry capability
                const findOptions = {
                    useTimeout: true,
                    maxRetries: -1,
                    interval: 50
                };

                // Set up the search criteria based on hideConfig type
                if (hideConfig.type === "labelContaining") {
                    findOptions.labelContent = hideConfig.text;
                } else if (hideConfig.type === "id") {
                    findOptions.id = hideConfig.id;
                } else if (hideConfig.type === "selector") {
                    findOptions.selector = hideConfig.selector;
                }

                // Use the existing __findElement function to find with retry
                const elements = await __findElement(findOptions);

                // Apply the specified operation if elements were found
                console.log("Processing hide elements for step:", step.name);
                if (elements && elements.length) {
                    if (hideConfig.operation === "hideParentDiv") {
                        // Target the common parent div that exists in both input and textarea variations
                        elements.closest('div[data-size]').hide();
                    } else if (hideConfig.operation === "hide") {
                        elements.hide();
                    } else if (hideConfig.operation === "show") {
                        elements.show();
                    } else if (hideConfig.operation === "remove") {
                        elements.remove();
                    }
                }
            }
        }

        /**
         * Find step index by name
         */
        function getStepIndexByName(name) {
            return stepSignatures.findIndex(step => step.name === name);
        }

        /**
         * Determine current step based on visible text content
         */
        async function detectCurrentStep() {
            for (let i = 0; i < stepSignatures.length; i++) {
                const signature = stepSignatures[i];

                const element = await Promise.resolve(__findElement({
                    textContent: signature.textIdentifier,
                    useTimeout: false
                }));

                if (element && element.length > 0 && element.is(":visible")) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * Validate the current step before transitioning
         */
        async function validateCurrentStep(currentStepIndex) {
            const currentStep = stepSignatures[currentStepIndex];

            if (currentStep && typeof currentStep.validate === 'function') {
                return currentStep.validate();
            }

            return true;
        }

        /**
         * Set initial step (without transition animations)
         */
        async function setInitialStep(targetStepIndex) {
            if (targetStepIndex < 0 || targetStepIndex >= stepSignatures.length) {
                console.error(`Invalid step index: ${targetStepIndex}`);
                if (callback) callback(false);
                return false;
            }

            console.log(`Setting initial step to: ${stepSignatures[targetStepIndex].name}`);

            // Define container mappings for each step
            const stepContainers = {
                0: ["find-address-container"],
                1: ["categories-container"],
                2: ["scores-container"],
                3: ["email-verification-container"],
                4: ["e-social-share-container"]
            };

            // Hide all non-target step containers
            for (let i = 0; i < stepSignatures.length; i++) {
                if (i !== targetStepIndex && stepContainers[i]) {
                    for (const containerId of stepContainers[i]) {
                        const container = await Promise.resolve(__findElement({
                            id: containerId,
                            useTimeout: false
                        }));

                        if (container && container.length) {
                            await __moveElement({
                                sourceElement: container,
                                targetElement: { id: "idle-container" },
                                moveInside: true
                            });
                        }
                    }
                }
            }

            // Show target step containers
            const targetContainers = {
                0: [
                    { id: "find-address-container", target: { textContent: stepSignatures[0].textIdentifier } }
                ],
                1: [
                    { id: "categories-container", target: { textContent: stepSignatures[1].textIdentifier } }
                ],
                2: [
                    { id: "scores-container", target: { textContent: stepSignatures[2].textIdentifier } }
                ],
                3: [
                    { id: "email-verification-container", target: { textContent: stepSignatures[3].textIdentifier } }
                ],
                4: [
                    { id: "e-social-share-container", target: { textContent: stepSignatures[4].textIdentifier } }
                ]
            };

            if (targetContainers[targetStepIndex]) {
                for (const item of targetContainers[targetStepIndex]) {
                    const container = await Promise.resolve(__findElement({
                        id: item.id,
                        useTimeout: true
                    }));

                    if (container && container.length) {
                        await __moveElement({
                            sourceElement: container,
                            targetElement: item.target,
                            useTimeout: true,
                            maxRetries: 20
                        });
                    }
                }
            }

            // Process hiding operations for target step
            await processHideElements(stepSignatures[targetStepIndex]);

            if (callback) callback(true);
            return true;
        }

        /**
         * Transition between steps with animations and handlers
         */
        async function transitionToStep(fromStep, toStep) {
            // Store step transition info globally
            window.currentStepInfo = {
                fromStep: fromStep,
                toStep: toStep
            };

            console.log(`Transitioning from ${stepSignatures[fromStep].name} to ${stepSignatures[toStep].name}`);

            // Define transition mappings
            const transitions = {
                "0-1": [
                    {
                        sourceElement: { id: "find-address-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "categories-container" },
                        targetElement: { textContent: stepSignatures[1].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "1-0": [
                    {
                        sourceElement: { id: "categories-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "find-address-container" },
                        targetElement: { textContent: stepSignatures[0].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "1-2": [
                    {
                        sourceElement: { id: "categories-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "scores-container" },
                        targetElement: { textContent: stepSignatures[2].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "2-1": [
                    {
                        sourceElement: { id: "scores-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "categories-container" },
                        targetElement: { textContent: stepSignatures[1].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "2-3": [
                    {
                        sourceElement: { id: "scores-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "email-verification-container" },
                        targetElement: { labelContent: "Email" },
                        moveInside: false,
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "3-2": [
                    {
                        sourceElement: { id: "email-verification-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "scores-container" },
                        targetElement: { textContent: stepSignatures[2].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ],
                "3-4": [
                    {
                        sourceElement: { id: "email-verification-container" },
                        targetElement: { id: "idle-container" },
                        moveInside: true
                    },
                    {
                        sourceElement: { id: "e-social-share-container" },
                        targetElement: { textContent: stepSignatures[4].textIdentifier },
                        useTimeout: true,
                        maxRetries: -1
                    }
                ]
            };

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

            // Process hiding operations for target step
            await processHideElements(stepSignatures[toStep]);

            // Step-specific handlers
            if (toStep === 1) {
                await executeStepHandler('category_ids_link', handleCategoryStep, "Category");
            }

            if (toStep === 2) {
                await executeStepHandler('score_ids_link', handleScoresStep, "Scores");
            }

            if (toStep === 3) {
                await executeStepHandler('Email', handleEmailStep, "Email", true);
            }

            if (toStep === 4) {
                await executeStepHandler('High Five', handleFinishStep, "Finish", false, true);
            }

            if (callback) callback(true);
            return true;
        }

        /**
         * Helper function to execute step-specific handlers
         */
        async function executeStepHandler(identifier, handler, stepName, isLabel = false, isText = false) {
            await new Promise(resolve => {
                const searchOptions = {
                    useTimeout: true,
                    maxRetries: -1,
                    interval: 100,
                    callback: function (result) {
                        if (result) {
                            console.log(`${stepName} element found, running ${stepName.toLowerCase()} step handler`);
                            if (typeof handler === 'function') {
                                handler();
                            }
                        } else {
                            console.error(`${stepName} element not found after retries`);
                        }
                        resolve();
                    }
                };

                if (isLabel) {
                    searchOptions.labelContent = identifier;
                } else if (isText) {
                    searchOptions.textContent = identifier;
                } else {
                    searchOptions.labelContent = identifier;
                }

                __findElement(searchOptions);
            });
        }

        /**
         * Main execution function
         */
        async function execute() {
            // If stepIndex or stepName is provided, set initial step
            if (stepIndex !== undefined || stepName !== undefined) {
                let targetStepIndex = stepIndex;

                if (stepName !== undefined) {
                    targetStepIndex = getStepIndexByName(stepName);
                    if (targetStepIndex === -1) {
                        console.error(`Step name not found: ${stepName}`);
                        if (callback) callback(false);
                        return;
                    }
                }

                return setInitialStep(targetStepIndex);
            }

            // Handle transitions based on direction
            const currentStep = await detectCurrentStep();

            if (currentStep === -1) {
                console.error("Could not determine current step");
                if (callback) callback(false);
                return;
            }

            console.log(`Current step: ${stepSignatures[currentStep].name}`);

            let targetStep;
            if (direction.toLowerCase() === "next") {
                const isValid = await validateCurrentStep(currentStep);
                if (!isValid) {
                    console.log("Validation failed. Staying on current step.");
                    if (callback) callback(false);
                    return;
                }
                targetStep = currentStep + 1;
            } else if (direction.toLowerCase() === "previous") {
                targetStep = currentStep - 1;
            } else {
                console.error("Invalid direction. Use 'next' or 'previous'");
                if (callback) callback(false);
                return;
            }

            // Validate target step
            if (targetStep < 0 || targetStep >= stepSignatures.length) {
                console.error(`Invalid step transition: ${currentStep} to ${targetStep}`);
                if (callback) callback(false);
                return;
            }

            // Perform transition
            await transitionToStep(currentStep, targetStep);
        }

        // Start execution
        execute();
    }

    // Expose setFormStep to global scope
    window.setFormStep = setFormStep;

    /**
     * Initialize form navigation when form block is loaded
     */
    window.addEventListener('block-loaded-form-report-flat', () => {
        /**
         * Attach click event listeners to navigation buttons
         */
        function attachButtonListeners() {
            $('#form-report-flat button').each(function () {
                const buttonText = $(this).text();

                if (buttonText.includes('Next') || buttonText.includes('Previous') || buttonText.includes('Finish')) {
                    $(this).off('click').on('click', function () {
                        console.log(buttonText + ' button clicked');

                        if (buttonText.includes('Next')) {
                            setFormStep({
                                direction: "next",
                                callback: function (result) {
                                    if (result) console.log("Successfully moved to next step");
                                    else console.log("Failed to move to next step");
                                }
                            });
                        }

                        if (buttonText.includes('Previous')) {
                            setFormStep({
                                direction: "previous",
                                callback: function (result) {
                                    if (result) console.log("Successfully moved to previous step");
                                    else console.log("Failed to move to previous step");
                                }
                            });
                        }

                        if (buttonText.includes('Finish')) {
                            setFormStep({
                                direction: "next",
                                callback: function (result) {
                                    if (result) console.log("Successfully moved to finish step");
                                    else console.log("Failed to move to finish step");
                                }
                            });
                        }

                        // Check for new buttons after navigation
                        checkForNewButtons();
                    });
                }
            });
        }

        /**
         * Check for dynamically added navigation buttons
         */
        function checkForNewButtons() {
            const intervalId = setInterval(function () {
                const newButtons = $('#form-report-flat button').filter(function () {
                    const buttonText = $(this).text();
                    return buttonText.includes('Next') || buttonText.includes('Previous') || buttonText.includes('Finish');
                });

                if (newButtons.length > 0) {
                    attachButtonListeners();
                    clearInterval(intervalId);
                }
            }, 500);
        }

        // Initialize button listeners
        attachButtonListeners();
    });

})();
