import { GithubUser } from "./GithubUser.js"


export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@git-fav:')) || []
  }

  save() {
    localStorage.setItem('@git-fav:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já favoritado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}


export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    this.img = this.root.querySelector('table tbody tr td img')
    this.nofav = this.root.querySelector('#no-favorites')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remove este usuário dos favoritos?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

    const size = Object.keys(this.entries).length

    size <= 0 ? this.nofav.id = 'no-favorites' : this.nofav.id = 'no-favorites-hidden'
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/danirocha87" alt="Imagem do github da Daniela Rocha">
        <a href="https://github.com/danirocha87" target="_blank">
          <p>Daniela Rocha</p>
          <span>Daniela Rocha</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9589
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  hideNoFav() {
    this.root.querySelector('#no-favorites').id = 'no-favorites-hidden'
  }


  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }
}