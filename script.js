
let totalCreditos = 160;
let materiasEstado = {};

function crearMalla() {
  const contenedor = document.getElementById('contenedor-semestres');
  materiasData.forEach(bloque => {
    const div = document.createElement('div');
    div.className = 'semestre';
    div.innerHTML = `<h2>Semestre ${bloque.semestre}</h2>`;
    bloque.materias.forEach(materia => {
      materiasEstado[materia.codigo] = { ...materia, checked: false };
      const matDiv = document.createElement('div');
      matDiv.className = 'materia';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.disabled = true;
      checkbox.dataset.codigo = materia.codigo;
      checkbox.dataset.creditos = materia.creditos;
      checkbox.onchange = actualizar;
      matDiv.appendChild(checkbox);
      const label = document.createElement('label');
      label.innerText = `${materia.nombre} (${materia.creditos} créditos)`;
      matDiv.appendChild(label);
      div.appendChild(matDiv);
    });
    contenedor.appendChild(div);
  });
  actualizar();
}

function actualizar() {
  let creditos = 0;
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    const codigo = c.dataset.codigo;
    materiasEstado[codigo].checked = c.checked;
    if (c.checked) creditos += parseInt(c.dataset.creditos);
  });

  // Actualizar progresos
  let porcentaje = ((creditos / totalCreditos) * 100).toFixed(1);
  document.getElementById('creditos').textContent = `Créditos aprobados: ${creditos} / ${totalCreditos}`;
  document.getElementById('porcentaje').textContent = `Avance: ${porcentaje}%`;

  // Saber Pro y Seminario
  document.getElementById('alerta-saber').textContent = creditos >= totalCreditos * 0.75
    ? "✅ Puedes presentar la Prueba Saber Pro"
    : "";
  document.getElementById('alerta-seminario').textContent = creditos >= 128
    ? "✅ Puedes inscribir Seminario de Grado"
    : "";

  // Habilitar materias
  document.querySelectorAll('input[type="checkbox"]').forEach(c => {
    const codigo = c.dataset.codigo;
    const m = materiasEstado[codigo];
    let habilitado = true;
    if (m.prerrequisitos) {
      habilitado = m.prerrequisitos.every(req => materiasEstado[req]?.checked);
    }
    if (m.prerrequisitos_creditos) {
      habilitado = habilitado && creditos >= m.prerrequisitos_creditos;
    }
    c.disabled = !habilitado;
  });
}

crearMalla();
