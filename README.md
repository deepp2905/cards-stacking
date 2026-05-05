# cards-stacking

A small React + Vite playground exploring different animation styles for a deck of cards rising from below and fanning out. Each version (V1, V2, V3) is a separate take on the same idea, switchable from the UI with a replay button.

## Versions

- **V1**: Center card sits on top, stack is mirrored outward.
- **V2**: Center cards fan first, edges trail like a hand spreading a deck.
- **V3**: Cards stack from outside in by z-index, then spread out together.

## Requirements

- Node.js 18 or newer
- npm (bundled with Node)

## Setup

Clone the repo and install dependencies:

```
git clone <repo-url>
cd cards-stacking
npm install
```

## Run locally

Start the dev server:

```
npm run dev
```

Vite will print a local URL (usually http://localhost:5173). Open it in your browser.

## Other scripts

- `npm run build` produces a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint over the project


## Project structure

- `src/App.jsx` tab switcher and replay control
- `src/Card.jsx` shared card component with the entry, spread, and hover transitions
- `src/StackV1.jsx`, `StackV2.jsx`, `StackV3.jsx` the three animation variants
- `src/App.css` styling for the table, stack, and controls
