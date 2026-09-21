# Coffee Order

A single-page React app for ordering a coffee. Each answer reveals the next
question and scrolls it into view: coffee → pick up or delivery → submit →
order complete.

## Requirements

- Node >= 24 (`.node-version` pins 24.18.0 for fnm/nvm users)

## Getting started

```bash
npm install
npm run start
```

The dev server runs on http://localhost:3000 and opens a browser tab.

## Other scripts

| Script | Description |
| --- | --- |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Type-check only |

## Stack

React 19, TypeScript, Vite. No backend — submitting an order just renders the
confirmation in the browser.
