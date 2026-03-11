# Git & GitHub Commands Reference

A fast, minimal masonry grid reference site for git and gh commands with theme toggle and real-time search.

## Features

- **Masonry Grid** - Responsive 3-column layout
- **Auto-categorized** - Commands grouped by type (git init, git clone, gh pr, etc.)
- **Real-time Search** - Filter commands instantly
- **Light/Dark Mode** - Theme toggle with localStorage persistence
- **Minimal Design** - Neutral palette (white, gray, black)
- **Fast** - Built with Vite for optimal performance

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Build

```bash
npm run build
```

Creates optimized `dist/` folder ready for deployment.

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Any Static Host
- Run `npm run build`
- Deploy the `dist/` folder to your hosting

## File Structure

```
├── src/
│   ├── index.html      # Main HTML
│   ├── index.js        # Entry point
│   ├── main.js         # App logic
│   └── style.css       # Tailwind styles
├── public/
│   └── git_gh_commands.json  # Command data
├── package.json
└── vite.config.js
```
