document.addEventListener("DOMContentLoaded", () => {
  const ramos = [...document.querySelectorAll(".ramo")];

  const aprobadosGuardados =
    JSON.parse(localStorage.getItem("aprobados")) || [];

  ramos.forEach(ramo => {
    if (aprobadosGuardados.includes(ramo.dataset.id)) {
      ramo.classList.add("aprobado");
    }
  });

  function actualizarBloqueos() {
    let cambios;

    do {
      cambios = false;

      const aprobados = ramos
        .filter(r => r.classList.contains("aprobado"))
        .map(r => r.dataset.id);

      ramos.forEach(ramo => {
        if (!ramo.dataset.prereq) {
          ramo.classList.remove("bloqueado");
          return;
        }

        const prereqs = ramo.dataset.prereq.split(",");
        const cumple = prereqs.every(p => aprobados.includes(p));

        if (!cumple) {
          if (!ramo.classList.contains("bloqueado")) {
            ramo.classList.add("bloqueado");
            cambios = true;
          }

          if (ramo.classList.contains("aprobado")) {
            ramo.classList.remove("aprobado");
            cambios = true;
          }
        } else {
          ramo.classList.remove("bloqueado");
        }
      });

    } while (cambios);

    const aprobadosFinales = ramos
      .filter(r => r.classList.contains("aprobado"))
      .map(r => r.dataset.id);

    localStorage.setItem("aprobados", JSON.stringify(aprobadosFinales));
  }

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      if (ramo.classList.contains("bloqueado")) return;

      ramo.classList.toggle("aprobado");
      actualizarBloqueos();
    });
  });

  actualizarBloqueos();
});
