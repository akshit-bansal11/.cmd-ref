const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/git_gh_commands.json', 'utf8'));

const gitCats = data.filter(d => !d.category.toLowerCase().startsWith('gh'));
const ghCats = data.filter(d => d.category.toLowerCase().startsWith('gh'));

fs.mkdirSync('src/data', {recursive: true});

const gitSchema = {
  name: 'Git',
  slug: 'git',
  logo: '/icons/git.svg',
  accent: '#F05032',
  description: 'Distributed version control system',
  categories: gitCats.map(c => ({
    title: c.category,
    commands: c.commands.map(cmd => ({
      command: cmd.usage || cmd.command, // handle both old and new schema if needed
      description: cmd.description
    }))
  }))
};

const CATEGORY_MAP = {
  'gh repo': 'GitHub Repository',
  'gh pr': 'GitHub Pull Request',
  'gh issue': 'GitHub Issue',
  'gh workflow & run': 'GitHub Workflow & Run',
  'gh auth & config': 'GitHub Auth & Config',
  'gh gist & release': 'GitHub Gist & Release',
  'gh secret & variable': 'GitHub Secret & Variable',
  'gh label & milestone': 'GitHub Label & Milestone',
  'gh search': 'GitHub Search',
  'gh api & alias': 'GitHub API & Alias',
  'gh codespace': 'GitHub Codespace',
  'gh cache & org': 'GitHub Cache & Organization',
  'gh browse & status': 'GitHub Browse & Status',
  'gh attestation': 'GitHub Attestation',
  'gh ruleset & environment': 'GitHub Ruleset & Environment',
  'gh extension': 'GitHub Extension'
};

const ghSchema = {
  name: 'GitHub CLI',
  slug: 'github',
  logo: '/icons/github.svg',
  accent: '#ffffff',
  description: 'GitHub on the command line',
  categories: ghCats.map(c => ({
    title: CATEGORY_MAP[c.category] || c.category,
    commands: c.commands.map(cmd => ({
      command: cmd.usage || cmd.command,
      description: cmd.description
    }))
  }))
};

fs.writeFileSync('src/data/git.json', JSON.stringify(gitSchema, null, 2));
fs.writeFileSync('src/data/github.json', JSON.stringify(ghSchema, null, 2));
