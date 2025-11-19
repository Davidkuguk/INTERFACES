let equiposData = []

fetch('/src/assets/data/equipos.json')
  .then(r => r.json())
  .then(data => {
    equiposData = data.equipos
    mostrarEquipos(equiposData)
  })

function mostrarEquipos(equipos) {
  const contenedor = document.getElementById('contenedorEquipos')

  equipos.forEach((equipo, indice) => {
    const col = document.createElement('div')
    col.className = 'col-12 col-md-4 col-lg-3 mt-3'

    const card = document.createElement('div')
    card.className = 'card text-start h-100'
    card.style.cursor = 'pointer'

    const cardIMG = document.createElement('img')
    cardIMG.src = equipo.imagen
    cardIMG.className = 'card-img-top d-block mx-auto mt-3 mb-0'
    cardIMG.alt = equipo.nombre

    const cardBody = document.createElement('div')
    cardBody.className = 'card-body p-1 text-center'

    const cardTitle = document.createElement('h4')
    cardTitle.className = 'card-title fw-bold f-oswald text-dark'

    const enlace = document.createElement('a')
    enlace.href = '#'
    enlace.textContent = equipo.nombre
    enlace.className = 'text-decoration-none colorMorado'

    const cardCompeticion = document.createElement('p')
    cardCompeticion.className = 'fw-bold f-oswald'
    cardCompeticion.textContent = equipo.competicion

    enlace.addEventListener('click', e => {
      e.preventDefault()
      abrirModalEquipo(indice)
    })

    card.addEventListener('click', () => {
      abrirModalEquipo(indice)
    })

    cardTitle.appendChild(enlace)
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardCompeticion)
    card.appendChild(cardIMG)
    card.appendChild(cardBody)
    col.appendChild(card)
    contenedor.appendChild(col)
  })
}

function abrirModalEquipo(indice) {
  const equipo = equiposData[indice]

  const modalNombre = document.getElementById('modalEquipoNombre')
  const modalImagen = document.getElementById('modalEquipoImagen')
  const modalCompeticion = document.getElementById('modalEquipoCompeticion')
  const modalCapitan = document.getElementById('modalEquipoCapitan')
  const listaJugadores = document.getElementById('modalEquipoJugadores')

  modalNombre.textContent = equipo.nombre
  modalImagen.src = equipo.imagen
  modalImagen.alt = equipo.nombre
  modalCompeticion.textContent = equipo.competicion

  listaJugadores.innerHTML = ''

  const capitan = equipo.jugadores[0]
  modalCapitan.textContent = `Capitán: ${capitan.nombre} (${capitan.apodo}) · Nº ${capitan.numero} · ${capitan.posicion}`

  equipo.jugadores.forEach(jugador => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-center'

    const info = document.createElement('span')
    info.textContent = `${jugador.nombre} (${jugador.apodo})`

    const detalle = document.createElement('span')
    detalle.className = 'text-muted'
    detalle.textContent = `Nº ${jugador.numero} · ${jugador.posicion}`

    li.appendChild(info)
    li.appendChild(detalle)
    listaJugadores.appendChild(li)
  })

  const modal = new bootstrap.Modal(document.getElementById('modalEquipo'))
  modal.show()
}
