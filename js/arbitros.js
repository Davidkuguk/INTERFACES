let arbitrosData = []

fetch('/src/assets/data/arbitros.json')
  .then(r => r.json())
  .then(data => {
    arbitrosData = data.arbitros
    inicializarFiltrosArbitros()
    mostrarArbitros(arbitrosData)
  })

function inicializarFiltrosArbitros() {
  const selectCompeticion = document.getElementById('filtroCompeticionArbitros')
  const competicionesUnicas = [...new Set(arbitrosData.map(a => a.competicion))]

  competicionesUnicas.forEach(comp => {
    const option = document.createElement('option')
    option.value = comp
    option.textContent = comp
    selectCompeticion.appendChild(option)
  })

  const inputBusqueda = document.getElementById('busquedaArbitro')

  selectCompeticion.addEventListener('change', aplicarFiltrosArbitros)
  inputBusqueda.addEventListener('input', aplicarFiltrosArbitros)
}

function aplicarFiltrosArbitros() {
  const selectCompeticion = document.getElementById('filtroCompeticionArbitros')
  const inputBusqueda = document.getElementById('busquedaArbitro')

  const competicionSeleccionada = selectCompeticion.value
  const termino = inputBusqueda.value.trim().toLowerCase()

  let filtrados = arbitrosData

  if (competicionSeleccionada) {
    filtrados = filtrados.filter(a => a.competicion === competicionSeleccionada)
  }

  if (termino) {
    filtrados = filtrados.filter(a =>
      a.nombre.toLowerCase().includes(termino) ||
      a.apodo.toLowerCase().includes(termino) ||
      a.pais.toLowerCase().includes(termino) ||
      a.categoria.toLowerCase().includes(termino)
    )
  }

  mostrarArbitros(filtrados)
}

function mostrarArbitros(arbitros) {
  const tbody = document.getElementById('tbodyArbitros')
  tbody.innerHTML = ''

  if (!arbitros.length) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 5
    td.textContent = 'No se encontraron árbitros con los filtros seleccionados.'
    td.className = 'text-muted'
    tr.appendChild(td)
    tbody.appendChild(tr)
    return
  }

  arbitros.forEach((a, indice) => {
    const tr = document.createElement('tr')
    tr.style.cursor = 'pointer'
    tr.dataset.indiceArbitro = indice

    const tdNombre = document.createElement('td')
    tdNombre.className = 'text-start fw-semibold'
    tdNombre.textContent = a.nombre

    const tdApodo = document.createElement('td')
    tdApodo.textContent = a.apodo

    const tdPais = document.createElement('td')
    tdPais.textContent = a.pais

    const tdCategoria = document.createElement('td')
    tdCategoria.textContent = a.categoria

    const tdCompeticion = document.createElement('td')
    tdCompeticion.textContent = a.competicion

    tr.appendChild(tdNombre)
    tr.appendChild(tdApodo)
    tr.appendChild(tdPais)
    tr.appendChild(tdCategoria)
    tr.appendChild(tdCompeticion)

    tr.addEventListener('click', () => abrirModalArbitro(indice))

    tbody.appendChild(tr)
  })
}

function abrirModalArbitro(indice) {
  const arbitro = arbitrosData[indice]

  const modalNombre = document.getElementById('modalArbitroNombre')
  const modalImagen = document.getElementById('modalArbitroImagen')
  const modalCategoria = document.getElementById('modalArbitroCategoria')
  const modalCompeticion = document.getElementById('modalArbitroCompeticion')
  const modalApodo = document.getElementById('modalArbitroApodo')
  const modalPais = document.getElementById('modalArbitroPais')
  const modalStats = document.getElementById('modalArbitroStats')

  modalNombre.textContent = arbitro.nombre
  modalImagen.src = arbitro.imagen
  modalImagen.alt = arbitro.nombre
  modalCategoria.textContent = `${arbitro.categoria}`
  modalCompeticion.textContent = arbitro.competicion
  modalApodo.textContent = `Apodo: ${arbitro.apodo}`
  modalPais.textContent = `País: ${arbitro.pais}`

  modalStats.innerHTML = ''

  if (arbitro.estadisticas) {
    Object.keys(arbitro.estadisticas).forEach(clave => {
      const li = document.createElement('li')
      li.className = 'list-group-item d-flex justify-content-between align-items-center'
      const label = document.createElement('span')
      label.textContent = clave
      const valor = document.createElement('span')
      valor.className = 'fw-semibold'
      valor.textContent = arbitro.estadisticas[clave]
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

  const modal = new bootstrap.Modal(document.getElementById('modalArbitro'))
  modal.show()
}
