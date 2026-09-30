/**
 * PUC Calibration & AMC Shreeji - Client Logic
 * Handles real-time date formatting, dynamic certificate injection,
 * and live fine-tuning of certificate date positions.
 */

// Identify current page context
function getPageKey() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("petrol-amc")) return "petrol-amc";
    if (path.includes("diesel-amc")) return "diesel-amc";
    if (path.includes("diesel")) return "diesel";
    return "petrol";
}

const pageKey = getPageKey();

// Navigation Functions
function petrol() {
    location.replace(window.location.pathname.includes("/page/") ? "petrol.html" : "page/petrol.html");
}
function diesel() {
    location.replace(window.location.pathname.includes("/page/") ? "diesel.html" : "page/diesel.html");
}
function petrolAmc() {
    location.replace(window.location.pathname.includes("/page/") ? "petrol-amc.html" : "page/petrol-amc.html");
}
function dieselAmc() {
    location.replace(window.location.pathname.includes("/page/") ? "diesel-amc.html" : "page/diesel-amc.html");
}

// Default calibrated baseline coordinates per page
const DEFAULT_COORDS = {
    petrol: {
        Starting: { top: 292, left: 583 },
        Starting1: { top: 825, left: 282 }
    },
    diesel: {
        Starting: { top: 292, left: 583 },
        Starting1: { top: 825, left: 282 }
    },
    "petrol-amc": {
        Starting: { top: 251, left: 614 },
        StartingFrom: { top: 340, left: 532 },
        StartingTo: { top: 355, left: 83 }
    },
    "diesel-amc": {
        Starting: { top: 251, left: 614 },
        StartingFrom: { top: 340, left: 532 },
        StartingTo: { top: 355, left: 83 }
    }
};

// Formats YYYY-MM-DD input date to DD/MM/YYYY
// Updates #formattedDate (Top Date) and #formattedDate_from (AMC Start Date)
function formatDate() {
    const dateInput = document.getElementById("date");
    if (!dateInput) return;
    const value = dateInput.value;
    let formattedDate = "";
    if (value) {
        const parts = value.split("-");
        if (parts.length === 3) {
            formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        }
    }

    const targetTop = document.getElementById("formattedDate");
    if (targetTop) targetTop.innerText = formattedDate;

    const targetFrom = document.getElementById("formattedDate_from");
    if (targetFrom) targetFrom.innerText = formattedDate;
}

// Formats YYYY-MM-DD input date to DD/MM/YYYY
// Updates #formattedDate1 (PUC Next Date) and #formattedDate_to (AMC End Date)
function formatDate1() {
    const dateInput = document.getElementById("date1");
    if (!dateInput) return;
    const value = dateInput.value;
    let formattedDate1 = "";
    if (value) {
        const parts = value.split("-");
        if (parts.length === 3) {
            formattedDate1 = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        }
    }

    const targetNext = document.getElementById("formattedDate1");
    if (targetNext) targetNext.innerText = formattedDate1;

    const targetTo = document.getElementById("formattedDate_to");
    if (targetTo) targetTo.innerText = formattedDate1;
}

// --- Live Position Adjuster Logic ---

// Opens / Closes the Adjuster Panel
function toggleAdjuster() {
    const panel = document.getElementById("adjusterPanel");
    if (!panel) return;
    if (panel.style.display === "none" || panel.style.display === "") {
        panel.style.display = "block";
        loadSavedPositions();
    } else {
        panel.style.display = "none";
    }
}

// Helper to resolve input element across new and legacy IDs
function getInputElement(elementId, property) {
    return document.getElementById(`${elementId}_${property}Input`) ||
           document.getElementById(elementId === "Starting" 
               ? (property === "top" ? "topInput" : "leftInput")
               : (property === "top" ? "topInput1" : "leftInput1"));
}

// Updates position live on screen
function updatePos(elementId, property, value) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const numericVal = parseInt(value, 10);
    if (isNaN(numericVal)) return;

    el.style[property] = numericVal + "px";
    
    // Sync input field value
    const inputEl = getInputElement(elementId, property);
    if (inputEl && inputEl.value !== String(numericVal)) {
        inputEl.value = numericVal;
    }
}

