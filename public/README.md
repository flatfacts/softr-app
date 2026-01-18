# FlatFacts CDN Scripts & Styles

This directory contains unified JavaScript and CSS files for the FlatFacts application, designed to be hosted on GitHub Pages CDN at `https://cdn.flatfacts.co.uk/`.

## 📁 Directory Structure

```
public/
├── scripts/
│   ├── core/
│   │   ├── common-helpers.js          # Unified helper functions (all pages)
│   │   └── navigation-core.js         # Navigation framework (all pages)
│   ├── components/
│   │   ├── address-finder.js          # Address autocomplete logic (TODO)
│   │   ├── email-verification.js      # Email validation logic (TODO)
│   │   └── social-share.js            # Social sharing logic (TODO)
│   └── pages/
│       ├── report-flat/
│       │   └── navigation-config.js   # Page-specific navigation config
│       ├── claim-ownership/
│       │   └── navigation-config.js   # Page-specific navigation config (TODO)
│       ├── check-flat/
│       │   └── navigation-config.js   # Page-specific navigation config (TODO)
│       └── search-flat/
│           └── navigation-config.js   # Page-specific navigation config (TODO)
│
├── styles/
│   ├── core/
│   │   ├── form-helpers.css           # Notification styles
│   │   ├── address-finder.css         # Address input styles
│   │   ├── email-verification.css     # Email validation styles
│   │   └── social-share.css           # Social sharing styles
│   └── pages/
│       ├── category-selection.css     # Category button styles
│       └── score-entry.css            # Score input styles
│
└── html/
    └── common-elements.html            # Shared HTML components
```

## 🚀 Usage

### Basic Setup (All Pages)

Add these to your HTML `<head>`:

```html
<!-- Core CSS Files -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/social-share.css?v=1.0.0">

<!-- Core JavaScript Files (Before closing </body>) -->
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
```

### Page-Specific Setup

#### Report Flat Page

```html
<!-- Add to <head> after core CSS -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/category-selection.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/score-entry.css?v=1.0.0">

<!-- Add before closing </body> after core JS -->
<script src="https://cdn.flatfacts.co.uk/scripts/pages/report-flat/navigation-config.js?v=1.0.0"></script>
```

## 📦 What's Included

### Core JavaScript (`common-helpers.js`)

✅ **Unified from all helpers.html files** - Reduces ~2,400 lines to 700

- `__showNotification(message, duration)` - Show notification messages
- `__findElement(options)` - Find DOM elements with retry logic
- `__moveElement(options)` - Move elements in the DOM
- `__userInfo` - Browser/device/OS information utilities
- `AuthClient` - API client for email verification

### Navigation Core (`navigation-core.js`)

✅ **Extracted reusable navigation framework**

- `setFormStep(options)` - Main navigation function
- `attachNavigationListeners(formSelector, config)` - Auto-attach button handlers
- Supports step validation, transitions, and custom handlers

### Navigation Configs (Page-Specific)

Each page has its own navigation configuration file defining:
- Step signatures and identifiers
- Validation rules per step
- Container mappings
- Transition definitions
- Step-specific handlers

## 🎨 CSS Organization

### Core Styles (Shared)
- **form-helpers.css** - Notification components
- **address-finder.css** - Address input and autocomplete
- **email-verification.css** - Email validation UI
- **social-share.css** - Social sharing buttons

### Page-Specific Styles
- **category-selection.css** - Category selection buttons (report-flat)
- **score-entry.css** - Score input interface (report-flat)

## 🔄 Development Workflow

### During Development (Cache-busting)

Use dynamic version parameter to avoid caching issues:

```html
<script>
  const isDev = true; // Set to false for production
  const version = isDev ? Date.now() : '1.0.0';
  
  // Load scripts with dynamic version
  document.write(`<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=${version}"><\/script>`);
</script>
```

**OR** simply disable cache in your browser DevTools (Network tab → "Disable cache")

### Production

Use fixed version numbers:

```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
```

When you update a file, increment the version:
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.1"></script>
```

## 📝 Migration Guide

### For Each Page:

1. **Remove old inline scripts:**
   - Remove `helpers.html` content
   - Keep only page-specific logic from `navigation.html`

2. **Add CDN references:**
   - Add core CSS files to `<head>`
   - Add core JS files before `</body>`
   - Add page-specific CSS/JS as needed

3. **Create navigation config:**
   - Copy your page's step signatures
   - Define transitions
   - Add validation functions

4. **Test thoroughly:**
   - Verify all steps work
   - Check validation logic
   - Test navigation buttons

## 🔧 Functions Reference

### Common Helpers

```javascript
// Show notification
__showNotification('Your message here', 3000);

// Find element
const element = await __findElement({
    id: 'my-element',
    useTimeout: true,
    maxRetries: 30
});

// Move element
await __moveElement({
    sourceElement: { id: 'source' },
    targetElement: { id: 'target' },
    moveInside: true
});

// Get user info
const userInfo = await __userInfo.getAllUserInfo();
```

### Navigation

```javascript
// Set form step (with page-specific config)
setFormStep({
    direction: 'next',
    stepSignatures: REPORT_FLAT_NAV_CONFIG.stepSignatures,
    transitions: REPORT_FLAT_NAV_CONFIG.transitions,
    stepContainers: REPORT_FLAT_NAV_CONFIG.stepContainers,
    callback: (result) => console.log(result)
});

// Or using the config object directly
setFormStep({
    direction: 'next',
    ...REPORT_FLAT_NAV_CONFIG
});
```

## 🆕 Version History

- **v1.0.0** (2026-01-18) - Initial unified version
  - Unified common-helpers.js from all pages
  - Created navigation-core.js framework
  - Organized CSS into modular files
  - Created navigation config for report-flat page

## 📋 TODO

- [ ] Create navigation configs for remaining pages:
  - [ ] claim-ownership
  - [ ] check-flat
  - [ ] search-flat
- [ ] Extract component-specific JS:
  - [ ] address-finder.js
  - [ ] email-verification.js
  - [ ] social-share.js
- [ ] Migrate all pages to use CDN files
- [ ] Test cross-browser compatibility
- [ ] Setup GitHub Pages deployment

## 🤝 Contributing

When updating shared files:
1. Increment version number in file header comment
2. Update version in usage examples
3. Document breaking changes
4. Test on all affected pages before deploying

## ⚠️ Important Notes

- **jQuery is required** - All scripts assume jQuery is already loaded
- **External dependencies** - getaddress.io and uuid.js must be loaded separately in page-specific files
- **Custom events** - Some functions dispatch custom events (e.g., `update-fields-form-report-flat`) that need to be handled by your form system
- **Page-specific handlers** - Functions like `handleCategoryStep()` must be defined in your page-specific scripts

## 📞 Support

For questions or issues, contact the FlatFacts development team.
