const express = require("express")
const fs = require("fs")

const app = express()
const puerto = 3000

app.use(express.json())
app.use(express.static("public"))

function leerJson(ruta) {
  const contenido = fs.readFileSync(ruta, "utf-8")
  return JSON.parse(contenido)
}

function verificarTokenDemo(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Falta token de demostración."
    })
  }

  if (token !== "token-demostracion-clase-24") {
    return res.status(403).json({
      mensaje: "Acceso denegado. El token de demostración no es válido."
    })
  }

  next()
}

app.get("/api/mensajes", (req, res) => {
  try {
    const mensajes = leerJson("data/mensajes.json")
    res.json(mensajes)
  } catch (error) {
    res.status(500).json({
      mensaje: "No fue posible cargar los mensajes comunitarios.",
      detalle: error.message
    })
  }
})

app.get("/api/calendario", (req, res) => {
  try {
    const calendario = leerJson("data/calendario-editorial.json")
    res.json(calendario)
  } catch (error) {
    res.status(500).json({
      mensaje: "No fue posible cargar el calendario editorial.",
      detalle: error.message
    })
  }
})

app.get("/api/resumen", (req, res) => {
  try {
    const mensajes = leerJson("data/mensajes.json")
    const calendario = leerJson("data/calendario-editorial.json")

    const resumen = {
      totalMensajes: mensajes.length,
      totalPiezasCalendario: calendario.length,
      categoriasMensajes: mensajes.map((mensaje) => mensaje.categoria),
      mensaje: "Resumen generado desde la API propia del proyecto comunitario."
    }

    res.json(resumen)
  } catch (error) {
    res.status(500).json({
      mensaje: "No fue posible generar el resumen del proyecto.",
      detalle: error.message
    })
  }
})

app.post("/api/login", (req, res) => {
  const usuario = req.body.usuario
  const clave = req.body.clave

  if (!usuario || !clave) {
    return res.status(400).json({
      mensaje: "Falta usuario o clave. Completa ambos campos."
    })
  }

  if (usuario === "docente" && clave === "demo") {
    return res.json({
      mensaje: "Login pedagógico correcto. Ya puedes probar la ruta protegida.",
      usuario: "docente",
      rol: "editor",
      token: "token-demostracion-clase-24"
    })
  }

  res.status(401).json({
    mensaje: "Usuario o clave de demostración incorrectos."
  })
})

app.get("/api/revision-editorial", verificarTokenDemo, (req, res) => {
  res.json({
    mensaje: "Acceso permitido a la revisión editorial pedagógica.",
    recomendacion: "Antes de publicar, revisa fuente, audiencia, tono, llamado a la acción y lenguaje responsable.",
    criterios: [
      "difusión responsable",
      "revisión de fuentes",
      "consistencia comunicativa",
      "moderación editorial básica",
      "lenguaje responsable y no estigmatizante"
    ]
  })
})

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada. Revisa la dirección solicitada."
  })
})

app.listen(puerto, () => {
  console.log("Mini-sitio comunitario funcionando en http://localhost:3000")
  console.log("Proyecto único de Semana 5")
  console.log("Rutas disponibles:")
  console.log("GET  /api/mensajes")
  console.log("GET  /api/calendario")
  console.log("GET  /api/resumen")
  console.log("POST /api/login")
  console.log("GET  /api/revision-editorial")
})
