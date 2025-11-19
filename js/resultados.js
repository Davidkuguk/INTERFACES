let resultadosData = []

fetch('/src/assets/data/resultados.json')
  .then(r => r.json())
  .then(data => {
    resultadosData = data.resultados
    inicializarFiltrosResultados()
    mostrarResultados(resultadosData)
  })

function inicializarFiltrosResultados() {
  const selectCompeticion = document.getElementById('filtroCompeticionResultados')
  const selectJornada = document.getElementById('filtroJornada')

  const competicionesUnicas = [...new Set(resultadosData.map(r => r.competicion))]
  competicionesUnicas.forEach(comp => {
    const option = document.createElement('option')
    option.value = comp
    option.textContent = comp
    selectCompeticion.appendChild(option)
  })

  selectCompeticion.addEventListener('change', () => {
    actualizarOpcionesJornada()
    aplicarFiltrosResultados()
  })

  selectJornada.addEventListener('change', () => {
    aplicarFiltrosResultados()
  })

  actualizarOpcionesJornada()
}

function actualizarOpcionesJornada() {
  const selectCompeticion = document.getElementById('filtroCompeticionResultados')
  const selectJornada = document.getElementById('filtroJornada')
  const competicionSeleccionada = selectCompeticion.value

  selectJornada.innerHTML = ''
  const optionTodas = document.createElement('option')
  optionTodas.value = ''
  optionTodas.textContent = 'Todas las jornadas'
  selectJornada.appendChild(optionTodas)

  let resultadosFiltrados = resultadosData

  if (competicionSeleccionada) {
    resultadosFiltrados = resultadosData.filter(r => r.competicion === competicionSeleccionada)
  }

  const jornadasUnicas = [...new Set(resultadosFiltrados.map(r => r.jornada))].sort((a, b) => a - b)

  jornadasUnicas.forEach(j => {
    const option = document.createElement('option')
    option.value = String(j)
    option.textContent = `Jornada ${j}`
    selectJornada.appendChild(option)
  })
}

function aplicarFiltrosResultados() {
  const selectCompeticion = document.getElementById('filtroCompeticionResultados')
  const selectJornada = document.getElementById('filtroJornada')

  const competicionSeleccionada = selectCompeticion.value
  const jornadaSeleccionada = selectJornada.value

  let filtrados = resultadosData

  if (competicionSeleccionada) {
    filtrados = filtrados.filter(r => r.competicion === competicionSeleccionada)
  }

  if (jornadaSeleccionada) {
    filtrados = filtrados.filter(r => String(r.jornada) === jornadaSeleccionada)
  }

  mostrarResultados(filtrados)
}

function mostrarResultados(resultados) {
  const tbody = document.getElementById('tbodyResultados')
  tbody.innerHTML = ''

  if (!resultados.length) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 6
    td.textContent = 'No hay resultados para los filtros seleccionados.'
    td.className = 'text-muted'
    tr.appendChild(td)
    tbody.appendChild(tr)
    return
  }

  resultados.forEach(r => {
    const tr = document.createElement('tr')

    const tdLocal = document.createElement('td')
    tdLocal.className = 'text-start fw-semibold'
    tdLocal.textContent = r.local

    const tdMarcador = document.createElement('td')
    tdMarcador.className = 'fw-bold'
    tdMarcador.textContent = `${r.golesLocal} - ${r.golesVisitante}`

    const tdVisitante = document.createElement('td')
    tdVisitante.className = 'text-end fw-semibold'
    tdVisitante.textContent = r.visitante

    const tdCompeticion = document.createElement('td')
    tdCompeticion.textContent = r.competicion

    const tdJornada = document.createElement('td')
    tdJornada.textContent = r.jornada

    const tdFecha = document.createElement('td')
    tdFecha.textContent = r.fecha

    tr.appendChild(tdLocal)
    tr.appendChild(tdMarcador)
    tr.appendChild(tdVisitante)
    tr.appendChild(tdCompeticion)
    tr.appendChild(tdJornada)
    tr.appendChild(tdFecha)
    tbody.appendChild(tr)
  })
}
