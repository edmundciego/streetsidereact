This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Environment Setup

This project uses environment variables for configuration.
1. Copy `.env.example` to `.env.local` (or `.env.development` / `.env.production`).
2. Fill in the required values in the new file.

```bash
cp .env.example .env.local
```

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build & Deployment

### Install Dependencies

```bash
yarn install
```

### Build for Production

```bash
yarn build
```

This generates:
- `.next/` — Compiled Next.js output
- `public/sw.js` — Service worker (auto-generated, gitignored)
- `public/workbox-*.js` — Workbox runtime (auto-generated, gitignored)
- `public/fallback-*.js` — Offline fallback (auto-generated, gitignored)

### Start Production Server

```bash
yarn start
# Or with PM2:
pm2 restart streetside-react
```

### Deployment Checklist

1. `git pull origin main`
2. `yarn install` (if dependencies changed)
3. `yarn build` (regenerates service worker)
4. Restart the server

> **Important:** Always run `yarn build` after pulling. The service worker files are gitignored and must be regenerated on each deployment.

## PWA Service Worker

The app uses `next-pwa` for offline caching. Configuration is in `next.config.js`.

**Cached resources:**
| Cache | Strategy | TTL | Content |
|-------|----------|-----|---------|
| `config-cache` | StaleWhileRevalidate | 5 min | `/api/v1/config` |
| `static-api-cache` | CacheFirst | 10 min | Categories, modules, landing page |
| `dynamic-api-cache` | StaleWhileRevalidate | 5 min | Items, stores, banners, campaigns |
| `image-cache` | CacheFirst | 24 hours | All images |
| `google-fonts-webfonts` | CacheFirst | 1 year | Google Fonts |

**Key files:**
- `public/manifest.json` — PWA manifest
- `public/Streetside Stores-app-icon.png` — App icon
- `pages/offline.js` — Offline fallback page
- `src/components/OfflineIndicator.js` — Network status banner

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find type definition file for 'minimatch'` | `yarn add -D @types/minimatch` |
| Service worker not updating | Hard refresh (Ctrl+Shift+R) or clear cache |
| Build fails | Delete `.next/` and `node_modules/.cache/`, then rebuild |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
