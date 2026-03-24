const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join("src", "data");
const LEGACY_SOURCE = path.join("public", "git_gh_commands.json");

const CATEGORY_MAP = {
  "gh repo": "GitHub Repository",
  "gh pr": "GitHub Pull Request",
  "gh issue": "GitHub Issue",
  "gh workflow & run": "GitHub Workflow & Run",
  "gh auth & config": "GitHub Auth & Config",
  "gh gist & release": "GitHub Gist & Release",
  "gh secret & variable": "GitHub Secret & Variable",
  "gh label & milestone": "GitHub Label & Milestone",
  "gh search": "GitHub Search",
  "gh api & alias": "GitHub API & Alias",
  "gh codespace": "GitHub Codespace",
  "gh cache & org": "GitHub Cache & Organization",
  "gh browse & status": "GitHub Browse & Status",
  "gh attestation": "GitHub Attestation",
  "gh ruleset & environment": "GitHub Ruleset & Environment",
  "gh extension": "GitHub Extension",
};

const SVGL_LOGO_MAP = {
  bash: "bash_dark.svg",
  github: "github_dark.svg",
};

const SVGL_BASE_URL = "https://svgl.app/library";
const SVGL_FALLBACK_LOGO = `${SVGL_BASE_URL}/git.svg`;

function getSvglCandidates(toolSlug) {
  const mapped = SVGL_LOGO_MAP[toolSlug];
  const candidates = [
    mapped,
    `${toolSlug}.svg`,
    `${toolSlug}_dark.svg`,
    `${toolSlug}_light.svg`,
  ].filter(Boolean);

  return [...new Set(candidates)];
}

async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) {
      return true;
    }

    if (response.status === 405) {
      const fallbackGet = await fetch(url, { method: "GET" });
      return fallbackGet.ok;
    }

    return false;
  } catch {
    return false;
  }
}

async function resolveSvglLogo(toolSlug) {
  const candidates = getSvglCandidates(toolSlug);

  for (const fileName of candidates) {
    const url = `${SVGL_BASE_URL}/${fileName}`;
    const exists = await urlExists(url);
    if (exists) {
      return url;
    }
  }

  return SVGL_FALLBACK_LOGO;
}

function toSlug(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitle(input) {
  return String(input)
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeCommands(commands) {
  return (commands || []).map((cmd) => ({
    command: cmd.usage || cmd.command,
    description: cmd.description,
  }));
}

function buildToolSchema({ name, slug, logo, accent, description, categories }) {
  return {
    name,
    slug,
    logo,
    accent,
    description,
    categories,
  };
}

function writeToolFile(schema, overwrite = true) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const outPath = path.join(DATA_DIR, `${schema.slug}.json`);

  if (!overwrite && fs.existsSync(outPath)) {
    console.log(`Skipped existing file: ${outPath}`);
    return;
  }

  fs.writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");
  console.log(`Generated: ${outPath}`);
}

async function generateToolScaffold(toolNameOrSlug) {
  const slug = toSlug(toolNameOrSlug);

  if (!slug) {
    throw new Error("Tool name/slug cannot be empty.");
  }

  const logo = await resolveSvglLogo(slug);

  const schema = buildToolSchema({
    name: toTitle(toolNameOrSlug),
    slug,
    logo,
    accent: "#2563EB",
    description: `${toTitle(toolNameOrSlug)} commands reference`,
    categories: [
      {
        title: "Core Commands",
        commands: [],
      },
    ],
  });

  writeToolFile(schema, false);
}

async function generateFromLegacySource(sourceFile) {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(
      `Legacy source not found: ${sourceFile}. Provide tool names as arguments to generate scaffold files.`,
    );
  }

  const data = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const gitCats = data.filter((d) => !d.category.toLowerCase().startsWith("gh"));
  const ghCats = data.filter((d) => d.category.toLowerCase().startsWith("gh"));

  const gitLogo = await resolveSvglLogo("git");
  const githubLogo = await resolveSvglLogo("github");

  const gitSchema = buildToolSchema({
    name: "Git",
    slug: "git",
    logo: gitLogo,
    accent: "#F05032",
    description: "Distributed version control system",
    categories: gitCats.map((c) => ({
      title: c.category,
      commands: normalizeCommands(c.commands),
    })),
  });

  const ghSchema = buildToolSchema({
    name: "GitHub CLI",
    slug: "github",
    logo: githubLogo,
    accent: "#ffffff",
    description: "GitHub on the command line",
    categories: ghCats.map((c) => ({
      title: CATEGORY_MAP[c.category] || c.category,
      commands: normalizeCommands(c.commands),
    })),
  });

  writeToolFile(gitSchema, true);
  writeToolFile(ghSchema, true);
}

async function main() {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.length > 0) {
    for (const tool of args) {
      await generateToolScaffold(tool);
    }
    return;
  }

  await generateFromLegacySource(LEGACY_SOURCE);
}

main().catch((error) => {
  console.error(error.message || error);
  console.error("Usage:");
  console.error("  node generate.cjs <tool-name-or-slug> [more-tools...]");
  console.error("  node generate.cjs   # uses public/git_gh_commands.json (legacy mode)");
  process.exit(1);
});
