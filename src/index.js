import './style.css'
import { initSearch, loadCommands } from './main.js'

window.addEventListener('DOMContentLoaded', () => {
  loadCommands()
  initSearch()
})
