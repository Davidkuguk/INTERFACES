let resultadosDataClasificacion = []

fetch('/src/assets/data/resultados.json')
  .then(r => r.json())
  .then(data => {
    resultadosDataClasificacion = data.resultados
    inicializarFiltroClasificacion()
  })

function inicializarFiltroClasificacion() {
  const selectCompeticion = document.getElementById('filtroCompeticionClasificacion')
  const competicionesUnicas = [...new Set(resultadosDataClasificacion.map(r => r.competicion))]

  competicionesUnicas.forEach(comp => {
    const option = document.createElement('option')
    option.value = comp
    option.textContent = comp
    selectCompeticion.appendChild(option)
  })

  selectCompeticion.addEventListener('change', () => {
    const valor = selectCompeticion.value
    if (!valor) {
      mostrarClasificacion([])
      return
    }
    const filtrados = resultadosDataClasificacion.filter(r => r.competicion === valor)
    const clasificacion = calcularClasificacion(filtrados)
    mostrarClasificacion(clasificacion)
  })
}

function calcularClasificacion(resultados) {
  const tabla = {}

  resultados.forEach(r => {
    if (!tabla[r.local]) {
      tabla[r.local] = { equipo: r.local, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }
    }
    if (!tabla[r.visitante]) {
      tabla[r.visitante] = { equipo: r.visitante, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }
    }

    tabla[r.local].pj++
    tabla[r.visitante].pj++

    tabla[r.local].gf += r.golesLocal
    tabla[r.local].gc += r.golesVisitante
    tabla[r.visitante].gf += r.golesVisitante
    tabla[r.visitante].gc += r.golesLocal

    if (r.golesLocal > r.golesVisitante) {
      tabla[r.local].g++
      tabla[r.local].pts += 3
      tabla[r.visitante].p++
    } else if (r.golesLocal < r.golesVisitante) {
      tabla[r.visitante].g++
      tabla[r.visitante].pts += 3
      tabla[r.local].p++
    } else {
      tabla[r.local].e++
      tabla[r.visitante].e++
      tabla[r.local].pts++
      tabla[r.visitante].pts++
    }
  })

  const clasificacion = Object.values(tabla).map(e => ({
    ...e,
    dg: e.gf - e.gc
  }))

  clasificacion.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.dg !== a.dg) return b.dg - a.dg
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.equipo.localeCompare(b.equipo)
  })

  return clasificacion
}

function mostrarClasificacion(clasificacion) {
  const tbody = document.getElementById('tbodyClasificacion')
  tbody.innerHTML = ''

  if (!clasificacion.length) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 10
    td.textContent = 'Selecciona una competición para ver la clasificación.'
    td.className = 'text-muted'
    tr.appendChild(td)
    tbody.appendChild(tr)
    return
  }

  clasificacion.forEach((e, indice) => {
    const tr = document.createElement('tr')

    const tdPos = document.createElement('td')
    tdPos.textContent = indice + 1

    const tdEquipo = document.createElement('td')
    tdEquipo.className = 'text-start fw-semibold'
    tdEquipo.textContent = e.equipo

    const tdPJ = document.createElement('td')
    tdPJ.textContent = e.pj

    const tdG = document.createElement('td')
    tdG.textContent = e.g

    const tdE = document.createElement('td')
    tdE.textContent = e.e

    const tdP = document.createElement('td')
    tdP.textContent = e.p

    const tdGF = document.createElement('td')
    tdGF.textContent = e.gf

    const tdGC = document.createElement('td')
    tdGC.textContent = e.gc

    const tdDG = document.createElement('td')
    tdDG.textContent = e.dg

    const tdPTS = document.createElement('td')
    tdPTS.className = 'fw-bold'
    tdPTS.textContent = e.pts

    tr.appendChild(tdPos)
    tr.appendChild(tdEquipo)
    tr.appendChild(tdPJ)
    tr.appendChild(tdG)
    tr.appendChild(tdE)
    tr.appendChild(tdP)
    tr.appendChild(tdGF)
    tr.appendChild(tdGC)
    tr.appendChild(tdDG)
    tr.appendChild(tdPTS)
    tbody.appendChild(tr)
  })
}