// Nudges position by delta (+1 or -1)
function nudge(elementId, property, delta) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const computed = window.getComputedStyle(el);
    const currentVal = parseInt(el.style[property] || computed[property], 10) || 0;
    const newVal = currentVal + delta;
    updatePos(elementId, property, newVal);
}

// Saves current positions permanently to localStorage
function savePositions() {
    const pageCoords = DEFAULT_COORDS[pageKey] || {};
    
    Object.keys(pageCoords).forEach(elementId => {
        ["top", "left"].forEach(prop => {
            const inputEl = getInputElement(elementId, prop);
            let val = pageCoords[elementId][prop];
            if (inputEl && inputEl.value !== "") {
                val = parseInt(inputEl.value, 10);
            }
            updatePos(elementId, prop, val);
            localStorage.setItem(`puc_${pageKey}_${elementId}_${prop}`, val);
        });
    });

    // Show temporary feedback toast
    const msg = document.getElementById("saveSuccessMsg");
    if (msg) {
        msg.innerText = "✅ Position Saved Successfully!";
        msg.style.display = "block";
        setTimeout(() => {
            msg.style.display = "none";
        }, 2500);
    }
}

// Resets positions to defaults
function resetPositions() {
    const pageCoords = DEFAULT_COORDS[pageKey] || {};
    
    Object.keys(pageCoords).forEach(elementId => {
        ["top", "left"].forEach(prop => {
            localStorage.removeItem(`puc_${pageKey}_${elementId}_${prop}`);
            const defaultVal = pageCoords[elementId][prop];
            updatePos(elementId, prop, defaultVal);
            
            const inputEl = getInputElement(elementId, prop);
            if (inputEl) {
                inputEl.value = defaultVal;
            }
        });
    });

    const msg = document.getElementById("saveSuccessMsg");
    if (msg) {
        msg.innerText = "🔄 Reset to Defaults!";
        msg.style.display = "block";
        setTimeout(() => {
            msg.innerText = "✅ Position Saved Successfully!";
            msg.style.display = "none";
        }, 2000);
    }
}

// Loads saved positions from localStorage or defaults
function loadSavedPositions() {
    const pageCoords = DEFAULT_COORDS[pageKey] || {};
    
    Object.keys(pageCoords).forEach(elementId => {
        ["top", "left"].forEach(property => {
            const saved = localStorage.getItem(`puc_${pageKey}_${elementId}_${property}`);
            const el = document.getElementById(elementId);
            const defaultVal = pageCoords[elementId] ? pageCoords[elementId][property] : 0;
            const finalVal = (saved !== null) ? parseInt(saved, 10) : defaultVal;

            if (el) {
                el.style[property] = finalVal + "px";
            }
            const inputEl = getInputElement(elementId, property);
            if (inputEl) {
                inputEl.value = finalVal;
            }
        });
    });
}

// Automatically fits the 816x1056 certificate to mobile / tablet viewport
function updateViewportScale() {
    const sheet = document.querySelector(".certificate-sheet");
    const viewport = document.querySelector(".certificate-viewport");
    if (!sheet) return;

    const availableWidth = window.innerWidth;
    const padding = availableWidth < 640 ? 24 : 48;
    const maxAvailable = availableWidth - padding;

    if (maxAvailable < 816) {
        const scale = Math.max(0.35, maxAvailable / 816);
        sheet.style.transform = `scale(${scale})`;
        sheet.style.transformOrigin = "top center";
        
        if (viewport) {
            viewport.style.width = `${Math.round(816 * scale)}px`;
            viewport.style.height = `${Math.round(1056 * scale)}px`;
        }
    } else {
        sheet.style.transform = "none";
        if (viewport) {
            viewport.style.width = "816px";
            viewport.style.height = "1056px";
        }
    }
}

// Triggers browser print / Save as PDF dialog
function downloadCertificate() {
    window.print();
}

// Run on initial load
document.addEventListener("DOMContentLoaded", () => {
    formatDate();
    formatDate1();
    loadSavedPositions();
    updateViewportScale();
});

window.addEventListener("resize", updateViewportScale);
window.addEventListener("orientationchange", () => {
    setTimeout(updateViewportScale, 150);
});