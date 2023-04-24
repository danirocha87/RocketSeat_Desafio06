import { Router } from './router.js'

const router = new Router()
router.add('/', '/views/home.html')
router.add('/universe', '/views/universe.html')
router.add('/explorer', '/views/explorer.html')
router.add(404, '/views/404.html')

router.handle()

window.onpopstate = () => router.handle()
window.route = () => router.route()

for (let i = 0; i < document.links.length; i++) {
  if (document.links[i].href == document.URL) {
    document.links[i].className = 'linkActive';
  }
}