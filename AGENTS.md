# Repository Guidelines

## Project Structure & Module Organization
The Next.js runtime follows `pages/` for route entries (e.g. `pages/WishLists.js`) and `middleware.js` for edge guards. All reusable UI sits in `src/components/`, grouped by feature (such as `my-orders/`, `store-details/`). Data fetching lives under `src/api-manage/` (React Query hooks) and global state in `src/redux/`. Shared helpers (`src/utils/`, `src/helper-functions/`) and design tokens (`src/styles/`, `src/styled-components/`, `src/theme/`) keep cross-feature code centralized. Static assets and translations are stored in `public/` and `src/language/`; favor importing from those locations instead of duplicating files.

## Build, Test, and Development Commands
Run `yarn dev` for the hot-reloading development server at `http://localhost:3000`. Use `yarn build` to produce the optimized production bundle used by CI/CD, and `yarn start` to serve that bundle locally. Execute `yarn lint` before opening a pull request to apply the Next.js ESLint rules; pair it with `npx prettier --write .` when formatting large edits.

## Coding Style & Naming Conventions
JavaScript and JSX files use 2-space indentation, semicolons omitted, and double quotes for strings—align with existing modules. Components should stay in PascalCase filenames (`CustomImageContainer.js`), hooks in `camelCase`, and constants in `SCREAMING_SNAKE_CASE`. Respect folder hyphenation for feature scopes (e.g., `my-orders`). Rely on Emotion/MUI’s `sx` prop for styling; add shared tokens to `src/theme`. Always run Prettier 2.8 and the repo’s ESLint config before committing.

## Testing Guidelines
The project currently ships without an automated test suite. When adding coverage, colocate React Testing Library + Jest specs beside components as `ComponentName.test.jsx`, and mock API hooks exported from `src/api-manage`. Treat Stripe-style payment flows and order tracking (pages like `pages/order-details/[id].js`) as critical paths; validate them manually in staging until automated coverage is added.

## Commit & Pull Request Guidelines
History favors concise, imperative commit subjects (`Add conditional rendering for payment status`). Keep bodies focused on context, not implementation minutiae. For pull requests, include: 1) a summary of the user-facing change, 2) links to Jira or issue IDs where applicable, 3) screenshots or GIFs for UI updates (desktop + mobile), and 4) a verification checklist (lint, build, critical flows). Request review from domain owners in feature directories you touch.

## Security & Configuration Tips
Place API keys, Firebase tokens, and module-specific endpoints in `.env.local`; never commit secrets. Update `src/firebase.js` or `src/api-manage/config.js` through configuration helpers, not hard-coded literals. Run `deploy.sh` only after `yarn build` succeeds; it assumes production-ready assets.
