# Pausa 🌿

Sitio web interactivo de microhábitos de mindfulness para tomar pausas breves de 2 a 5 minutos durante el día: respiración guiada, registro de estado de ánimo, frases de reflexión y temporizador de meditación.

🔗 **Sitio publicado:** https://pausa-mindfulness-we-ga39.bolt.host


📂 **Repositorio:** [github.com/Gabphn/Project](https://github.com/Gabphn/Project)

## 📌 Descripción

**Pausa** es una página web creada con ayuda de inteligencia artificial como proyecto final del curso *Introducción a la IA y Vibecoding* (Tecnolochicas TC PRO). Ofrece herramientas sencillas para que las personas hagan pausas conscientes en medio de su rutina y den seguimiento a cómo se sienten.

## 🎯 Público objetivo

Jóvenes y adultos de 18 a 40 años que sienten estrés y buscan pausas breves, accesibles y sin complicaciones. El diseño transmite calma, claridad y cercanía, con una paleta suave (verdes salvia, azules tenues y beige) y mucho espacio en blanco.

## 🛠️ Herramientas utilizadas

- **IA para generar el código:** [Bolt](https://bolt.new)
- **Tecnologías:** HTML, CSS, JavaScript y Tailwind CSS
- **Entorno de desarrollo:** Vite
- **Almacenamiento local:** `localStorage` (sin backend)
- **Control de versiones:** Git y GitHub
- **Publicación:** Bolt (botón Publish)

## ✨ Funcionalidades

1. Sección principal (hero) con propuesta de valor
2. Ejercicio de respiración guiada con animación (inhala, sostén, exhala) y botones de iniciar y detener
3. Registro diario de estado de ánimo con 5 emojis, historial y resumen semanal
4. Frases aleatorias de mindfulness con botón "otra frase"
5. Temporizador de meditación de 1, 3 y 5 minutos
6. Modo oscuro y claro que recuerda la preferencia
7. Formulario de contacto o suscripción con validación y mensaje de confirmación
8. Menú de navegación con desplazamiento suave entre secciones
9. Diseño responsive (móvil, tableta y escritorio)
10. Estilo visual pulido: tarjetas con efecto de vidrio, animaciones y transiciones suaves

## 🤖 Prompts utilizados

### Prompt inicial (Rol, Tarea, Contexto y Restricciones)

```text
ROL:
Actúa como un desarrollador web front-end experto en HTML, Tailwind CSS y JavaScript vanilla, con experiencia en diseño UX para aplicaciones de bienestar emocional.

TAREA:
Construye un sitio web de una sola página llamado "Pausa", un espacio interactivo de microhábitos de mindfulness. Debe incluir: (1) una sección hero con propuesta de valor, (2) un ejercicio de respiración guiada con animación (inhala / sostén / exhala) con botones de iniciar y detener, (3) un registro de estado de ánimo diario con 5 emojis que guarde el historial y muestre un resumen semanal, (4) una frase o reflexión aleatoria de mindfulness con botón "otra frase", (5) un formulario de contacto o suscripción, y (6) un footer.

CONTEXTO:
El público objetivo son jóvenes y adultos de 18 a 40 años que sienten estrés y quieren pausas breves de 2 a 5 minutos durante su día. El sitio debe transmitir calma, claridad y cercanía. Usa una paleta suave (verdes salvia, azules tenues, beige), tipografía legible y mucho espacio en blanco. El idioma es español de México.

RESTRICCIONES:
- Un botón funcional de modo oscuro/claro que recuerde la preferencia.
- Diseño responsive (móvil primero).
- Todo en archivos simples: index.html, styles.css (o Tailwind por CDN) y script.js, sin frameworks ni backend.
- Guarda los datos del estado de ánimo con localStorage.
- Todos los botones, menús y enlaces deben funcionar; valida el formulario (campos obligatorios y correo válido) con mensaje de confirmación.
- Código comentado y organizado para que yo pueda entender cada parte.
- Debe poder publicarse directamente en GitHub Pages.
- Antes de generar el código, dime en 3 líneas tu plan para confirmar.
```

### Prompts de iteración (makeover visual)

1. `Aplica efecto de vidrio a las tarjetas y agrega sombras suaves y bordes redondeados.`
2. `Cambia las tipografías por una combinación más elegante y ajusta tamaños y espaciado entre líneas para mejor lectura.`
3. `Mejora el modo oscuro con una paleta propia y fondos con degradado sutil.`
4. `Revisa la versión móvil: ajusta márgenes, tamaño de botones y menú para que se vean bien en pantallas pequeñas.`
5. `Añade animaciones suaves al hacer scroll y efectos hover en botones y tarjetas.`
6. `[AGREGA AQUÍ OTROS PROMPTS QUE HAYAS USADO]`


## 📁 Estructura del proyecto

```text
├── index.html           # Estructura de la página
├── styles.css           # Estilos personalizados
├── script.js            # Lógica: respiración, ánimo, frases, temporizador y formulario
├── tailwind.config.js   # Configuración de Tailwind CSS
├── postcss.config.js    # Configuración de PostCSS
├── package.json         # Dependencias y scripts del proyecto
├── vite.config.ts       # Configuración de Vite
└── README.md            # Documentación del proyecto
```

## 🚀 Cómo ejecutarlo localmente

Requisito: tener [Node.js](https://nodejs.org) instalado.

```bash
git clone https://github.com/Gabphn/Project.git
cd Project
npm install
npm run dev
```

Después abre en tu navegador: `http://localhost:5173`

## 🌐 Publicación

El sitio fue publicado directamente desde **Bolt** con el botón *Publish*, que genera un enlace público accesible en línea.

## 👩‍💻 Autora

**María Gabriela Pantoja Hernández**
Proyecto final · Introducción a la IA y Vibecoding · Tecnolochicas TC PRO
