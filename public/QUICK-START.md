# 🎯 FlatFacts CDN Migration - Quick Reference

## ✅ What Was Created

### 📂 Structure
```
public/
├── scripts/
│   ├── core/
│   │   ├── common-helpers.js      ✅ Created (unified from all helpers.html)
│   │   └── navigation-core.js     ✅ Created (extracted reusable framework)
│   └── pages/
│       └── report-flat/
│           └── navigation-config.js  ✅ Created (sample config)
├── styles/
│   ├── core/
│   │   ├── form-helpers.css       ✅ Created
│   │   ├── address-finder.css     ✅ Created
│   │   ├── email-verification.css ✅ Created
│   │   └── social-share.css       ✅ Created
│   └── pages/
│       ├── category-selection.css ✅ Created
│       └── score-entry.css        ✅ Created
├── html/
│   └── common-elements.html       ✅ Created
├── README.md                      ✅ Created (full documentation)
└── example-usage.html             ✅ Created (usage example)
```

## 🎬 How to Use (Quick Start)

### 1️⃣ Add to Your HTML `<head>`
```html
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/social-share.css?v=1.0.0">
```

### 2️⃣ Add Before Closing `</body>`
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
```

### 3️⃣ For Report Flat Page
```html
<!-- Additional CSS -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/category-selection.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/score-entry.css?v=1.0.0">

<!-- Additional JS -->
<script src="https://cdn.flatfacts.co.uk/scripts/pages/report-flat/navigation-config.js?v=1.0.0"></script>
```

## 💡 Key Benefits

### Before
- ❌ 4 copies of helpers.html (~2,400 lines total)
- ❌ Manual copy-paste for every change
- ❌ Inconsistencies between pages
- ❌ Large inline scripts in 3rd party tool

### After
- ✅ 1 unified common-helpers.js (700 lines)
- ✅ Reference via URL - no copy-paste
- ✅ Single source of truth
- ✅ Cleaner, smaller page code

## 🔄 Development Workflow

### During Development
Use `Date.now()` for version to bypass cache:
```html
<script>
  const v = Date.now();
</script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=${v}"></script>
```

Or just disable cache in DevTools (Network tab).

### Production
Use fixed version numbers:
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
```

Update version when you change the file:
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.1"></script>
```

## 🎯 Usage by Page

### Report Flat Page (5-step form)
**Required scripts:**
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/pages/report-flat/navigation-config.js?v=1.0.0"></script>
```

**Required styles:**
```html
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/social-share.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/category-selection.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/pages/score-entry.css?v=1.0.0">
```

### Claim Ownership Page (3-step form)
**Required scripts:**
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/pages/claim-ownership/navigation-config.js?v=1.0.0"></script>
```

**Required styles:**
```html
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/social-share.css?v=1.0.0">
```

### Search Flat Page (Single-step form)
**Required scripts:**
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/pages/search-flat/navigation-config.js?v=1.0.0"></script>
```

**Required styles:**
```html
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
```

### Check Flat Page (Display page)
**Required scripts:**
```html
<script src="https://cdn.flatfacts.co.uk/scripts/core/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/core/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/scripts/pages/check-flat/navigation-config.js?v=1.0.0"></script>
```

**Required styles:**
```html
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/styles/core/address-finder.css?v=1.0.0">
```

## 📋 Next Steps for You

1. **Deploy to GitHub Pages**
   - Push the `public/` folder to your GitHub repository
   - Configure GitHub Pages to serve from this folder
   - Ensure custom domain `cdn.flatfacts.co.uk` points to it

2. ✅ **Navigation Configs Created** for all pages:
   - ✅ `public/scripts/pages/report-flat/navigation-config.js`
   - ✅ `public/scripts/pages/claim-ownership/navigation-config.js`
   - ✅ `public/scripts/pages/check-flat/navigation-config.js`
   - ✅ `public/scripts/pages/search-flat/navigation-config.js`

3. **Migrate Pages**
   - Start with report-flat (config already created)
   - Remove old inline scripts from your 3rd party tool
   - Add CDN script tags instead (see "Usage by Page" above)
   - Test thoroughly

4. **Extract Component JS** (optional for later):
   - Address finder logic → `scripts/components/address-finder.js`
   - Email verification logic → `scripts/components/email-verification.js`
   - Social share logic → `scripts/components/social-share.js`

## 🚨 Important Notes

- jQuery must be loaded before FlatFacts scripts
- External dependencies (getaddress.io, uuid) still need to be loaded in page-specific files
- Custom events (like `update-fields-form-report-flat`) must be handled by your form system
- Page-specific handlers (like `handleCategoryStep()`) must be defined in your step files

## 📚 Files to Review

1. **README.md** - Complete documentation
2. **example-usage.html** - Full working example
3. **scripts/core/common-helpers.js** - All unified helper functions
4. **scripts/pages/report-flat/navigation-config.js** - Sample navigation config

## 🎉 Summary

You now have a complete, organized CDN structure for your FlatFacts scripts and styles!

**What's unified:**
- ✅ All helper functions (notifications, element finding, moving, user info, auth)
- ✅ Navigation framework (core logic extracted)
- ✅ All CSS organized by component
- ✅ Common HTML elements

**What remains page-specific:**
- Navigation configurations (step definitions, transitions, validations)
- Step-specific handlers (category, scores, email logic)
- External dependencies

Ready to deploy to `https://cdn.flatfacts.co.uk/`! 🚀
