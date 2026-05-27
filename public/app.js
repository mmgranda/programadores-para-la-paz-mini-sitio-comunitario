const btnMensajes = document.getElementById("btnMensajes")
const btnCalendario = document.getElementById("btnCalendario")
const btnResumen = document.getElementById("btnResumen")
const btnLogin = document.getElementById("btnLogin")

const contenedorMensajes = document.getElementById("contenedorMensajes")
const contenedorCalendario = document.getElementById("contenedorCalendario")
const contenedorResumen = document.getElementById("contenedorResumen")
const mensajeLogin = document.getElementById("mensajeLogin")

const usuario = document.getElementById("usuario")
const clave = document.getElementById("clave")

const btnRevisionEditorial = document.getElementById("btnRevisionEditorial")
const contenedorRevisionEditorial = document.getElementById("contenedorRevisionEditorial")

btnRevisionEditorial.addEventListener("click", () => {
    cargarRevisionEditorial()
  })
  

btnMensajes.addEventListener("click", () => {
  cargarMensajes()
})

btnCalendario.addEventListener("click", () => {
  cargarCalendario()
})

btnResumen.addEventListener("click", () => {
  cargarResumen()
})

btnLogin.addEventListener("click", () => {
  hacerLogin()
})

async function hacerLogin() {
  try {
    const datosLogin = {
      usuario: usuario.value,
      clave: clave.value
    }

    const respuesta = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosLogin)
    })

    const datos = await respuesta.json()

    mensajeLogin.textContent = datos.mensaje

    if (respuesta.ok) {
      localStorage.setItem("tokenDemo", datos.token)
      localStorage.setItem("rolDemo", datos.rol)
    }
  } catch (error) {
    mensajeLogin.textContent = "No fue posible realizar el login pedagógico. Revisa el servidor."
  }
}

async function cargarMensajes() {
  try {
    const respuesta = await fetch("/api/mensajes")
    const mensajes = await respuesta.json()

    contenedorMensajes.innerHTML = ""

    for (const mensaje of mensajes) {
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjeta-mensaje")

      tarjeta.innerHTML = `
        <h3>${mensaje.titulo}</h3>
        <p>${mensaje.mensaje}</p>

        <p>
          <span class="etiqueta">Categoría: ${mensaje.categoria}</span>
          <span class="etiqueta">Audiencia: ${mensaje.audiencia}</span>
          <span class="etiqueta">Tono: ${mensaje.tono}</span>
        </p>

        <p><strong>Llamado a la acción:</strong> ${mensaje.llamadoAccion}</p>
        <p class="texto-secundario"><strong>Fuente:</strong> ${mensaje.fuente}</p>
        <p class="texto-secundario"><strong>Revisión editorial:</strong> ${mensaje.revisionEditorial}</p>
      `

      contenedorMensajes.appendChild(tarjeta)
    }
  } catch (error) {
    contenedorMensajes.textContent = "No fue posible cargar los mensajes. Revisa que el servidor esté funcionando."
  }
}

async function cargarCalendario() {
  try {
    const respuesta = await fetch("/api/calendario")
    const calendario = await respuesta.json()

    contenedorCalendario.innerHTML = ""

    for (const pieza of calendario) {
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjeta-mensaje")

      tarjeta.innerHTML = `
        <h3>Semana ${pieza.semana} - ${pieza.dia}</h3>
        <p><strong>Tema:</strong> ${pieza.tema}</p>
        <p><strong>Pieza:</strong> ${pieza.pieza}</p>
        <p><strong>Canal:</strong> ${pieza.canal}</p>
        <p><strong>Público objetivo:</strong> ${pieza.publicoObjetivo}</p>
        <p><strong>Propósito:</strong> ${pieza.proposito}</p>
        <p><strong>Llamado a la acción:</strong> ${pieza.llamadoAccion}</p>
        <p class="texto-secundario"><strong>Fuente:</strong> ${pieza.fuente}</p>
      `

      contenedorCalendario.appendChild(tarjeta)
    }
  } catch (error) {
    contenedorCalendario.textContent = "No fue posible cargar el calendario editorial. Revisa que el servidor esté funcionando."
  }
}

async function cargarResumen() {
  try {
    const respuesta = await fetch("/api/resumen")
    const resumen = await respuesta.json()

    contenedorResumen.innerHTML = ""

    const tarjeta = document.createElement("article")
    tarjeta.classList.add("tarjeta-mensaje")

    tarjeta.innerHTML = `
      <h3>Resumen del proyecto</h3>
      <p>Total de mensajes: ${resumen.totalMensajes}</p>
      <p>Total de piezas del calendario: ${resumen.totalPiezasCalendario}</p>
      <p>Categorías encontradas: ${resumen.categoriasMensajes.join(", ")}</p>
      <p>${resumen.mensaje}</p>
    `

    contenedorResumen.appendChild(tarjeta)
  } catch (error) {
    contenedorResumen.textContent = "No fue posible cargar el resumen. Revisa que el servidor esté funcionando."
  }
}

async function cargarRevisionEditorial() {
    try {
      const token = localStorage.getItem("tokenDemo")
  
      const respuesta = await fetch("/api/revision-editorial", {
        headers: {
          "Authorization": token
        }
      })
  
      const datos = await respuesta.json()
  
      contenedorRevisionEditorial.innerHTML = ""
  
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjeta-mensaje")
  
      tarjeta.innerHTML = `
        <h3>Revisión editorial protegida</h3>
        <p>${datos.mensaje}</p>
        <p>${datos.recomendacion || ""}</p>
      `
  
      if (datos.criterios) {
        tarjeta.innerHTML += `
          <p><strong>Criterios:</strong> ${datos.criterios.join(", ")}</p>
        `
      }
  
      contenedorRevisionEditorial.appendChild(tarjeta)
    } catch (error) {
      contenedorRevisionEditorial.textContent = "No fue posible consultar la ruta protegida."
    }
  }
  