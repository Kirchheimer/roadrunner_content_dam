# CWCAGScanner Embed Documentation

This document explains how to use the modular embed system for the CWCAGScanner content.

## Available Embed Options

### 1. Hero Section Only
**File:** `embed-hero.html`
**Content:** Displays the main hero section with title, subtitle, and call-to-action buttons.
**Usage:**
```html
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-hero.html" 
        width="100%" height="400" frameborder="0"></iframe>
```

### 2. How It Works Section
**File:** `embed-how-it-works.html`
**Content:** Displays the 3-step process using DaisyUI steps component.
**Usage:**
```html
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-how-it-works.html" 
        width="100%" height="500" frameborder="0"></iframe>
```

### 3. WCAG Coverage Section
**File:** `embed-wcag-coverage.html`
**Content:** Displays the three WCAG version cards with features.
**Usage:**
```html
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-wcag-coverage.html" 
        width="100%" height="600" frameborder="0"></iframe>
```

### 4. Dynamic Section Embed
**File:** `embed-section.html`
**Content:** Displays any section by ID parameter.
**Usage:**
```html
<!-- Why WCAG Matters -->
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-section.html?section=why-wcag-matters" 
        width="100%" height="500" frameborder="0"></iframe>

<!-- Proactive Monitoring -->
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-section.html?section=proactive-monitoring" 
        width="100%" height="400" frameborder="0"></iframe>

<!-- Compliance Levels -->
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-section.html?section=compliance-levels" 
        width="100%" height="600" frameborder="0"></iframe>

<!-- Developer Tools -->
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed-section.html?section=developer-tools" 
        width="100%" height="700" frameborder="0"></iframe>
```

### 5. All Content (Original)
**File:** `embed.html`
**Content:** Displays all sections sequentially (original behavior).
**Usage:**
```html
<iframe src="https://kirchheimer.github.io/roadrunner_content_dam/projects/cwcagscanner/embed.html" 
        width="100%" height="800" frameborder="0"></iframe>
```

## Available Section IDs

For use with `embed-section.html?section=SECTION_ID`:

- `why-wcag-matters` - Two-column layout explaining importance of WCAG compliance
- `proactive-monitoring` - Single-column hero section about 24/7 monitoring
- `how-it-works` - Three-step process with numbered steps
- `wcag-coverage` - Three cards showing WCAG 2.0, 2.1, and 2.2 features
- `compliance-levels` - Three-column comparison of A, AA, and AAA levels
- `developer-tools` - Feature grid showing developer-focused tools

## DaisyUI Theme Integration

All embeds use the `bumblebee` DaisyUI theme and include:
- Responsive design (mobile-first)
- DaisyUI component classes
- Consistent color scheme
- Loading states
- Error handling

## Styling Notes

- All embeds use DaisyUI classes exclusively (no custom CSS)
- The `bumblebee` theme is applied via `data-theme="bumblebee"`
- Responsive breakpoints follow Tailwind/DaisyUI standards
- All content is properly escaped to prevent XSS

## Recommended Usage for wcagscanner.com

Based on your current two-column layout, consider:

1. **Left column options:**
   - Use `embed-hero.html` for a clean hero section
   - Use `embed-section.html?section=how-it-works` for the process overview
   - Use `embed-wcag-coverage.html` for feature highlights

2. **Multiple sections:**
   - Create multiple smaller iframes for different sections
   - Stack them vertically or use in different parts of the page

3. **Dynamic content:**
   - Use `embed-section.html` with different section parameters
   - Change content based on user context or page location

## Error Handling

All embeds include built-in error handling:
- Network errors show user-friendly messages
- Missing sections show available options
- Loading states provide user feedback

## Performance Considerations

- Each embed loads the full `content.json` file
- Consider caching strategies for multiple embeds on the same page
- Iframes are isolated and won't conflict with parent page styles
