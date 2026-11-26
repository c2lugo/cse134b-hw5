# Carlos Lugo: CSE 134B Portfolio (HW5)

Live site: https://glittering-chimera-6cf2f6.netlify.app/

The `<fact-panel>` component is on the **Experiments** page:
https://glittering-chimera-6cf2f6.netlify.app/experiments.html

| File | Purpose |
|---|---|
| `fact-panel.js` | Component class, API request, and page code for the compact toggle and saved preference |
| `fact-panel.css` | Component styles, which read `--fp-*` custom properties with Catppuccin Mocha fallbacks |
| `portfolio.css` | Sets the `--fp-*` properties from the site theme variables, so the panel follows dark/light |
| `experiments.html` | Hosts the component, the outside "Toggle compact" button, and the `<noscript>` fallback |

**API:** [Useless Facts](https://uselessfacts.jsph.pl/), random fact endpoint
(`/api/v2/facts/random?language=en`).

### Design note

**What the visitor wants:** a quick random fact, with the option to
hide the extra detail line.

**Tracing one action, pressing "New fact":**

1. The click listener on the component's internal button calls `loadFact()`.
2. `loadFact()` disables the button and sets the `role="status"` line to "Loading a fact...".
3. `fetch()` sends a GET request to the Useless Facts API with `cache: "no-store"`, so every
   request goes to the network and doesn't reuse a cached fact.
4. The code checks `response.ok`, parses the JSON, and checks that `text` is a non-empty string.
   `source` is shown only if it is a string.
5. On success, the fact and "Source: …" are written into the panel with `textContent`, so remote
   text is never parsed as HTML. The status reads "Fact N loaded."
6. A `finally` block re-enables the button after either outcome.

**What the visitor sees:**
- **While waiting:** "Loading a fact..." and a disabled button.
- **On success:** the new fact and its source, with "Fact N loaded."
- **On failure** (offline, HTTP error, invalid JSON, or missing fields): the previous content stays,
  and the status says "Couldn't load a fact. Check your connection and press New fact to try again."
  Pressing the button again retries without reloading the page.

**Compact mode:** the "Toggle compact" button outside the component toggles the observed `compact`
attribute. `attributeChangedCallback` hides or shows the source line, and `aria-pressed` reflects the
state. The choice is saved in localStorage under `hw5-fact-panel-mode` and restored on load through the
same code path. Unexpected saved values fall back to expanded. Storage reads and writes are wrapped in
try/catch, so the toggle still works for the current page if storage is unavailable.

**Theming:** `portfolio.css` maps the site's theme variables (`--surface-color`, `--text-main-color`,
etc.) to the component's `--fp-*` properties, so the panel switches between Catppuccin Mocha and
Latte with the rest of the site.

**Without JavaScript:** the rest of the portfolio works normally, the toggle buttons stay hidden,
and a `<noscript>` message says "Enable JavaScript to load live data for this widget."

## HW5: Static site generator exercise

- Folder: [`ssg-exercise/`](ssg-exercise/)
- Pages to preview: **Home** (`/`) and **Projects** (`/projects.html`)
- Install, build and preview commands: [`ssg-exercise/README.md`](ssg-exercise/README.md)