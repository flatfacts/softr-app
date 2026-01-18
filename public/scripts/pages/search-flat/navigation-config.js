/**
 * Navigation configuration for Search Flat page
 * @requires navigation-core.js
 * @requires common-helpers.js
 */

// Custom update fields function for this page
function __updateFields(fieldsObj) {
    const updateFieldsObj = new CustomEvent('update-fields-form-search-flat', {
        detail: fieldsObj
    });
    window.dispatchEvent(updateFieldsObj)
}

// Navigation configuration
const SEARCH_FLAT_NAV_CONFIG = {
    // Step signatures - using unique text content to identify each step
    stepSignatures: [
        // Step 1 - Address (Only step for search-flat)
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
        }
    ],

    // Step container mappings
    stepContainers: {
        0: [
            { id: "find-address-container", target: { textContent: "Flat Address" } }
        ]
    },

    // Transition definitions (no transitions needed for single-step form)
    transitions: {}
};

// Initialize navigation when form is loaded
window.addEventListener('block-loaded-form-search-flat', () => {
    // For single-step form, just initialize the step
    setFormStep({
        stepIndex: 0,
        ...SEARCH_FLAT_NAV_CONFIG,
        callback: function (result) {
            if (result) {
                console.log("Successfully initialized search-flat form");
            }
        }
    });
});
