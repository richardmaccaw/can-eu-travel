# Schengen Calculator (React)

This is a minimal React + TypeScript implementation of the original Schengen day calculator. Upload your Google Maps timeline export and the app will compute the number of days used and remaining within the 90/180 rule.

## Development

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

During the build step all GeoJSON files located in `scripts/geo/` are automatically
merged into `public/schengen.geo.json` so updated boundaries are reflected on
deployment.
