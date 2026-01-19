/**
 * FlatFacts Common Helpers
 * Unified utility functions used across all pages
 * @version 1.0.0
 * @requires jQuery
 */

/**
 * Shows a non-blocking notification message that fades out after a timeout
 * @param {string} message - Message to display
 * @param {number} [duration=3000] - Time in milliseconds before the notification disappears
 */
function __showNotification(message, duration = 3000) {
    // Get notification container.
    let notificationContainer = $('#form-notification-container');

    // Set notification element
    const notification = $('#form-notification').text(message);

    // Add to container
    notificationContainer.append(notification);

    // Fade in
    setTimeout(() => {
        notification.css('opacity', '1');
    }, 10);

    // Fade out and remove after duration
    setTimeout(() => {
        notification.css('opacity', '0');
    }, duration);
}

/**
 * Find a DOM element with timeout support
 * @param {Object} options - Configuration options
 * @param {string} [options.textContent] - Text content to search for in paragraphs
 * @param {string} [options.labelContent] - Text content to search for in labels
 * @param {string} [options.id] - ID of the element to find
 * @param {string} [options.selector] - CSS selector to find the element
 * @param {boolean} [options.useTimeout=false] - Whether to use timeout for retries
 * @param {number} [options.maxRetries=10] - Maximum number of retry attempts. Use -1 for infinite.
 * @param {number} [options.interval=500] - Interval between retries in milliseconds
 * @param {Function} [options.callback] - Optional callback function with result
 * @returns {Promise|jQuery|null} - Returns Promise when using timeout, jQuery element or null otherwise
 */
function __findElement(options) {
    let {
        textContent,
        labelContent,
        id,
        selector,
        useTimeout = false,
        maxRetries = 30,
        interval = 100,
        callback
    } = options;

    if (maxRetries === -1) {
        maxRetries = 5000;
        console.info("maxRetries auto set to 5000 to avoid infinite loop")
    }

    function search() {
        let element = null;

        if (textContent) {
            element = $("p, h1, h2, h3").filter(function () {
                return $(this).text().includes(textContent);
            });
        } else if (labelContent) {
            element = $("label span").filter(function () {
                return $(this).text().trim() === labelContent;
            }).closest('label');
        } else if (id) {
            element = $(`#${id}`);
        } else if (selector) {
            element = $(selector);
        }

        return element && element.length ? element : null;
    }

    // If using timeout, return a Promise
    if (useTimeout) {
        return new Promise((resolve) => {
            let attempts = 0;

            function attemptSearch() {
                const result = search();

                if (result) {
                    if (callback) callback(result);
                    resolve(result);
                } else if ((attempts < maxRetries) || (maxRetries === -1)) {
                    attempts++;
                    console.log(`Find attempt ${attempts}... Retrying in ${interval}ms.`);
                    setTimeout(attemptSearch, interval);
                } else {
                    console.log("Max retries reached, element not found.");
                    if (callback) callback(null);
                    resolve(null);
                }
            }

            attemptSearch();
        });
    } else {
        // Synchronous path
        const result = search();
        if (callback) callback(result);
        return result;
    }
}

/**
 * Universal element movement function with enhanced positioning capabilities
 * @param {Object} options - Configuration options
 * @param {jQuery|Object} options.sourceElement - Element to move or source element find options
 * @param {jQuery|Object} options.targetElement - Target element or target element find options
 * @param {boolean} [options.moveInside=false] - If true, moves inside target; if false, moves after
 * @param {boolean} [options.useTimeout=false] - Whether to use timeout for retries
 * @param {number} [options.maxRetries=10] - Maximum number of retry attempts
 * @param {number} [options.interval=500] - Interval between retries in milliseconds
 * @param {Function} [options.callback] - Optional callback function with result
 * @returns {Promise|jQuery|null} - Returns Promise when using timeout, jQuery element or null otherwise
 */
