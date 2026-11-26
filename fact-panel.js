const API_URL = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

class FactPanel extends HTMLElement {
    static observedAttributes = ["compact"];

    connectedCallback() {
        // Don't build twice if the element is moved in the DOM
        if (this.rendered) return;
        this.rendered = true;

        this.count = 0;

        // Build the interface
        const heading = document.createElement("h3");
        heading.textContent = "$ fortune";

        this.factEl = document.createElement("p");
        this.factEl.className = "fact";

        this.detailEl = document.createElement("p");
        this.detailEl.className = "detail";

        this.nextBtn = document.createElement("button");
        this.nextBtn.type = "button";
        this.nextBtn.textContent = "New fact";

        this.statusEl = document.createElement("p");
        this.statusEl.setAttribute("role", "status");

        this.appendChild(heading);
        this.appendChild(this.factEl);
        this.appendChild(this.detailEl);
        this.appendChild(this.nextBtn);
        this.appendChild(this.statusEl);

        // Internal control: request a new fact
        this.nextBtn.addEventListener("click", () => this.loadFact());

        this.applyCompact();
        this.loadFact(); // load the first fact right away
    }

    attributeChangedCallback(name) {
        if (name === "compact") this.applyCompact();
    }

    applyCompact() {
        // The attribute can change before the interface is built
        if (!this.detailEl) return;
        this.detailEl.hidden = this.hasAttribute("compact");
    }

    async loadFact() {
        // Loading state
        this.nextBtn.disabled = true;
        this.statusEl.textContent = "Loading a fact...";

        try {
            const response = await fetch(API_URL, { cache: "no-store" });

            // A 404 or 500 still returns a response, so check the status
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();

            // Validate the fields we use before touching the DOM
            if (typeof data?.text !== "string" || data.text.trim() === "") {
                throw new Error("Response did not include fact text.");
            }
            const source = typeof data.source === "string" ? data.source : "";

            // Success: render with textContent so remote text is never parsed as HTML
            this.count += 1;
            this.factEl.textContent = data.text;
            this.detailEl.textContent = source ? `Source: ${source}` : "";
            this.statusEl.textContent = `Fact ${this.count} loaded.`;
        } catch (error) {
            // Network failure, bad status, invalid JSON, or missing fields
            console.error("Could not load a fact.", error);
            this.statusEl.textContent = "Couldn't load a fact. Check your connection and press New fact to try again.";
        } finally {
            // Re-enable the control after either outcome so retry works
            this.nextBtn.disabled = false;
        }
    }
}

customElements.define("fact-panel", FactPanel);

// Page code: the outside button toggles the compact attribute
const STORAGE_KEY = "hw5-fact-panel-mode";
const panel = document.querySelector("fact-panel");
const toggle = document.querySelector("#toggle-compact");

if (panel && toggle) {
    toggle.hidden = false; // only show the button when JS works

    const syncButton = () => {
        toggle.setAttribute("aria-pressed", String(panel.hasAttribute("compact")));
    };

    // One path for both the button and the restored preference
    const setMode = (mode) => {
        panel.toggleAttribute("compact", mode === "compact");
        syncButton();
    };

    // Restore: read the saved value, fall back to the default if it's missing or invalid
    let savedMode = "expanded";
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "compact" || stored === "expanded") {
            savedMode = stored;
        }
    } catch (error) {
        console.warn("Could not read the saved panel mode.", error);
    }
    setMode(savedMode);

    // Toggle: apply first, then try to save
    toggle.addEventListener("click", () => {
        const newMode = panel.hasAttribute("compact") ? "expanded" : "compact";
        setMode(newMode);

        try {
            localStorage.setItem(STORAGE_KEY, newMode);
        } catch (error) {
            console.warn("Could not save the panel mode.", error);
        }
    });
}