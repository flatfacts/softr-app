/**
 * Navigation configuration for Claim Ownership page
 * @requires navigation-core.js
 * @requires common-helpers.js
 */

// Custom update fields function for this page
function __updateFields(fieldsObj) {
    const updateFieldsObj = new CustomEvent('update-fields-form-claim-ownership', {
        detail: fieldsObj
    });
    window.dispatchEvent(updateFieldsObj)
}

// Navigation configuration
const CLAIM_OWNERSHIP_NAV_CONFIG = {
    // Step signatures - using unique text content to identify each step
    stepSignatures: [
        // Step 1 - Address
        {
            name: "address-entry",
            textIdentifier: "Property Address",
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
        // Step 2 - Property Details
        {
            name: "property-entry",
            textIdentifier: "Property Details",
            hideElements: [
                {
                    type: "labelContaining",
                    text: "reporter_sys_info",
                    operation: "hideParentDiv"
                }
            ],
            validate: function () {
                // Existing email validation
                const isValidEmail = localStorage.getItem('validatedEmail');
                if (!isValidEmail) {
                    __showNotification("You have to validate your email");
                    return false;
                }

                // Add file validation
                if (window.fileValidator && typeof window.fileValidator.validate === 'function') {
                    const isValidFile = window.fileValidator.validate();
                    if (!isValidFile) {
                        return false;
                    }
                }

                return true;
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
                                if (typeof handlePropertyDetailsStep === 'function') {
                                    handlePropertyDetailsStep();
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
        // Step 3 - Finish
        {
            name: "finish-message",
            textIdentifier: "We'll send you an email confirmation",
            hideElements: [],
            validate: function () { return true; },
            handler: async function() {
                await new Promise(resolve => {
                    __findElement({
                        textContent: "Thank you",
                        useTimeout: true,
                        maxRetries: -1,
                        interval: 100,
                        callback: function (result) {
                            if (result) {
                                console.log("Thank you element found, running finish step handler");
                                if (typeof handleFinishStep === 'function') {
                                    handleFinishStep();
                                }
                            } else {
                                console.error("Thank you element not found after retries");
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
            { id: "find-address-container", target: { textContent: "Property Address" } }
        ],
        1: [
            { id: "email-verification-container", target: { textContent: "Property Details" } }
        ],
        2: [
            { id: "e-social-share-container", target: { textContent: "We'll send you an email confirmation" } }
        ]
    },

    // Transition definitions
    transitions: {
        // From Step 1 to Step 2 (Address to Property Details)
        "0-1": [
            {
                sourceElement: { id: "find-address-container" },
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
        // From Step 2 to Step 1 (Property Details to Address)
        "1-0": [
            {
                sourceElement: { id: "email-verification-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "find-address-container" },
                targetElement: { textContent: "Property Address" },
                useTimeout: true,
                maxRetries: -1
            }
        ],
        // From Step 2 to Step 3 (Property Details to Finish)
        "1-2": [
            {
                sourceElement: { id: "email-verification-container" },
                targetElement: { id: "idle-container" },
                moveInside: true
            },
            {
                sourceElement: { id: "e-social-share-container" },
                targetElement: { textContent: "We'll send you an email confirmation" },
                useTimeout: true,
                maxRetries: -1
            }
        ]
    }
};

// Initialize navigation when form is loaded
window.addEventListener('block-loaded-form-claim-ownership', () => {
    attachNavigationListeners('#form-claim-ownership', CLAIM_OWNERSHIP_NAV_CONFIG);
});
