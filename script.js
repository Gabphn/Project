/*
  Lógica de Pausa.
  1. Modo oscuro/claro con preferencia guardada.
  2. Encabezado y menú móvil.
  3. Ejercicio de respiración guiada.
  4. Registro de ánimo con historial y resumen semanal (localStorage).
  5. Frases aleatorias.
  6. Validación del formulario de suscripción.
*/

/* ===================== Utilidades ===================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* Devuelve la fecha local como texto AAAA-MM-DD (evita problemas de zona horaria con toISOString) */
function fechaISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/* ===================== 1. Modo oscuro / claro ===================== */

const CLAVE_TEMA = 'pausa-tema';
const botonTema = $('#boton-tema');
const iconoLuna = $('#icono-luna');
const iconoSol = $('#icono-sol');

/* Muestra el icono y la etiqueta correctos según el tema activo */
function actualizarBotonTema() {
  const esOscuro = document.documentElement.classList.contains('dark');
  iconoLuna.classList.toggle('hidden', esOscuro);
  iconoSol.classList.toggle('hidden', !esOscuro);
  const etiqueta = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  botonTema.setAttribute('aria-label', etiqueta);
  botonTema.setAttribute('title', etiqueta);
}

botonTema.addEventListener('click', () => {
  const esOscuro = document.documentElement.classList.toggle('dark');
  localStorage.setItem(CLAVE_TEMA, esOscuro ? 'oscuro' : 'claro');
  actualizarBotonTema();
});

actualizarBotonTema();

/* ===================== 2. Encabezado y menú móvil ===================== */

const encabezado = $('#encabezado');
const botonMenu = $('#boton-menu');
const menuMovil = $('#menu-movil');
const iconoMenu = $('#icono-menu');
const iconoCerrar = $('#icono-cerrar');

/* Agrega fondo sólido al encabezado cuando la página se desplaza */
function revisarScroll() {
  encabezado.classList.toggle('encabezado-scroll', window.scrollY > 24);
}

window.addEventListener('scroll', revisarScroll, { passive: true });
revisarScroll();

/* Abre o cierra el menú de móvil */
function alternarMenu(abrir) {
  const estaAbierto = abrir ?? menuMovil.classList.contains('hidden');
  menuMovil.classList.toggle('hidden', !estaAbierto);
  botonMenu.setAttribute('aria-expanded', String(estaAbierto));
  botonMenu.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
  iconoMenu.classList.toggle('hidden', estaAbierto);
  iconoCerrar.classList.toggle('hidden', !estaAbierto);
}

botonMenu.addEventListener('click', () => alternarMenu());

/* Cierra el menú al elegir una sección */
menuMovil.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', () => alternarMenu(false));
});

/* ===================== 3. Respiración guiada ===================== */

/* Cada fase dura lo indicado en ms y mueve el círculo a su escala */
const FASES_RESPIRACION = [
  { nombre: 'Inhala', duracion: 4, escala: 1, halo: 1.15 },
  { nombre: 'Sostén', duracion: 4, escala: 1, halo: 1.15 },
  { nombre: 'Exhala', duracion: 6, escala: 0.7, halo: 0.6 },
];

/* Una sesión se cierra sola a los 5 minutos, el máximo de la propuesta */
const DURACION_MAXIMA_SESION = 5 * 60 * 1000;

const botonIniciar = $('#boton-iniciar-respiracion');
const botonDetener = $('#boton-detener-respiracion');
const circulo = $('#circulo-respiracion');
const halo = $('#halo-respiracion');
const textoCirculo = $('#texto-respiracion');
const contadorRespiracion = $('#contador-respiracion');

/* Temporizadores activos de la sesión, guardados para poder cancelarlos */
let temporizadorFase = null;
let temporizadorSegundos = null;
let temporizadorSesion = null;
let indiceFase = 0;
let segundosRestantes = 0;
let ciclos = 0;
let sesionActiva = false;

