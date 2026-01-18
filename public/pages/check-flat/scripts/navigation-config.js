/**
 * Navigation configuration for Check Flat page
 * Special configuration for display-only page with address-based content toggling
 * @requires navigation-core.js
 * @requires common-helpers.js
 */

// Hide elements immediately (before DOM loads to prevent flash)
const elementsToToggle = ['be-the-first-desktop', 'be-the-first-mobile'];
const elements = elementsToToggle.map(id => document.getElementById(id)).filter(el => el);
elements.forEach(element => {
    element.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", function () {
    const onRecords = (e) => {
        // Get the records data
        const records = e.detail;
        console.log('Records received:', records);
        
        if (records && records.length > 0) {
            // Has records - keep elements hidden
            elements.forEach(element => {
                element.style.display = 'none';
            });
        } else {
            // No records - show elements and update text if needed
            elements.forEach(element => {
                element.style.display = '';
                
                // Check for address parameter and update h1 text
                const urlParams = new URLSearchParams(window.location.search);
                const address = urlParams.get('address');
                
                if (address) {
                    const h1Element = element.querySelector('h1');
                    if (h1Element) {
                        // Get the address template and move it
                        const addressTemplate = document.getElementById('address-not-found');
                        addressTemplate.innerHTML = `🏠 ${address} `;
                        addressTemplate.style.setProperty('display', 'inline-block', 'important');
                        
                        // Move the element to the beginning of h1
                        h1Element.insertBefore(addressTemplate, h1Element.firstChild);
                    }
                }
            });
        }
    };
    
    // Listen for the property-info records event
    window.addEventListener('get-records-property-info', onRecords);
});

// Navigation configuration (minimal for check-flat)
const CHECK_FLAT_NAV_CONFIG = {
    // Step signatures - single step for check-flat
    stepSignatures: [
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

    // Transition definitions (no transitions for single-step)
    transitions: {}
};

// Custom update fields function for this page
function __updateFields(fieldsObj) {
    const updateFieldsObj = new CustomEvent('update-fields-form-check-flat', {
        detail: fieldsObj
    });
    window.dispatchEvent(updateFieldsObj)
}
