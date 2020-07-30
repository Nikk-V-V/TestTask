const url = './Data/Data.json'

let accounts

window.onload = get('GET', url)
    .then(data => createList(data['accounts']))
    .catch(err => console.log(err))

document.querySelectorAll('button')
    .forEach(b => {
        b.addEventListener('click', transPage)
    })

document.querySelector('input')
    .addEventListener('keyup', validInput)

document.querySelector('.cancel')
    .addEventListener('click', () => {
        document.querySelector('input').value = ''
        document.querySelector('.add').disabled = true
    })

document.querySelectorAll('.page')
    .forEach(p => p.addEventListener('keydown', focusEl))

document.querySelector('.add')
    .addEventListener('click', addItem)

document.querySelector('.view_btn')
    .addEventListener('click', () => {
        document.querySelector('#text').focus()
    })

document.querySelector('.view_btn')
    .addEventListener('keydown', () => {
        document.querySelector('#text').focus()
    })

document.querySelectorAll('.item')
    .forEach(item => item.addEventListener('focusout', (e) => {
        console.log(e)
    }))

function send(method, url, body = null) {
    const headers = {'Content-Type': 'application/json'}
    return  fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: headers
    }).then(response => {return response.json()})
}

function get(method, url) {
    return  fetch(url).then(response => {return response.json()})
}

function createList(data) {
    const list = document.querySelector('#app .list')
    accounts = data
    list.innerHTML = ''
    data.forEach((d, i) => {
        list.innerHTML += `
            <div class="item focus_element ${i === 0 ? 'focus_v' : ''}" ${i === 0 ? "autofocus": ''} tabindex="0">
                <div class="img">
                    <img src="${d.image}" alt="img">
                </div>
                <div class="text">${d.title}</div>
            </div>
        `
    })
}

function transPage() {
    document.querySelectorAll('.page')
        .forEach(p => {
            if (p.classList.length === 3) {
                p.classList.remove('active_page')
            }
            else p.classList.add('active_page')
        })
    setFocusList()
}

function validInput(e) {
    let add = document.querySelector('.add')
    add.disabled = !e.target.value.trim();
}

function addItem() {
    let text = document.querySelector('#text').value

    const body = {
        title: text,
        image: 'img/person2.png'
    }

    document.querySelector('#text').value = ''

    accounts.push(body)

    send("PATCH", 'http://localhost:8000/refactor', accounts)
        .then(r => {
            get('GET', url).then(data => {
                createList(data['accounts'])
            })
        })
        .catch(e => console.log(e))

    document.querySelector('.add').disabled = true
}

function removeItems() {
    send("PATCH", 'http://localhost:8000/refactor', accounts)
        .then(r => {
            get('GET', url).then(data => {
                createList(data['accounts'])
            })
        })
        .catch(e => console.log(e))
}

function focusEl(e) {
    let list = e.path[2].querySelectorAll('.focus_element'),
        elTarget = e.target

    if (elTarget.classList[0] === 'item') {
        if (e.key === 'ArrowUp') setFocusList(list, elTarget, -1)
        else if (e.key === 'ArrowDown') setFocusList(list, elTarget, 1 )
        else if (e.key === 'ArrowRight') list[list.length - 1].focus()
        else if (e.key === 'ArrowLeft') {
            accounts = accounts.filter(i => i.title !== elTarget.innerText)
            removeItems()
        }
    } else if(elTarget.classList[0] === 'view_btn') {
        if (e.key === 'ArrowRight') document.querySelector('.focus_v').focus()
        if (e.key === 'ArrowLeft') document.querySelector('.focus_v').focus()
    } else if (elTarget.classList[0] === 'create_input') {
        if (e.key === 'ArrowDown') {
            let focus_c = document.querySelector('.focus_c')
            console.log(focus_c)
            if (focus_c) focus_c.focus()
            else if (!list[1].disabled) {
                list[1].focus()
                list[1].classList.add('focus_c')
            }
            else {
                list[2].focus()
                list[2].classList.add('focus_c')
            }
        }
    } else if (elTarget.classList[0] === 'create_btn') {
        if (e.key === 'ArrowUp') list[0].focus()
        else if (e.key === 'ArrowRight') {
            if (elTarget === list[1]) {
                list[1].classList.remove('focus_c')
                list[2].classList.add('focus_c')
                list[2].focus()
            }
        }
        else if (e.key === 'ArrowLeft') {
            if (!list[1].disabled) {
                if (elTarget === list[2]) {
                    list[2].classList.remove('focus_c')
                    list[1].classList.add('focus_c')
                    list[1].focus()
                }
            }
        }
    }
}

function setFocusList(list = [], elTarget = null, index = 0) {
    const lastItem = list.length - 1
    if(index) {
        list.forEach((e, i) => {
            const nextItem = i + index
            if (e === elTarget) {
                if (nextItem !== lastItem) {
                    if (list[nextItem]) {
                        list[nextItem].focus()
                        list[nextItem].classList.add('focus_v')
                        list[i].classList.remove('focus_v')
                    }
                }
            }
        })
    } else {
        document.querySelector('.focus_v').focus()
    }
}