/* Pone el círculo en una fase y arranca la cuenta regresiva de esa fase */
function mostrarFase(indice) {
  const fase = FASES_RESPIRACION[indice];
  indiceFase = indice;
  segundosRestantes = fase.duracion;

  circulo.style.transitionDuration = `${fase.duracion}s`;
  halo.style.transitionDuration = `${fase.duracion}s`;
  circulo.style.transform = `scale(${fase.escala})`;
  halo.style.transform = `scale(${fase.halo})`;
  textoCirculo.textContent = fase.nombre;

  actualizarContador();
  clearInterval(temporizadorSegundos);
  temporizadorSegundos = setInterval(() => {
    segundosRestantes -= 1;
    actualizarContador();
  }, 1000);

  clearTimeout(temporizadorFase);
  temporizadorFase = setTimeout(() => {
    const siguiente = (indiceFase + 1) % FASES_RESPIRACION.length;
    if (siguiente === 0) ciclos += 1;
    mostrarFase(siguiente);
  }, fase.duracion * 1000);
}

function actualizarContador() {
  const fase = FASES_RESPIRACION[indiceFase];
  contadorRespiracion.textContent = `Ciclo ${ciclos + 1} · ${fase.nombre} · ${Math.max(segundosRestantes, 0)} s`;
}

/* Detiene los temporizadores y regresa el círculo a su posición inicial */
function detenerRespiracion(mensaje) {
  sesionActiva = false;
  clearTimeout(temporizadorFase);
  clearInterval(temporizadorSegundos);
  clearTimeout(temporizadorSesion);

  circulo.style.transitionDuration = '0.6s';
  halo.style.transitionDuration = '0.6s';
  circulo.style.transform = 'scale(0.7)';
  halo.style.transform = 'scale(0.6)';
  textoCirculo.textContent = 'Listo';
  contadorRespiracion.textContent = mensaje;

  botonIniciar.disabled = false;
  botonDetener.disabled = true;
}

function iniciarRespiracion() {
  if (sesionActiva) return;
  sesionActiva = true;
  ciclos = 0;
  botonIniciar.disabled = true;
  botonDetener.disabled = false;

  mostrarFase(0);
  temporizadorSesion = setTimeout(() => {
    detenerRespiracion('Pausa completa. Qué bien que te diste este momento.');
  }, DURACION_MAXIMA_SESION);
}

botonIniciar.addEventListener('click', iniciarRespiracion);
botonDetener.addEventListener('click', () => {
  detenerRespiracion('Pausa detenida. Vuelve cuando quieras.');
});

/* ===================== 3b. Temporizador de meditación ===================== */

const CIRCUNFERENCIA_ANILLO = 2 * Math.PI * 54;

const botonesDuracion = document.querySelectorAll('.boton-duracion');
const tiempoMeditacion = $('#tiempo-meditacion');
const progresoMeditacion = $('#progreso-meditacion');
const estadoMeditacion = $('#estado-meditacion');
const botonIniciarMeditacion = $('#boton-iniciar-meditacion');
const botonDetenerMeditacion = $('#boton-detener-meditacion');

let minutosMeditacion = 3;
let finMeditacion = 0;
let temporizadorMeditacion = null;
let contextoAudio = null;

progresoMeditacion.style.strokeDasharray = String(CIRCUNFERENCIA_ANILLO);