function __moveElement(options) {
    const {
        sourceElement,
        targetElement,
        moveInside = false,
        useTimeout = false,
        maxRetries = 30,
        interval = 100,
        callback
    } = options;

    // Helper function to check if object is a jQuery element
    function isJQueryElement(obj) {
        return obj && (obj instanceof jQuery || obj.jquery);
    }

    // Helper function to perform the actual move operation
    function performMove(source, target) {
        if (source && target) {
            if (moveInside) {
                source.appendTo(target);
            } else {
                // Check if this is a label found by labelContent
                const isFoundByLabelContent =
                    !isJQueryElement(targetElement) &&
                    targetElement.labelContent &&
                    target.is('label');

                if (isFoundByLabelContent && !moveInside) {
                    // Find the container with the input after this label
                    let inputContainer = null;
                    let currentElement = target[0];

                    // First, try to find the parent div of the label
                    const labelParent = target.closest('div');
                    if (labelParent.length > 0) {
                        // Look for the next sibling div that contains an input
                        const nextContainers = labelParent.nextAll('div');
                        for (let i = 0; i < nextContainers.length; i++) {
                            const container = $(nextContainers[i]);
                            if (container.find('input').length > 0) {
                                inputContainer = container;
                                break;
                            }
                        }

                        // If we found a container with an input, insert after it
                        if (inputContainer && inputContainer.length > 0) {
                            source.insertAfter(inputContainer);
                            return source;
                        }
                    }

                    // Fallback approach: look for the nearest container with an input
                    while (currentElement && !inputContainer) {
                        // Move to the next sibling
                        currentElement = currentElement.nextSibling;

                        if (currentElement && currentElement.nodeType === 1) { // Element node
                            const element = $(currentElement);

                            // If this element contains an input
                            if (element.find('input').length > 0) {
                                // Use the container element itself, not just the input
                                inputContainer = element;
                            }
                        }
                    }

                    // If we found a container with an input, insert after it
                    if (inputContainer && inputContainer.length > 0) {
                        source.insertAfter(inputContainer);
                    } else {
                        // Fallback to default behavior if no input container is found
                        source.insertAfter(target);
                    }
                } else {
                    // Default behavior: insert directly after the target
                    source.insertAfter(target);
                }
            }
            return source;
        }
        return null;
    }

    // Main execution path
    async function execute() {
        let source = sourceElement;
        let target = targetElement;

        // If source is a find configuration
        if (!isJQueryElement(source)) {
            // Apply the timeout setting from the main options if not specified
            const sourceOptions = { ...source };
            if (useTimeout && sourceOptions.useTimeout !== false) {
                sourceOptions.useTimeout = true;
                sourceOptions.maxRetries = sourceOptions.maxRetries || maxRetries;
                sourceOptions.interval = sourceOptions.interval || interval;
            }

            source = await Promise.resolve(__findElement(sourceOptions));
        }

        // If target is a find configuration
        if (!isJQueryElement(target)) {
            // Apply the timeout setting from the main options if not specified
            const targetOptions = { ...target };
            if (useTimeout && targetOptions.useTimeout !== false) {
                targetOptions.useTimeout = true;
                targetOptions.maxRetries = targetOptions.maxRetries || maxRetries;
                targetOptions.interval = targetOptions.interval || interval;
            }

            target = await Promise.resolve(__findElement(targetOptions));
        }

        // Now perform the move
        const result = performMove(source, target);
        if (callback) callback(result);
        return result;
    }

    // If using timeout, return a Promise
    if (useTimeout ||
        (!isJQueryElement(sourceElement) && sourceElement.useTimeout) ||
        (!isJQueryElement(targetElement) && targetElement.useTimeout)) {
        return execute();
    } else {
        // Synchronous path for simple cases
        const source = isJQueryElement(sourceElement) ? sourceElement : __findElement(sourceElement);
        const target = isJQueryElement(targetElement) ? targetElement : __findElement(targetElement);
        const result = performMove(source, target);
        if (callback) callback(result);
        return result;
    }
}

/**
 * User information utility object
 * Provides comprehensive browser, device, OS, and connection information
 */
