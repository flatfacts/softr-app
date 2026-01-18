# 🎯 FlatFacts CDN - Quick Reference

## 📂 Structure
```
public/
├── core/
│   ├── scripts/
│   │   ├── common-helpers.js
│   │   └── navigation-core.js
│   └── styles/
│       ├── form-helpers.css
│       ├── address-finder.css
│       ├── email-verification.css
│       └── social-share.css
├── pages/
│   ├── report-flat/
│   │   ├── scripts/
│   │   │   └── navigation-config.js
│   │   └── styles/
│   │       ├── category-selection.css
│   │       └── score-entry.css
│   ├── claim-ownership/
│   │   ├── scripts/
│   │   │   └── navigation-config.js
│   │   └── styles/
│   ├── check-flat/
│   │   ├── scripts/
│   │   │   └── navigation-config.js
│   │   └── styles/
│   └── search-flat/
│       ├── scripts/
│       │   └── navigation-config.js
│       └── styles/
├── components/
├── html/
│   └── common-elements.html
├── README.md
└── example-usage.html
```

## 🎬 Usage

### Report Flat

**🔧 Development (no cache)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/email-verification.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/social-share.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/pages/report-flat/styles/category-selection.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/pages/report-flat/styles/score-entry.css">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/report-flat/scripts/navigation-config.js"></script>
```

**🚀 Production (versioned)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/social-share.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/pages/report-flat/styles/category-selection.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/pages/report-flat/styles/score-entry.css?v=1.0.0">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/report-flat/scripts/navigation-config.js?v=1.0.0"></script>
```

---

### Claim Ownership

**🔧 Development (no cache)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/email-verification.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/social-share.css">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/claim-ownership/scripts/navigation-config.js"></script>
```

**🚀 Production (versioned)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/email-verification.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/social-share.css?v=1.0.0">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/claim-ownership/scripts/navigation-config.js?v=1.0.0"></script>
```

---

### Search Flat

**🔧 Development (no cache)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/search-flat/scripts/navigation-config.js"></script>
```

**🚀 Production (versioned)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css?v=1.0.0">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/search-flat/scripts/navigation-config.js?v=1.0.0"></script>
```

---

### Check Flat

**🔧 Development (no cache)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/check-flat/scripts/navigation-config.js"></script>
```

**🚀 Production (versioned)**
```html
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/form-helpers.css?v=1.0.0">
<link rel="stylesheet" href="https://cdn.flatfacts.co.uk/public/core/styles/address-finder.css?v=1.0.0">

<!-- Scripts -->
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/common-helpers.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/core/scripts/navigation-core.js?v=1.0.0"></script>
<script src="https://cdn.flatfacts.co.uk/public/pages/check-flat/scripts/navigation-config.js?v=1.0.0"></script>
```

---

## 💡 Tips

**Development:** No version params = always fetches latest (disable browser cache in DevTools for best results)

**Production:** Increment version number (`?v=1.0.1`) when you update any file to bust user caches

## 📋 Deployment

1. Push `public/` folder to GitHub repository
2. Configure GitHub Pages to serve from this folder
3. Point custom domain `cdn.flatfacts.co.uk` to GitHub Pages

## 📚 Documentation

- **README.md** - Complete documentation
- **example-usage.html** - Working example