/* Convierte segundos en formato MM:SS */
function formatearTiempo(segundos) {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const resto = String(segundos % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

/* Muestra el tiempo restante y el anillo; progreso va de 0 (inicio) a 1 (terminado) */
function mostrarTiempoMeditacion(segundos, progreso) {
  tiempoMeditacion.textContent = formatearTiempo(segundos);
  progresoMeditacion.style.strokeDashoffset = String(CIRCUNFERENCIA_ANILLO * progreso);
}

/* Las duraciones solo se pueden cambiar cuando no hay una meditación en curso */
function bloquearDuraciones(bloqueado) {
  botonesDuracion.forEach((boton) => {
    boton.disabled = bloqueado;
  });
}

function marcarDuracionMeditacion(minutos) {
  botonesDuracion.forEach((boton) => {
    boton.setAttribute('aria-checked', String(Number(boton.dataset.minutos) === minutos));
  });
}

botonesDuracion.forEach((boton) => {
  boton.addEventListener('click', () => {
    minutosMeditacion = Number(boton.dataset.minutos);
    marcarDuracionMeditacion(minutosMeditacion);
    mostrarTiempoMeditacion(minutosMeditacion * 60, 0);
  });
});

/* Los navegadores exigen que el audio se active tras un clic, así que se prepara al iniciar */
function prepararAudio() {
  if (!contextoAudio) contextoAudio = new AudioContext();
  if (contextoAudio.state === 'suspended') contextoAudio.resume();
}

/* Campana sintetizada: dos tonos suaves que se desvanecen en unos segundos */
function tocarCampana() {
  prepararAudio();
  const ahora = contextoAudio.currentTime;
  const tonos = [
    { frecuencia: 528, volumen: 0.12 },
    { frecuencia: 1056, volumen: 0.04 },
  ];

  tonos.forEach(({ frecuencia, volumen }) => {
    const oscilador = contextoAudio.createOscillator();
    const ganancia = contextoAudio.createGain();
    oscilador.type = 'sine';
    oscilador.frequency.value = frecuencia;
    ganancia.gain.setValueAtTime(0.0001, ahora);
    ganancia.gain.exponentialRampToValueAtTime(volumen, ahora + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 4);
    oscilador.connect(ganancia).connect(contextoAudio.destination);
    oscilador.start(ahora);
    oscilador.stop(ahora + 4);
  });
}

/* Se calcula con la hora de fin, así el conteo no se atrasa si la pestaña queda en segundo plano */
function actualizarMeditacion() {
  const duracionSegundos = minutosMeditacion * 60;
  const restante = Math.max(0, Math.ceil((finMeditacion - Date.now()) / 1000));
  mostrarTiempoMeditacion(restante, (duracionSegundos - restante) / duracionSegundos);
  if (restante === 0) terminarMeditacion(true);
}

function iniciarMeditacion() {
  if (temporizadorMeditacion) return;
  prepararAudio();
  finMeditacion = Date.now() + minutosMeditacion * 60 * 1000;
  temporizadorMeditacion = setInterval(actualizarMeditacion, 250);
  botonIniciarMeditacion.disabled = true;
  botonDetenerMeditacion.disabled = false;
  bloquearDuraciones(true);
  estadoMeditacion.textContent = 'Respira con calma. Tu pausa ha comenzado.';
  actualizarMeditacion();
}

/* Cierra la sesión; si se completó suena la campana, si no se regresa al inicio */
function terminarMeditacion(completada) {
  clearInterval(temporizadorMeditacion);
  temporizadorMeditacion = null;
  botonIniciarMeditacion.disabled = false;
  botonDetenerMeditacion.disabled = true;
  bloquearDuraciones(false);

  if (completada) {
    mostrarTiempoMeditacion(0, 1);
    estadoMeditacion.textContent = 'Pausa completa. Tómate un momento antes de seguir.';
    tocarCampana();
  } else {
    mostrarTiempoMeditacion(minutosMeditacion * 60, 0);
    estadoMeditacion.textContent = 'Meditación detenida. Vuelve cuando quieras.';
  }
}

botonIniciarMeditacion.addEventListener('click', iniciarMeditacion);
botonDetenerMeditacion.addEventListener('click', () => terminarMeditacion(false));

/* ===================== 4. Registro de ánimo ===================== */

const CLAVE_ANIMO = 'pausa-animo';
const ETIQUETAS_ANIMO = ['Muy mal', 'Mal', 'Neutral', 'Bien', 'Muy bien'];
const DIAS_CORTOS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const opcionesAnimo = $$('.boton-animo');
const mensajeAnimo = $('#mensaje-animo');
const promedioSemana = $('#promedio-semana');
const graficaSemana = $('#grafica-semana');
const botonBorrarHistorial = $('#boton-borrar-historial');

/* Lee el historial de localStorage y descarta datos dañados */
function leerRegistrosAnimo() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_ANIMO));
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (registro) => typeof registro.fecha === 'string' && Number.isInteger(registro.valor) && registro.valor >= 1 && registro.valor <= 5
    );
  } catch {
    return [];
  }
}

function guardarRegistrosAnimo(registros) {
  localStorage.setItem(CLAVE_ANIMO, JSON.stringify(registros));
}

