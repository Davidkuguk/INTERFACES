let jugadoresData = []

fetch('/src/assets/data/equipos.json')
  .then(r => r.json())
  .then(data => {
    construirJugadoresDesdeEquipos(data.equipos)
    inicializarFiltrosJugadores()
    mostrarJugadores(jugadoresData)
  })

function construirJugadoresDesdeEquipos(equipos) {
  jugadoresData = []
  equipos.forEach(equipo => {
    equipo.jugadores.forEach(jugador => {
      jugadoresData.push({
        nombre: jugador.nombre,
        apodo: jugador.apodo,
        numero: jugador.numero,
        posicion: jugador.posicion,
        equipo: equipo.nombre,
        competicion: equipo.competicion,
        imagenEquipo: equipo.imagen,
        estadisticas: jugador.estadisticas || null
      })
    })
  })
}

function inicializarFiltrosJugadores() {
  const selectCompeticion = document.getElementById('filtroCompeticionJugadores')
  const competicionesUnicas = [...new Set(jugadoresData.map(j => j.competicion))]

  competicionesUnicas.forEach(comp => {
    const option = document.createElement('option')
    option.value = comp
    option.textContent = comp
    selectCompeticion.appendChild(option)
  })

  const inputBusqueda = document.getElementById('busquedaJugador')

  selectCompeticion.addEventListener('change', aplicarFiltrosJugadores)
  inputBusqueda.addEventListener('input', aplicarFiltrosJugadores)
}

function aplicarFiltrosJugadores() {
  const selectCompeticion = document.getElementById('filtroCompeticionJugadores')
  const inputBusqueda = document.getElementById('busquedaJugador')

  const competicionSeleccionada = selectCompeticion.value
  const termino = inputBusqueda.value.trim().toLowerCase()

  let filtrados = jugadoresData

  if (competicionSeleccionada) {
    filtrados = filtrados.filter(j => j.competicion === competicionSeleccionada)
  }

  if (termino) {
    filtrados = filtrados.filter(j =>
      j.nombre.toLowerCase().includes(termino) ||
      j.apodo.toLowerCase().includes(termino) ||
      j.equipo.toLowerCase().includes(termino) ||
      j.posicion.toLowerCase().includes(termino)
    )
  }

  mostrarJugadores(filtrados)
}


function mostrarJugadores(jugadores) {
  const tbody = document.getElementById('tbodyJugadores')
  tbody.innerHTML = ''

  if (!jugadores.length) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 6
    td.textContent = 'No se encontraron jugadores con los filtros seleccionados.'
    td.className = 'text-muted'
    tr.appendChild(td)
    tbody.appendChild(tr)
    return
  }

  jugadores.forEach((j, indice) => {
    const tr = document.createElement('tr')
    tr.style.cursor = 'pointer'
    tr.dataset.indiceJugador = indice

    const tdNombre = document.createElement('td')
    tdNombre.className = 'text-start fw-semibold'
    tdNombre.textContent = j.nombre

    const tdApodo = document.createElement('td')
    tdApodo.textContent = j.apodo

    const tdNumero = document.createElement('td')
    tdNumero.textContent = j.numero

    const tdPosicion = document.createElement('td')
    tdPosicion.textContent = j.posicion

    const tdEquipo = document.createElement('td')
    tdEquipo.textContent = j.equipo

    const tdCompeticion = document.createElement('td')
    tdCompeticion.textContent = j.competicion

    tr.appendChild(tdNombre)
    tr.appendChild(tdApodo)
    tr.appendChild(tdNumero)
    tr.appendChild(tdPosicion)
    tr.appendChild(tdEquipo)
    tr.appendChild(tdCompeticion)

    tr.addEventListener('click', () => abrirModalJugador(indice))

    tbody.appendChild(tr)
  })
}

function abrirModalJugador(indice) {
  const jugador = jugadoresData[indice]

  const modalNombre = document.getElementById('modalJugadorNombre')
  const modalEscudo = document.getElementById('modalJugadorEscudo')
  const modalEquipo = document.getElementById('modalJugadorEquipo')
  const modalCompeticion = document.getElementById('modalJugadorCompeticion')
  const modalApodo = document.getElementById('modalJugadorApodo')
  const modalNumero = document.getElementById('modalJugadorNumero')
  const modalPosicion = document.getElementById('modalJugadorPosicion')
  const modalStats = document.getElementById('modalJugadorStats')

  modalNombre.textContent = jugador.nombre
  modalEscudo.src = jugador.imagenEquipo
  modalEscudo.alt = jugador.equipo
  modalEquipo.textContent = jugador.equipo
  modalCompeticion.textContent = jugador.competicion
  modalApodo.textContent = `Apodo: ${jugador.apodo}`
  modalNumero.textContent = `Número: ${jugador.numero}`
  modalPosicion.textContent = `Posición: ${jugador.posicion}`

  modalStats.innerHTML = ''

  if (jugador.estadisticas) {
    Object.keys(jugador.estadisticas).forEach(clave => {
      const li = document.createElement('li')
      li.className = 'list-group-item d-flex justify-content-between align-items-center'
      const label = document.createElement('span')
      label.textContent = clave
      const valor = document.createElement('span')
      valor.className = 'fw-semibold'
      valor.textContent = jugador.estadisticas[clave]
      li.appendChild(label)
      li.appendChild(valor)
      modalStats.appendChild(li)
    })
  } else {
    const li = document.createElement('li')
    li.className = 'list-group-item text-muted'
    li.textContent = 'Sin estadísticas registradas por el momento.'
    modalStats.appendChild(li)
  }

  const modal = new bootstrap.Modal(document.getElementById('modalJugador'))
  modal.show()
}
