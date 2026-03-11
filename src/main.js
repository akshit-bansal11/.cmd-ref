import { matchesSearch } from './descriptions.js'

let allCommands = []
let categories = {}

// Category icon mapping
const categoryIcons = {
  'init': '🚀', 'clone': '📋', 'add': '➕', 'commit': '💾',
  'status': '📊', 'diff': '🔀', 'log': '📜', 'branch': '🌿',
  'checkout': '🔄', 'switch': '↗️', 'restore': '♻️', 'merge': '🔗',
  'rebase': '📐', 'push': '⬆️', 'pull': '⬇️', 'fetch': '📥',
  'remote': '🌐', 'stash': '📦', 'tag': '🏷️', 'reset': '⏪',
  'revert': '↩️', 'cherry-pick': '🍒', 'clean': '🧹', 'show': '👁️',
  'blame': '🔎', 'bisect': '🔬', 'worktree': '🌳', 'submodule': '📁',
  'config': '⚙️', 'grep': '🔍', 'archive': '🗜️', 'shortlog': '📝',
  'describe': '🏷️', 'reflog': '📋', 'notes': '📌', 'rev-parse': '🔑',
  'ls-files': '📄', 'ls-tree': '🌲', 'ls-remote': '📡',
  'rm': '🗑️', 'mv': '📂', 'format-patch': '📧', 'apply': '🩹',
  'am': '📨', 'bundle': '📦', 'gc': '♻️', 'prune': '✂️',
  'fsck': '🔧', 'maintenance': '🛠️', 'count-objects': '📏',
  'gh auth': '🔐', 'gh repo': '📁', 'gh issue': '🐛',
  'gh pr': '🔀', 'gh gist': '📝', 'gh release': '🚀',
  'gh workflow': '⚡', 'gh run': '▶️', 'gh label': '🏷️',
  'gh api': '🔌', 'gh ssh-key': '🔑', 'gh gpg-key': '🔏',
  'gh alias': '🔗', 'gh config': '⚙️', 'gh extension': '🧩',
  'other': '📎'
}

function getIcon(category) {
  return categoryIcons[category] || '📎'
}

export async function loadCommands() {
  try {
    const response = await fetch('git_gh_commands.json')
    const data = await response.json()
    allCommands = data
    organizeByCategory()
    renderGrid()
    updateStats()
  } catch (error) {
    console.error('Error loading commands:', error)
    document.getElementById('grid').innerHTML = '<p style="color:#a3a3a3;text-align:center;padding:40px;">Error loading commands</p>'
  }
}

function getCategory(cmd) {
  const parts = cmd.split(/\s+/)
  if (parts[0] === 'git') {
    return parts[1] || 'other'
  } else if (parts[0] === 'gh') {
    return parts.slice(0, 2).join(' ')
  }
  return 'other'
}

function organizeByCategory() {
  categories = {}
  allCommands.forEach(item => {
    const cmd = item.command.trim()
    const category = getCategory(cmd)
    if (!categories[category]) categories[category] = []
    categories[category].push({ command: cmd, category })
  })
}

function renderGrid() {
  const grid = document.getElementById('grid')
  grid.innerHTML = ''

  const sortedCategories = Object.keys(categories).sort()

  sortedCategories.forEach((cat, index) => {
    const commands = categories[cat]
    const icon = getIcon(cat)

    const card = document.createElement('div')
    card.className = 'command-card'
    card.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`

    const commandsHtml = commands
      .map(item => `<div class="command-item">
        <span class="command-text">${escapeHtml(item.command)}</span>
      </div>`)
      .join('')

    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">${icon}</div>
        <div class="card-title">${escapeHtml(cat)}</div>
        <div class="card-count">${commands.length}</div>
      </div>
      <div class="card-commands">
        ${commandsHtml}
      </div>
    `
    grid.appendChild(card)
  })
}

function searchCommands(query) {
  const q = query.trim()

  if (!q) {
    organizeByCategory()
    renderGrid()
    updateStats()
    document.getElementById('noResults').classList.add('hidden')
    document.getElementById('grid').classList.remove('hidden')
    return
  }

  categories = {}

  allCommands.forEach(item => {
    const cmd = item.command.trim()
    if (matchesSearch(cmd, q)) {
      const category = getCategory(cmd)
      if (!categories[category]) categories[category] = []
      categories[category].push({ command: cmd, category })
    }
  })

  renderGrid()
  updateStats()

  const hasResults = Object.keys(categories).length > 0
  document.getElementById('noResults').classList.toggle('hidden', hasResults)
  document.getElementById('grid').classList.toggle('hidden', !hasResults)
}

function updateStats() {
  const count = Object.values(categories).reduce((sum, cmds) => sum + cmds.length, 0)
  document.getElementById('visibleCount').textContent = count
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

export function initSearch() {
  const input = document.getElementById('searchInput')
  
  input.addEventListener('input', (e) => {
    searchCommands(e.target.value)
  })

  // Keyboard shortcut: press "/" to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault()
      input.focus()
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.blur()
      input.value = ''
      searchCommands('')
    }
  })
}