/* Guarda el ánimo de hoy; si ya existe, lo reemplaza */
function registrarAnimo(valor) {
  const hoy = fechaISO(new Date());
  const registros = leerRegistrosAnimo().filter((registro) => registro.fecha !== hoy);
  registros.push({ fecha: hoy, valor });
  registros.sort((a, b) => a.fecha.localeCompare(b.fecha));
  guardarRegistrosAnimo(registros);
}

/* Marca el emoji elegido hoy como seleccionado */
function marcarOpcionAnimo(valor) {
  opcionesAnimo.forEach((boton) => {
    boton.setAttribute('aria-checked', String(Number(boton.dataset.valor) === valor));
  });
}

/* Devuelve los últimos 7 días, de hace seis días a hoy, con su registro si existe */
function obtenerSemana(registros) {
  const dias = [];
  for (let desfase = 6; desfase >= 0; desfase -= 1) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - desfase);
    const iso = fechaISO(fecha);
    const registro = registros.find((item) => item.fecha === iso);
    dias.push({ iso, etiqueta: DIAS_CORTOS[fecha.getDay()], valor: registro ? registro.valor : null, esHoy: desfase === 0 });
  }
  return dias;
}

/* Dibuja las 7 columnas del resumen semanal */
function dibujarSemana(registros) {
  const dias = obtenerSemana(registros);
  graficaSemana.innerHTML = '';

  dias.forEach((dia) => {
    const columna = document.createElement('div');
    columna.className = 'flex flex-col items-center gap-2';

    const emoji = document.createElement('span');
    emoji.className = 'h-7 text-xl leading-7';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = dia.valor ? ['😔', '😕', '😐', '🙂', '😄'][dia.valor - 1] : '';

    const barra = document.createElement('div');
    barra.className = 'relative h-28 w-full overflow-hidden rounded-full bg-salvia-100 dark:bg-salvia-700/60';
    const relleno = document.createElement('div');
    relleno.className = 'absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-salvia-500 to-cielo-300 transition-all duration-700 ease-out';
    relleno.style.height = dia.valor ? `${(dia.valor / 5) * 100}%` : '0%';
    barra.appendChild(relleno);

    const etiqueta = document.createElement('span');
    etiqueta.className = `text-xs font-semibold ${dia.esHoy ? 'text-salvia-900 dark:text-arena-50' : 'text-salvia-600 dark:text-salvia-300'}`;
    etiqueta.textContent = dia.esHoy ? 'Hoy' : dia.etiqueta;

    const descripcion = dia.valor ? ETIQUETAS_ANIMO[dia.valor - 1] : 'Sin registro';
    columna.title = `${etiqueta.textContent}: ${descripcion}`;

    columna.append(emoji, barra, etiqueta);
    graficaSemana.appendChild(columna);
  });

  const registrados = dias.filter((dia) => dia.valor !== null);
  if (registrados.length === 0) {
    promedioSemana.textContent = 'Aún no hay registros esta semana.';
    return;
  }
  const suma = registrados.reduce((total, dia) => total + dia.valor, 0);
  const promedio = suma / registrados.length;
  const etiquetaPromedio = ETIQUETAS_ANIMO[Math.round(promedio) - 1];
  promedioSemana.textContent = `Promedio: ${promedio.toFixed(1)} de 5 (${etiquetaPromedio.toLowerCase()}) · ${registrados.length} de 7 días registrados`;
}

/* Refresca todo el bloque de ánimo a partir de lo guardado */
function renderizarAnimo() {
  const registros = leerRegistrosAnimo();
  const hoy = registros.find((registro) => registro.fecha === fechaISO(new Date()));
  marcarOpcionAnimo(hoy ? hoy.valor : 0);
  mensajeAnimo.textContent = hoy ? `Hoy registraste: ${ETIQUETAS_ANIMO[hoy.valor - 1]}. Puedes cambiarlo cuando quieras.` : '';
  dibujarSemana(registros);
}

opcionesAnimo.forEach((boton) => {
  boton.addEventListener('click', () => {
    const valor = Number(boton.dataset.valor);
    registrarAnimo(valor);
    mensajeAnimo.textContent = `Registrado: ${ETIQUETAS_ANIMO[valor - 1]}. Gracias por tomarte este momento.`;
    renderizarAnimo();
  });
});

