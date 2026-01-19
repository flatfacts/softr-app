/**
 * Navigation configuration for Report Flat page
 * @requires navigation-core.js
 * @requires common-helpers.js
 */

// Custom update fields function for this page
function __updateFields(fieldsObj) {
    const updateFieldsObj = new CustomEvent('update-fields-form-report-flat', {
        detail: fieldsObj
    });
    window.dispatchEvent(updateFieldsObj)
}

// Navigation configuration
const REPORT_FLAT_NAV_CONFIG = {
    // Step signatures - using unique text content to identify each step
    stepSignatures: [
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
            },
            handler: async function() {
                await new Promise(resolve => {
                    __findElement({
                        labelContent: "category_ids_link",
                        useTimeout: true,
                        maxRetries: -1,
                        interval: 100,
                        callback: function (result) {
                            if (result) {
                                console.log("Category ID element found, running category step handler");
                                if (typeof handleCategoryStep === 'function') {
                                    handleCategoryStep();
                                }
                            } else {
                                console.error("Category ID element not found after retries");
                            }
                            resolve();
                        }
                    });
                });
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
            validate: function () { return true; },
            handler: async function() {
                await new Promise(resolve => {
                    __findElement({
                        labelContent: "score_ids_link",
                        useTimeout: true,
                        maxRetries: -1,
                        interval: 100,
                        callback: function (result) {
                            if (result) {
                                console.log("Sub Category Scores element found, running category step handler");
                                if (typeof handleScoresStep === 'function') {
                                    handleScoresStep();
                                }
                            } else {
                                console.error("Sub Category Scores element not found after retries");
                            }
                            resolve();
                        }
                    });
                });
            }
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
                isValidEmail = localStorage.getItem('validatedEmail');
                if (!isValidEmail) {
                    __showNotification("You have to validate your email")
                    return false
                }
                return true
            },
            handler: async function() {
                await new Promise(resolve => {
                    __findElement({
                        labelContent: "Email",
                        useTimeout: true,
                        maxRetries: -1,
                        interval: 100,
                        callback: function (result) {
                            if (result) {
                                console.log("Email element found, running email step handler");
                                if (typeof handleEmailStep === 'function') {
                                    handleEmailStep();
                                }
                            } else {
                                console.error("Email element not found after retries");
                            }
                            resolve();
                        }
                    });
                });
            }
        },
        // Step 5 - Finish
        {
            name: "finish-message",
            textIdentifier: "Know someone",
            hideElements: [],
            validate: function () { return true; },
            handler: async function() {
                await new Promise(resolve => {
                    __findElement({
                        textContent: "High Five",
                        useTimeout: true,
                        maxRetries: -1,
                        interval: 100,
                        callback: function (result) {
                            if (result) {
                                console.log("High Five element found, running finish step handler");
                                if (typeof handleFinishStep === 'function') {
                                    handleFinishStep();
                                }
                            } else {
                                console.error("High Five element not found after retries");
                            }
                            resolve();
                        }
                    });
                });
            }
        }
    ],

    // Step container mappings
    stepContainers: {
        0: [
            { id: "find-address-container", target: { textContent: "Flat Address" } }
        ],
        1: [
            { id: "categories-container", target: { textContent: "Choose one or more categories" } }
        ],
        2: [
            { id: "scores-container", target: { textContent: "Score only the relevant issues" } }
        ],
        3: [
            { id: "email-verification-container", target: { textContent: "Submit it" } }
        ],
        4: [
            { id: "e-social-share-container", target: { textContent: "Know someone" } }
        ]
    },

    // Transition definitions
    transitions: {
        // From Step 1 to Step 2 (Address to Category)
        "0-1": [
            {
                sourceElement: { id: "find-address-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "categories-container" },
                targetElement: { textContent: "Choose one or more categories" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 2 to Step 1 (Category to Address)
        "1-0": [
            {
                sourceElement: { id: "categories-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "find-address-container" },
                targetElement: { textContent: "Flat Address" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 2 to Step 3 (Category to Score)
        "1-2": [
            {
                sourceElement: { id: "categories-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "scores-container" },
                targetElement: { textContent: "Score only the relevant issues" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 3 to Step 2 (Score to Category)
        "2-1": [
            {
                sourceElement: { id: "scores-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "categories-container" },
                targetElement: { textContent: "Choose one or more categories" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 3 to Step 4 (Score to Email)
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
        // From Step 4 to Step 3 (Email to Scores)
        "3-2": [
            {
                sourceElement: { id: "email-verification-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "scores-container" },
                targetElement: { textContent: "Score only the relevant issues" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 4 to Step 5 (Email to Finish)
        "3-4": [
            {
                sourceElement: { id: "email-verification-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "e-social-share-container" },
                targetElement: { textContent: "Know someone" },
                useTimeout: true,
                maxRetries: -1
            }
        ]
    }
};

// Attach button listeners when form is loaded
window.addEventListener('block-loaded-form-report-flat', () => {
    // Ensure functions are available
    if (typeof setFormStep === 'undefined') {
        console.error('setFormStep is not defined. Make sure navigation-core.js is loaded before navigation-config.js');
        return;
    }
    
    console.log('Navigation config ready, waiting for step initialization...');
    // Note: Step initialization happens in step-1-address-entry.html
    // We just attach the button listeners here after a short delay to ensure DOM is ready
    setTimeout(() => {
        attachNavigationListeners('#form-report-flat', REPORT_FLAT_NAV_CONFIG);
    }, 500);
});
