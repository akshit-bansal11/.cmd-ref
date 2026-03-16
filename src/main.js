const THEME_KEY = 'git-ref-theme'

let allCategories = []
let gridEl, searchEl, themeToggleEl, emptyEl

export async function init() {
  gridEl = document.getElementById('grid')
  searchEl = document.getElementById('search')
  themeToggleEl = document.getElementById('theme-toggle')
  emptyEl = document.getElementById('empty')

  applyInitialTheme()

  const res = await fetch('/git_gh_commands.json')
  allCategories = await res.json()

  render(allCategories)

  searchEl.addEventListener('input', handleSearch)
  themeToggleEl.addEventListener('click', toggleTheme)
  gridEl.addEventListener('click', handleCopy)
}

// ── Theme ─────────────────────────────────────────────────

function applyInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  }
  updateToggleIcon()
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
  const isDark = document.documentElement.classList.contains('dark')
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  updateToggleIcon()
}

function updateToggleIcon() {
  const isDark = document.documentElement.classList.contains('dark')
  themeToggleEl.textContent = isDark ? '\u2600' : '\u263D'
}

// ── Search ────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
  'when', 'where', 'how', 'why', 'who', 'will', 'would', 'should',
  'could', 'can', 'may', 'might', 'must', 'do', 'does', 'did',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'all', 'any', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just',
  'don', 'now', 'of', 'it', 'my', 'i', 'you'
])

const SYNONYMS = {
  'pr': ['pr', 'pull request'],
  'pull request': ['pr', 'pull request'],
  'repo': ['repo', 'repository'],
  'repository': ['repo', 'repository'],
  'dir': ['dir', 'directory', 'folder'],
  'directory': ['dir', 'directory', 'folder'],
  'folder': ['dir', 'directory', 'folder'],
  'msg': ['msg', 'message'],
  'message': ['msg', 'message'],
  'remove': ['remove', 'rm', 'delete'],
  'rm': ['remove', 'rm', 'delete'],
  'delete': ['remove', 'rm', 'delete'],
  'init': ['init', 'initialize', 'create'],
  'initialize': ['init', 'initialize', 'create']
}

function handleSearch() {
  const query = searchEl.value.toLowerCase().trim()

  if (!query) {
    render(allCategories)
    return
  }

  // Split query into words and filter out stop words
  const queryTokens = query
    .split(/\s+/)
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token))

  // If query consists only of stop words, fallback to just splitting
  const tokensToUse = queryTokens.length > 0 ? queryTokens : query.split(/\s+/).filter(t => t.length > 0)

  const filtered = allCategories
    .map((cat) => ({
      ...cat,
      commands: cat.commands.filter((cmd) => {
        const textToSearch = `${cmd.name} ${cmd.description} ${cmd.usage}`.toLowerCase()
        // Check if ALL provided tokens (or their synonyms) are present in the command info
        return tokensToUse.every((token) => {
          const synonyms = SYNONYMS[token] || [token]
          return synonyms.some((syn) => textToSearch.includes(syn))
        })
      }),
    }))
    .filter((cat) => cat.commands.length > 0)

  render(filtered)
}

// ── Render ────────────────────────────────────────────────

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>`
const TICK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>`

function handleCopy(e) {
  const btn = e.target.closest('.copy-btn')
  if (!btn) return
  const cmd = btn.getAttribute('data-cmd')
  if (!cmd) return

  navigator.clipboard.writeText(cmd)
  btn.innerHTML = TICK_ICON
  
  if (btn.timeoutId) clearTimeout(btn.timeoutId)
  btn.timeoutId = setTimeout(() => {
    btn.innerHTML = COPY_ICON
  }, 1500)
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const PALETTES = [
  {
    borderOuter: 'border-blue-500/20 dark:border-blue-400/20',
    title: 'text-blue-700 dark:text-blue-400 border-b-blue-500/10 dark:border-b-blue-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-blue-200 dark:border-blue-800/50',
    codeText: 'text-blue-900 dark:text-blue-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  },
  {
    borderOuter: 'border-emerald-500/20 dark:border-emerald-400/20',
    title: 'text-emerald-700 dark:text-emerald-400 border-b-emerald-500/10 dark:border-b-emerald-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-emerald-200 dark:border-emerald-800/50',
    codeText: 'text-emerald-900 dark:text-emerald-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  },
  {
    borderOuter: 'border-amber-500/20 dark:border-amber-400/20',
    title: 'text-amber-700 dark:text-amber-400 border-b-amber-500/10 dark:border-b-amber-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-amber-200 dark:border-amber-800/50',
    codeText: 'text-amber-900 dark:text-amber-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  },
  {
    borderOuter: 'border-violet-500/20 dark:border-violet-400/20',
    title: 'text-violet-700 dark:text-violet-400 border-b-violet-500/10 dark:border-b-violet-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-violet-200 dark:border-violet-800/50',
    codeText: 'text-violet-900 dark:text-violet-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  },
  {
    borderOuter: 'border-rose-500/20 dark:border-rose-400/20',
    title: 'text-rose-700 dark:text-rose-400 border-b-rose-500/10 dark:border-b-rose-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-rose-200 dark:border-rose-800/50',
    codeText: 'text-rose-900 dark:text-rose-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  },
  {
    borderOuter: 'border-cyan-500/20 dark:border-cyan-400/20',
    title: 'text-cyan-700 dark:text-cyan-400 border-b-cyan-500/10 dark:border-b-cyan-400/10',
    codeBg: 'bg-white/50 dark:bg-zinc-800/50 border-cyan-200 dark:border-cyan-800/50',
    codeText: 'text-cyan-900 dark:text-cyan-100',
    btnText: 'text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-zinc-900/10 dark:hover:bg-zinc-50/10'
  }
]

function render(categories) {
  if (categories.length === 0) {
    gridEl.innerHTML = ''
    emptyEl.classList.remove('hidden')
    return
  }

  emptyEl.classList.add('hidden')

  gridEl.innerHTML = categories
    .map(
      (cat, idx) => {
        const p = PALETTES[idx % PALETTES.length]
        return `
    <div class="mb-6 break-inside-avoid rounded-xl border ${p.borderOuter} bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-md p-5 shadow-sm">
      <h2 class="text-xs font-bold uppercase tracking-widest ${p.title} mb-4 border-b pb-2">
        ${esc(cat.category)}
      </h2>
      <div class="space-y-4 cursor-default">
        ${cat.commands
          .map(
            (cmd) => `
          <div class="group">
            <p class="text-[0.9rem] text-zinc-900/90 dark:text-zinc-200/90 leading-snug mb-2">${esc(cmd.description)}</p>
            <div class="relative border ${p.codeBg} rounded-md overflow-hidden">
              <pre class="text-xs font-mono ${p.codeText} font-semibold px-3 py-2.5 pr-10 overflow-x-auto whitespace-pre-wrap">${esc(cmd.usage)}</pre>
              <button type="button" class="copy-btn absolute top-1.5 right-1.5 p-1.5 rounded-md ${p.btnText} opacity-0 group-hover:opacity-100 transition-all duration-100 ease-out focus:outline-none focus:opacity-100" aria-label="Copy command" data-cmd="${esc(cmd.usage).replace(/"/g, '&quot;')}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
      }
    )
    .join('')
}
