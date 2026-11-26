// Loaded in <head> WITHOUT defer so the saved theme is applied before the
// page is drawn (no flash of the wrong theme). The button is wired up once
// the HTML has finished loading.

const THEME_KEY = "theme";

function readSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (error) {
        console.warn("The saved theme could not be read.");
        return null;
    }
}

// Saving can also throw. The theme is still applied either way.
function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.warn("The theme preference could not be saved.");
    }
}

function getCurrentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

// 1. Apply the saved theme right away (default: dark).
applyTheme(readSavedTheme() === "light" ? "light" : "dark");

// 2. Once the page's HTML is ready, set up the toggle button.
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("#theme-toggle");
    if (!toggle) {
        return;
    }

    // The button text says what clicking it will do.
    function updateButton() {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        toggle.textContent = `Switch to ${nextTheme} theme`;
    }

    updateButton();
    toggle.hidden = false;      // only show the control once it actually works

    toggle.addEventListener("click", () => {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";

        function changeTheme() {
            applyTheme(nextTheme);
            updateButton();
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Part 4.2: animate the switch with the View Transition API when the
        // browser supports it and the user hasn't asked for reduced motion.
        // Otherwise just switch instantly; the theme change still works.
        if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(changeTheme);
        } else {
            changeTheme();
        }

        saveTheme(nextTheme);
    });
});