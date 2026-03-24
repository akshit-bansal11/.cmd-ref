# .cmd_ref

Every command. One place.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A fast, minimal command reference for the tools developers use every day. Built with Next.js App Router — data-driven architecture where each tool's commands live in a JSON file, and dropping a new file auto-generates a new route.

**Live:** [cmd-ref.vercel.app](https://cmd-ref.vercel.app)

---

## Tools Covered

| Tool | Description | Categories |
|------|-------------|------------|
| **Bash** | Unix shell and command language | Navigation & File System, File & Directory Operations, File Viewing & Editing, Search & Find, Permissions & Ownership, Process Management, System Information, Network, Text Processing, Redirection & Pipelines, Archiving & Compression, User Management, Shell Scripting, Package Management, Disk & Storage, Scheduling & Automation, Miscellaneous |
| **CMD** | Windows Command Prompt shell interpreter | Navigation & File System, File & Directory Operations, File Viewing & Content, System Information, Process Management, Network, User & Account Management, Services Management, Disk & Storage, Batch Scripting, Redirection & Pipelines, System Administration, Miscellaneous |
| **Git** | Distributed version control system | Setup & Config, Staging & Snapshots, Branching & Merging, Remote, Inspection & History, Undoing Changes, Tags, Submodules, Worktree, Bisect, Sparse Checkout, Notes |
| **GitHub CLI** | GitHub on the command line | Repository, Pull Request, Issue, Workflow & Run, Auth & Config, Gist & Release, Secret & Variable, Label & Milestone, Search, API & Alias, Codespace, Cache & Organization, Browse & Status, Attestation, Ruleset & Environment, Extension |
| **NPM** | Node Package Manager | Init & Config, Install & Add Packages, Uninstall & Remove Packages, Update Packages, Scripts & Execution, Workspaces, Publish & Registry, Authentication, Info & Search, Listing & Dependency Tree, Audit & Security, Versioning, Cache, Linking, Outdated & Doctor, Package.json Management, CI & Environment, Organization & Teams, Miscellaneous |
| **PNPM** | Fast, disk space efficient package manager | Init & Config, Install & Add Packages, Remove Packages, Update Packages, Scripts & Execution, Workspaces, Publish & Registry, Authentication, Info & Search, Listing & Dependency Tree, Audit & Security, Versioning, Store Management, Outdated, Linking, Patching, Miscellaneous |
| **PowerShell** | Cross-platform task automation shell | Navigation & File System, File & Directory Operations, File Viewing & Content, Search & Filter, Text Processing & Output Formatting, Process Management, System Information, Network, Registry, Module & Package Management, Permissions & Security, Services & Events, Scripting & Automation, Help & Discovery |
| **Prettier** | Opinionated code formatter | Formatting Files, Checking Files, Printing & Stdout, Formatting Options, Parser & Language, Configuration, Info & Debugging, CI & Integration |
| **Vitest** | Vite-native unit testing framework | Running Tests, Watch Mode, Coverage, Configuration, Filtering & Targeting, UI Mode, Browser Mode, Benchmark, Type Checking, Miscellaneous |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start
```

---

## Project Structure

```
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── [tool]/
    │   │   └── page.tsx
    │   └── api/
    │       └── search/
    │           └── route.ts
    ├── components/
    │   └── ToolReference.tsx
    ├── data/
    │   ├── npm.json
    │   ├── pnpm.json
    │   ├── prettier.json
    │   ├── bash.json
    │   ├── git.json
    │   ├── github.json
    │   ├── powershell.json
    │   ├── cmd.json
    │   └── vitest.json
    └── lib/
        ├── data.ts
        └── utils.ts
```

### Adding a New Tool

The architecture is data-driven. Each tool is a JSON file in `src/data/`. A new file automatically generates a new route — no manual routing needed.

1. Run the generator script to scaffold the JSON structure:
   ```bash
   node generate.cjs <tool-name>
   ```
   The generator will automatically get the accent color and icon from svgl(https://svgl.app/).
2. Fill in the commands and categories in the generated file.
3. Add the tool's icon to `public/icons/` in case the icon isn't available on svgl.

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

---

## Contributing

Contributions are welcome — PRs and issues both.

**To add a new tool or expand an existing one:**

1. Follow the "Adding a New Tool" steps above
2. Keep command descriptions concise and accurate
3. Open a PR with the tool name in the title

**To report a bug or request a tool:**

Open an issue with a clear title. For bugs, include steps to reproduce and your browser/OS. For tool requests, mention which commands or categories you'd want covered.

---

## Links

- **Live:** [cmd-ref.vercel.app](https://cmd-ref.vercel.app)
- **GitHub:** [github.com/akshit-bansal11](https://github.com/akshit-bansal11)
- **LinkedIn:** [linkedin.com/in/akshit-bansal11](https://linkedin.com/in/akshit-bansal11)