const __userInfo = {
    // Raw user agent string
    getRawUserAgent: () => {
        return navigator.userAgent;
    },

    // Browser details with improved detection
    getBrowserDetails: () => {
        const ua = navigator.userAgent;
        let browserName = "Unknown";
        let browserVersion = "Unknown";

        // Order is important - most specific to most general
        // Check for Edge first (Edge has both "Chrome" and "Safari" in UA)
        if (ua.indexOf("Edg/") > -1) {
            browserName = "Edge";
            const match = ua.match(/Edg(?:e|)\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Check for Opera (Opera has both "Chrome" and "Safari" in UA)
        else if (ua.indexOf("OPR/") > -1 || ua.indexOf("Opera/") > -1) {
            browserName = "Opera";
            const match = ua.match(/(?:OPR|Opera)\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Check for Firefox
        else if (ua.indexOf("Firefox/") > -1) {
            browserName = "Firefox";
            const match = ua.match(/Firefox\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Check for Chrome (Chrome has "Safari" in UA)
        else if (ua.indexOf("Chrome/") > -1) {
            browserName = "Chrome";
            const match = ua.match(/Chrome\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Safari must be checked after Chrome
        else if (ua.indexOf("Safari/") > -1) {
            browserName = "Safari";
            const match = ua.match(/Version\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Internet Explorer
        else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) {
            browserName = "Internet Explorer";
            const match = ua.match(/(?:MSIE |rv:)([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }
        // Brave detection (challenging as it uses Chrome UA)
        // Note: This is a basic detection and may not be fully reliable
        else if (ua.indexOf("Chrome") > -1 && window.navigator.brave !== undefined) {
            browserName = "Brave";
            const match = ua.match(/Chrome\/([0-9.]+)/);
            browserVersion = match ? match[1] : "Unknown";
        }

        return { name: browserName, version: browserVersion };
    },

    // Device type detection
    getDeviceType: () => {
        const ua = navigator.userAgent;

        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    },

    // Operating system detection
    getOS: () => {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        let os = null;
        let version = "Unknown";

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'macOS';
            const match = userAgent.match(/Mac OS X ([0-9_]+)/);
            if (match) {
                version = match[1].replace(/_/g, '.');
            }
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
            const match = userAgent.match(/OS ([0-9_]+)/);
            if (match) {
                version = match[1].replace(/_/g, '.');
            }
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
            const match = userAgent.match(/Windows NT ([0-9.]+)/);
            if (match) {
                const ntVersion = match[1];
                // Map NT version to Windows version
                const versionMap = {
                    '10.0': '10/11', // Can't reliably distinguish Windows 10/11
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.2': 'XP 64-bit',
                    '5.1': 'XP',
                    '5.0': '2000'
                };
                version = versionMap[ntVersion] || ntVersion;
            }
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
            const match = userAgent.match(/Android ([0-9.]+)/);
            if (match) {
                version = match[1];
            }
        } else if (/Linux/.test(platform)) {
            os = 'Linux';
        } else if (/CrOS/.test(userAgent)) {
            os = 'ChromeOS';
        }

        return { name: os, version: version };
    },

    // Screen size info with more details
    getScreenInfo: () => {
        const screenInfo = {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: window.screen.orientation ?
                window.screen.orientation.type :
                (window.innerHeight > window.innerWidth ? "portrait" : "landscape")
        };

        // Add viewport dimensions
        screenInfo.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        return screenInfo;
    },

    // Connection info (if available)
    getConnectionInfo: () => {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                type: conn.effectiveType || "Unknown",
                downlink: conn.downlink || "Unknown",
                rtt: conn.rtt || "Unknown",
                saveData: conn.saveData || false,
                downlinkMax: conn.downlinkMax || "Unknown"
            };
        }
        return null;
    },

    // Get user's IP address (requires external API)
    getUserIP: async () => {
        try {
            // Using a public API to get IP info
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Error fetching IP:", error);
            return "Unknown";
        }
    },

    // Get preferred language
    getLanguageInfo: () => {
        return {
            preferredLanguage: navigator.language,
            allLanguages: navigator.languages
        };
    },

    // Get hardware information (limited)
    getHardwareInfo: () => {
        const hardwareInfo = {
            cores: navigator.hardwareConcurrency || "Unknown",
            memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown"
        };

        return hardwareInfo;
    },

    // Consolidated function that returns all info as JSON
    getAllUserInfo: async () => {
        // Gather all the data into a single object
        const userInfoData = {
            rawUserAgent: __userInfo.getRawUserAgent(),
            browser: __userInfo.getBrowserDetails(),
            deviceType: __userInfo.getDeviceType(),
            operatingSystem: __userInfo.getOS(),
            screen: __userInfo.getScreenInfo(),
            connection: __userInfo.getConnectionInfo(),
            hardware: __userInfo.getHardwareInfo(),
            language: __userInfo.getLanguageInfo(),
            ip: await __userInfo.getUserIP(),
            timestamp: new Date().toISOString()
        };

        // Return as formatted JSON
        return JSON.stringify(userInfoData, null, 2);
    }
};

/**
 * Authentication client for FlatFacts API
 * Handles email verification, code validation, and email sending
 */
class AuthClient {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL || 'https://api.flatfacts.co.uk';
        this.dev = options.dev || false;
    }
    
    _log(...args) {
        if (this.dev) {
            console.log('[AuthClient]', ...args);
        }
    }
    
    _error(...args) {
        if (this.dev) {
            console.error('[AuthClient]', ...args);
        }
    }
    
    async _makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': navigator.language || 'en-US',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        
        const requestOptions = { ...defaultOptions, ...options };
        
        this._log(`Making request to: ${endpoint}`);
        
        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 403) {
                    throw new Error(errorData.message || 'Access denied. Please ensure you are using a supported browser.');
                } else if (response.status === 429) {
                    throw new Error(errorData.message || 'Too many requests. Please wait before trying again.');
                } else if (response.status === 404) {
                    throw new Error('Service temporarily unavailable. Please try again later.');
                }
                
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this._log(`Response from ${endpoint}:`, data);
            return data;
            
        } catch (error) {
            this._error(`Request failed for ${endpoint}:`, error.message);
            throw error;
        }
    }
    
    _generateUserIdentifier(email) {
        return btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    }
    
    async sendVerificationCode(email) {
        try {
            const userIdentifier = this._generateUserIdentifier(email);
            
            this._log('Sending verification code to:', email);
            const response = await this._makeRequest('/send-verification-code', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    user_identifier: userIdentifier
                })
            });
            
            if (response.success) {
                this._log('Verification code sent successfully');
                return response;
            }
            
            throw new Error(response.message || 'Failed to send verification code');
            
        } catch (error) {
            this._error('Send verification code failed:', error.message);
            throw error;
        }
    }
    
    async validateCode(code, email) {
        try {
            const userIdentifier = this._generateUserIdentifier(email);
            
            this._log('Validating code for:', email);
            const response = await this._makeRequest('/validate-code', {
                method: 'POST',
                body: JSON.stringify({
                    code: code,
                    email: email,
                    user_identifier: userIdentifier
                })
            });
            
            if (response.success) {
                this._log('Code validation successful');
                return response;
            }
            
            throw new Error(response.message || 'Failed to validate code');
            
        } catch (error) {
            this._error('Code validation failed:', error.message);
            throw error;
        }
    }
    
    async sendWelcomeEmail(email, name) {
        try {
            this._log('Sending welcome email to:', email);
            const response = await this._makeRequest('/send-welcome-email', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    name: name
                })
            });
            
            if (response.success) {
                this._log('Welcome email sent successfully');
                return response;
            }
            
            throw new Error(response.message || 'Failed to send welcome email');
            
        } catch (error) {
            this._error('Send welcome email failed:', error.message);
            throw error;
        }
    }
    
    async sendCustomEmail(email, templateType, variables, subject) {
        try {
            this._log('Sending custom email to:', email);
            const response = await this._makeRequest('/send-custom-email', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    template_type: templateType,
                    variables: variables,
                    subject: subject
                })
            });
            
            if (response.success) {
                this._log('Custom email sent successfully');
                return response;
            }
            
            throw new Error(response.message || 'Failed to send custom email');
            
        } catch (error) {
            this._error('Send custom email failed:', error.message);
            throw error;
        }
    }
    
    async checkHealth() {
        try {
            const response = await this._makeRequest('/health');
            this._log('Health check result:', response);
            return response;
        } catch (error) {
            this._error('Health check failed:', error.message);
            throw error;
        }
    }
}