botonBorrarHistorial.addEventListener('click', () => {
  if (!window.confirm('¿Seguro que quieres borrar todo tu historial de ánimo?')) return;
  localStorage.removeItem(CLAVE_ANIMO);
  mensajeAnimo.textContent = 'Historial borrado.';
  renderizarAnimo();
});

renderizarAnimo();

/* ===================== 5. Frases de mindfulness ===================== */

const FRASES = [
  'El momento presente es el único lugar donde la vida sucede.',
  'No necesitas resolverlo todo ahora. Basta con respirar y dar el siguiente paso.',
  'Tu mente puede ser un cielo lleno de nubes. Tú eres el cielo, no la tormenta.',
  'Observa un pensamiento como si fuera una hoja que pasa por el río, sin atraparla.',
  'Hoy no tienes que ser productivo para merecer un momento de calma.',
  'Escuchar tu cuerpo también es una forma de avanzar.',
  'Una respiración consciente puede cambiar el tono de toda una tarde.',
  'La quietud no es perder el tiempo; es recordar hacia dónde quieres ir.',
  'Lo que sientes es válido, aunque aún no sepas explicarlo.',
  'Pequeños gestos repetidos todos los días construyen grandes cambios.',
  'Mira alrededor y encuentra tres cosas que puedas ver, oír o tocar ahora mismo.',
  'Puedes descansar sin pedir permiso.',
];

const textoFrase = $('#texto-frase');
const botonOtraFrase = $('#boton-otra-frase');
let indiceFrase = Math.floor(Math.random() * FRASES.length);

/* Elige una frase distinta a la actual para evitar repetir de inmediato */
function siguienteIndiceFrase() {
  let nuevo = indiceFrase;
  while (nuevo === indiceFrase && FRASES.length > 1) {
    nuevo = Math.floor(Math.random() * FRASES.length);
  }
  return nuevo;
}

/* Desvanece el texto, cambia la frase y lo vuelve a mostrar */
function mostrarOtraFrase() {
  indiceFrase = siguienteIndiceFrase();
  textoFrase.style.opacity = '0';
  setTimeout(() => {
    textoFrase.textContent = `“${FRASES[indiceFrase]}”`;
    textoFrase.style.opacity = '1';
  }, 300);
}

textoFrase.textContent = `“${FRASES[indiceFrase]}”`;
botonOtraFrase.addEventListener('click', mostrarOtraFrase);

/* ===================== 6. Formulario de suscripción ===================== */

const formulario = $('#formulario-contacto');
const campoNombre = $('#campo-nombre');
const campoCorreo = $('#campo-correo');
const errorNombre = $('#error-nombre');
const errorCorreo = $('#error-correo');
const mensajeFormulario = $('#mensaje-formulario');

/* Formato básico de correo: texto, arroba, dominio con punto y sin espacios */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Muestra u oculta el error de un campo */
function marcarCampo(campo, error, esValido) {
  campo.classList.toggle('campo-invalido', !esValido);
  campo.setAttribute('aria-invalid', String(!esValido));
  error.classList.toggle('hidden', esValido);
}

function validarNombre() {
  const valido = campoNombre.value.trim().length > 0;
  marcarCampo(campoNombre, errorNombre, valido);
  return valido;
}

function validarCorreo() {
  const valido = PATRON_CORREO.test(campoCorreo.value.trim());
  marcarCampo(campoCorreo, errorCorreo, valido);
  return valido;
}

/* Quita el error mientras la persona corrige el campo */
campoNombre.addEventListener('input', () => {
  if (!errorNombre.classList.contains('hidden')) validarNombre();
});

campoCorreo.addEventListener('input', () => {
  if (!errorCorreo.classList.contains('hidden')) validarCorreo();
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nombreValido = validarNombre();
  const correoValido = validarCorreo();
  if (!nombreValido || !correoValido) {
    (nombreValido ? campoCorreo : campoNombre).focus();
    mensajeFormulario.classList.add('hidden');
    return;
  }

  const nombre = campoNombre.value.trim();
  mensajeFormulario.textContent = `¡Gracias, ${nombre}! Tu suscripción quedó registrada. Pronto recibirás tu primera pausa.`;
  mensajeFormulario.classList.remove('hidden');
  formulario.reset();
});
