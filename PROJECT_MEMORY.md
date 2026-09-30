# PUC Calibration & AMC (Shreeji) - Project Memory & Architecture Guide

## 📋 Overview
**PUC Calibration Shreeji** is a web-based utility designed to generate, preview, format, calibrate, and print PUC (Pollution Under Control) calibration certificates and AMC (Annual Maintenance Contract) certificates for both Petrol and Diesel vehicle testing equipment.

---

## 🏗️ Project Architecture & Directory Structure

```
puc-calibration/
├── index.html               # Main landing page with category tabs (PUC Calibration vs AMC Documents)
├── app.js                   # Client-side JS handling date conversions, dynamic injection & live position adjuster with localStorage
├── style.css                # Global stylesheet for the landing page (index.html)
├── README.md                # Project summary
├── PROJECT_MEMORY.md        # Comprehensive memory, architecture & context document
├── page/                    # Page routes
│   ├── petrol.html          # Petrol PUC Calibration page (with interactive adjuster)
│   ├── diesel.html          # Diesel PUC Calibration page (with interactive adjuster)
│   ├── petrol-amc.html      # Petrol AMC Certificate page (with interactive adjuster)
│   └── diesel-amc.html      # Diesel AMC Certificate page (with interactive adjuster)
├── stye/                    # Stylesheets for pages
│   ├── petrol.css           # Styling, layout, @media print & adjuster for petrol.html
│   ├── diesel.css           # Styling, layout, @media print & adjuster for diesel.html
│   ├── petrol-amc.css       # Styling, layout, @media print & adjuster for petrol-amc.html
│   └── diesel-amc.css       # Styling, layout, @media print & adjuster for diesel-amc.html
├── amc/                     # Raw AMC SVG assets
│   ├── PETROL-AMC.svg       # Petrol AMC SVG template (Gas Analyser Model AVG-500)
│   └── DIESEL-AMC.svg       # Diesel AMC SVG template (Smoke Meter Model AVS-100)
├── svg/                     # Visual assets & Certificate templates
│   ├── PETROL.svg           # High-resolution Petrol PUC certificate template (816x1056)
│   ├── DIESEL.svg           # High-resolution Diesel PUC certificate template (816x1056)
│   ├── PETROL-AMC.svg       # High-resolution Petrol AMC certificate template
│   ├── DIESEL-AMC.svg       # High-resolution Diesel AMC certificate template
│   ├── bg.avif              # Background image asset
│   └── p.png                # PNG asset
└── Untitled-1.txt           # Reference HTML backup
```

---

## ⚙️ Core Workflows & Logic

### 1. Navigation Flow
- `index.html` features modern category tabs:
  - **PUC Calibration**:
    - Petrol: `page/petrol.html`
    - Diesel: `page/diesel.html`
  - **AMC Documents**:
    - Petrol AMC: `page/petrol-amc.html`
    - Diesel AMC: `page/diesel-amc.html`
- All certificate pages include a "← Back" button to navigate back to `index.html`.

### 2. Date Transformation & Injection (`app.js`)
- Date pickers (`#date` and `#date1`) emit dates in `YYYY-MM-DD` format.
- `formatDate()` formats date to `DD/MM/YYYY`:
  - PUC: Injects into `#formattedDate` (`DATE:`)
  - AMC: Injects into both `#formattedDate` (`DATE:`) and `#formattedDate_from` (`FROM :`)
- `formatDate1()` formats date to `DD/MM/YYYY`:
  - PUC: Injects into `#formattedDate1` (`7.0 Next Calibration Date:`)
  - AMC: Injects into `#formattedDate_to` (`TO :`)

### 3. Certificate Coordinates (816px x 1056px Sheet) - Baseline Coordinates
- **PUC Calibration (`PETROL.svg` & `DIESEL.svg`):**
  - `#Starting` (Top Date, beside `DATE:`): `top: 292px; left: 583px;` (Font: 20px Bold Italic Arial)
  - `#Starting1` (Bottom Date, inside Row 7.0): `top: 825px; left: 282px;` (Font: 13px Bold Arial)
- **AMC Contracts (`PETROL-AMC.svg` & `DIESEL-AMC.svg`):**
  - **Petrol AMC (Calibrated)**:
    - `#Starting` (Top Date, beside `DATE:`): `top: 251px; left: 614px;` (Font: 13px Bold Italic Calibri)
    - `#StartingFrom` (Contract `FROM :`): `top: 340px; left: 532px;` (Font: 13px Bold Bookman Old Style)
    - `#StartingTo` (Contract `TO :`): `top: 355px; left: 83px;` (Font: 13px Bold Bookman Old Style)
  - **Diesel AMC**:
    - `#Starting` (Top Date): `top: 251px; left: 614px;`
    - `#StartingFrom` (Contract `FROM :`): `top: 340px; left: 532px;`
    - `#StartingTo` (Contract `TO :`): `top: 355px; left: 83px;`
- **Live Position Adjuster (`#adjusterPanel`):**
  - Interactive fine-tuning (1px nudge ▲ ▼ ◀ ▶ or direct number input).
  - 💾 **Save Position** button saves coordinates permanently to `localStorage`.
  - 🔄 **Reset Defaults** button restores original calibrated coordinates.
  - Completely hidden during printing and PDF download (`@media print`).

### 4. Print & PDF Generation
- "DOWNLOAD" button triggers browser `window.print()`.
- `@media print` CSS rules:
  - Hides navigation (`nav.controls-bar`), buttons (`#printpdf`), headers (`.app-header`), labels, raw inputs (`#date`, `#date1`), adjuster panel (`.position-adjuster`), and footer.
  - Retains the exact 816x1056 certificate container at `(0, 0)` with no margins (`@page { size: letter portrait; margin: 0; }`), ensuring crisp, authentic, distortion-free certificate export.

---

## 👨‍💻 Developer
Developed by **Sapariya Darshit** ([Contact on WhatsApp](https://wa.me/918347402205))
