# Git & GitHub Commands Reference

A fast, minimal reference site for git and gh commands built with Next.js App Router.

## Features

- **Tool Index** - Browse available command references
- **Static Tool Pages** - Generated routes for each tool
- **Tailwind CSS v4** - Utility-first styling with custom theme tokens
- **Next.js App Router** - Server components and file-based routing

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:3000`

## Build

```bash
npm run build
```

Creates an optimized `.next/` build.

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Self-hosted
```bash
npm run build
npm run start
```

## File Structure

```
├── src/
│   ├── app/            # App Router pages/layouts
│   ├── components/     # Reusable UI components
│   ├── data/           # Tool JSON data files
│   └── lib/            # Data loading utilities
├── public/
│   └── icons/          # Tool icons
├── package.json
└── next.config.ts
```
