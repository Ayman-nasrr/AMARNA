# AMARNA — Discover the Streets of History

A responsive, bilingual (Arabic/English) static website built with HTML, CSS, and vanilla JavaScript.

## Run locally

1. Extract the ZIP file.
2. Open the `AMARNA_REDESIGN` folder in Visual Studio Code.
3. Open `index.html` with the VS Code Live Server extension, or use any local static web server.
4. Keep the `css`, `js`, and `assets` directories beside `index.html`.

No build command, package manager, framework, or backend is required.

## Features

- Responsive layouts for desktop, tablet, and phone.
- Arabic/English language switch, including `dir="rtl"` / `dir="ltr"`.
- Seven clickable landmark cards with bilingual detail dialogs.
- Mobile navigation, reading progress indicator, back-to-top button, and scroll reveal effects.
- Reduced-motion support and a custom cursor (including over the landmark detail dialog) only on fine-pointer desktop devices.
- Brand lockup recreated as a compact emblem plus live text, instead of placing the original rectangular logo artwork in the header.
- Photos are hotlinked from Wikimedia Commons; an image credit/source list is included.

## Deployment

This is a plain static site. For Vercel, set Framework Preset to `Other`, leave Build Command empty, and use `.` for Output Directory when `index.html` is at the repository root.


## Brand assets and pointer behavior

- `assets/amarna-emblem.png` is the transparent emblem extracted from the supplied AMARNA logo artwork.
- `assets/amarna-wordmark.png` contains the custom AMARNA letterform; the tagline is rendered as HTML text so it stays crisp and can switch between Arabic and English.
- `assets/amarna-favicon.png` is the browser-tab icon based on the same emblem.
- The custom cursor (including over the landmark detail dialog) is disabled while landmark details are open, so the native mouse pointer remains visible above the browser's modal dialog layer.

When replacing these assets, keep their paths unchanged or update the references in `index.html`.
