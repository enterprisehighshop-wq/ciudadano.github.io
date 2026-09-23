/* ==========================================================
   MI CIUDADANO EJEMPLAR — script.js
   Toda la interacción del sitio: categorías, juego de
   situaciones, asistente por palabras clave y detalles
   lúdicos (nivel ciudadano, frases, retos, insignia).
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     ESTADO GLOBAL Y NIVEL CIUDADANO
     ---------------------------------------------------------- */
  const state = {
    level: 0 // 0-100, solo lúdico
  };

  const levelBarFill = document.getElementById('levelBarFill');
  const levelPercent = document.getElementById('levelPercent');
  const citizenBadge = document.getElementById('citizenBadge');

  function addLevel(points) {
    state.level = Math.min(100, state.level + points);
    levelBarFill.style.width = state.level + '%';
    levelPercent.textContent = state.level + '%';
    if (state.level >= 60) {
      citizenBadge.hidden = false;
    }
  }

  /* ----------------------------------------------------------
     FRASES ALEATORIAS DEL CIUDADANO
     ---------------------------------------------------------- */
  const frases = [
    '¡Hola! Soy tu Ciudadano Ejemplar. No tengo todas las respuestas, pero sí puedo ayudarte a pensar cómo actuar de manera respetuosa, responsable y solidaria.',
    'Un pequeño gesto de respeto puede cambiar el ambiente de todo un salón.',
    'Cuidar lo público es cuidar algo que también es tuyo.',
    'Escuchar a quien piensa diferente también es un acto de ciudadanía.',
    'No se trata de ser perfecto, sino de intentar actuar bien cada día.',
    'Informarte antes de opinar es un acto de responsabilidad ciudadana.',
    'La solidaridad empieza en los gestos pequeños y cotidianos.'
  ];

  const randomPhraseEl = document.getElementById('randomPhrase');
  document.getElementById('newPhraseBtn').addEventListener('click', () => {
    const nueva = frases[Math.floor(Math.random() * frases.length)];
    randomPhraseEl.textContent = nueva;
    addLevel(2);
  });

  /* ----------------------------------------------------------
     NAVEGACIÓN SUAVE (fallback explícito, además de scroll-behavior CSS)
     ---------------------------------------------------------- */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     CATEGORÍAS / PRINCIPIOS
     ---------------------------------------------------------- */
  const categorias = [
    {
      id: 'convivencia',
      icon: '🤝',
      nombre: 'Convivencia',
      texto: 'Convivir bien significa compartir espacios con otras personas cuidando el respeto y el diálogo, incluso cuando hay diferencias.',
      ejemplos: [
        'Escuchar antes de responder en una discusión.',
        'Pedir la palabra en vez de interrumpir.',
        'Buscar acuerdos que beneficien a todos.'
      ]
    },
    {
      id: 'derechos',
      icon: '⚖️',
      nombre: 'Derechos y deberes',
      texto: 'Todo ciudadano tiene derechos que deben respetarse y deberes que debe cumplir para que la vida en comunidad funcione.',
      ejemplos: [
        'Conocer tus derechos básicos como estudiante y persona.',
        'Cumplir las normas de tu colegio o comunidad.',
        'Respetar los derechos de los demás igual que los tuyos.'
      ]
    },
    {
      id: 'ambiente',
      icon: '🌱',
      nombre: 'Medio ambiente',
      texto: 'Cuidar el entorno natural es una responsabilidad de todos, no solo de las autoridades.',
      ejemplos: [
        'Botar la basura en su lugar y separar reciclaje.',
        'Ahorrar agua y energía cuando sea posible.',
        'Cuidar zonas verdes y no dañar plantas o animales.'
      ]
    },
    {
      id: 'espacio',
      icon: '🏙️',
      nombre: 'Espacio público',
      texto: 'Los parques, calles y bienes comunes pertenecen a todos: cuidarlos es responsabilidad de cada persona.',
      ejemplos: [
        'No dañar bancas, señales ni infraestructura pública.',
        'Mantener limpios los espacios compartidos.',
        'Avisar a un adulto responsable si ves un daño grave.'
      ]
    },
    {
      id: 'participacion',
      icon: '🗳️',
      nombre: 'Participación ciudadana',
      texto: 'Participar es informarse, opinar con respeto y sumarse a decisiones que afectan a la comunidad.',
      ejemplos: [
        'Informarte con fuentes confiables antes de opinar.',
        'Participar en actividades del colegio o del barrio.',
        'Respetar opiniones distintas a la tuya.'
      ]
    },
    {
      id: 'solidaridad',
      icon: '❤️',
      nombre: 'Solidaridad',
      texto: 'Ser solidario es ayudar a otras personas cuando lo necesitan, siempre que puedas hacerlo de forma segura.',
      ejemplos: [
        'Ayudar a un compañero que no entiende una tarea.',
        'Apoyar a alguien que se siente excluido.',
        'Colaborar en actividades comunitarias.'
      ]
    },
    {
      id: 'colegio',
      icon: '📚',
      nombre: 'Colegio y comunidad',
      texto: 'El colegio es una pequeña comunidad donde también se practica la ciudadanía todos los días.',
      ejemplos: [
        'Cuidar los materiales y espacios compartidos.',
        'Tratar con respeto a compañeros y profesores.',
        'Colaborar en trabajos de equipo de forma justa.'
      ]
    },
    {
      id: 'diversidad',
      icon: '🧠',
      nombre: 'Respeto y diversidad',
      texto: 'Todas las personas merecen respeto sin importar sus diferencias de origen, pensamiento o forma de ser.',
      ejemplos: [
        'Rechazar burlas o comentarios discriminatorios.',
        'Valorar formas de pensar distintas a la tuya.',
        'Tratar a todos con la misma dignidad.'
      ]
    }
  ];

  const categoryGrid = document.getElementById('categoryGrid');
  const categoryResponse = document.getElementById('categoryResponse');
  const categoryTitle = document.getElementById('categoryTitle');
  const categoryText = document.getElementById('categoryText');
  const categoryExamples = document.getElementById('categoryExamples');

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-card';
    btn.type = 'button';
    btn.dataset.id = cat.id;
    btn.innerHTML = `<span class="icon">${cat.icon}</span>${cat.nombre}`;
    btn.addEventListener('click', () => mostrarCategoria(cat, btn));
    categoryGrid.appendChild(btn);
  });

  function mostrarCategoria(cat, btnEl) {
    document.querySelectorAll('.category-card').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');

    categoryTitle.textContent = `${cat.icon} ${cat.nombre}`;
    categoryText.textContent = cat.texto;
    categoryExamples.innerHTML = '';
    cat.ejemplos.forEach(ej => {
      const li = document.createElement('li');
      li.textContent = ej;
      categoryExamples.appendChild(li);
    });

    categoryResponse.hidden = false;
    addLevel(3);
  }

  /* ----------------------------------------------------------
     JUEGO "¿QUÉ HARÍAS TÚ?"
     ---------------------------------------------------------- */
  const situaciones = [
    {
      situacion: 'Encuentras basura tirada en un parque.',
      opciones: [
        { texto: 'Ignorarla porque no es tu problema.', correcta: false,
          feedback: 'Ignorar el problema no ayuda a mejorar el espacio de todos.' },
        { texto: 'Si es seguro hacerlo, recogerla y depositarla correctamente, y promover el cuidado del espacio.', correcta: true,
          feedback: '¡Muy bien! Cuidar el espacio público es responsabilidad de todos.' },
        { texto: 'Tirarla en otro lugar.', correcta: false,
          feedback: 'Eso solo traslada el problema, no lo soluciona.' }
      ]
    },
    {
      situacion: 'Un compañero se burla de otro por su forma de hablar.',
      opciones: [
        { texto: 'Reírte también para no quedar mal con el grupo.', correcta: false,
          feedback: 'Sumarte a la burla refuerza la discriminación, aunque no la empieces tú.' },
        { texto: 'Decir con respeto que esa burla no está bien y apoyar al compañero afectado.', correcta: true,
          feedback: '¡Exacto! Rechazar la discriminación con respeto ayuda a construir un ambiente más sano.' },
        { texto: 'No hacer nada porque no es tu problema.', correcta: false,
          feedback: 'Quedarse callado no ayuda a quien está siendo afectado.' }
      ]
    },
    {
      situacion: 'Encuentras una billetera olvidada en el colegio.',
      opciones: [
        { texto: 'Quedarte con el dinero porque nadie te vio.', correcta: false,
          feedback: 'Quedarte con algo que no es tuyo no es un acto honesto.' },
        { texto: 'Entregarla a un profesor o a la coordinación del colegio.', correcta: true,
          feedback: '¡Correcto! Entregarla a una persona responsable es lo más honesto y seguro.' },
        { texto: 'Dejarla botada donde la encontraste.', correcta: false,
          feedback: 'Así es más difícil que la billetera regrese a su dueño.' }
      ]
    },
    {
      situacion: 'Estás en desacuerdo con la opinión política de un compañero.',
      opciones: [
        { texto: 'Burlarte de su opinión frente a los demás.', correcta: false,
          feedback: 'Burlarte cierra el diálogo y no aporta a la convivencia.' },
        { texto: 'Escuchar su punto de vista y expresar el tuyo con respeto.', correcta: true,
          feedback: '¡Bien! Escuchar y dialogar con respeto es parte de una buena participación ciudadana.' },
        { texto: 'Dejar de hablarle porque piensa diferente.', correcta: false,
          feedback: 'Alejarte por pensar distinto no ayuda a entender otras posturas.' }
      ]
    },
    {
      situacion: 'Ves que alguien está rayando una pared o dañando una señal de tránsito.',
      opciones: [
        { texto: 'Grabarlo para redes sociales y no decir nada más.', correcta: false,
          feedback: 'Grabarlo no soluciona el daño ni previene que vuelva a pasar.' },
        { texto: 'Si es seguro, pedirle que no lo haga y avisar a un adulto responsable.', correcta: true,
          feedback: '¡Correcto! Actuar con calma y buscar apoyo de un adulto es lo más responsable.' },
        { texto: 'Hacer lo mismo porque total, ya está dañado.', correcta: false,
          feedback: 'Sumar más daño empeora el problema para toda la comunidad.' }
      ]
    }
  ];

  let situacionActual = 0;
  let correctas = 0;
  let situacionRespondida = false;

  const situationIndexEl = document.getElementById('situationIndex');
  const situationTotalEl = document.getElementById('situationTotal');
  const correctCountEl = document.getElementById('correctCount');
  const gameSituationEl = document.getElementById('gameSituation');
  const gameOptionsEl = document.getElementById('gameOptions');
  const gameFeedbackEl = document.getElementById('gameFeedback');
  const nextSituationBtn = document.getElementById('nextSituationBtn');
  const resetGameBtn = document.getElementById('resetGameBtn');

  situationTotalEl.textContent = situaciones.length;

  function renderSituacion() {
    const s = situaciones[situacionActual];
    situacionRespondida = false;

    situationIndexEl.textContent = situacionActual + 1;
    gameSituationEl.textContent = s.situacion;
    gameFeedbackEl.textContent = '';
    gameFeedbackEl.className = 'game-feedback';
    nextSituationBtn.hidden = true;

    gameOptionsEl.innerHTML = '';
    s.opciones.forEach((op, index) => {
      const btn = document.createElement('button');
      btn.className = 'game-option';
      btn.type = 'button';
      btn.textContent = `${String.fromCharCode(65 + index)}. ${op.texto}`;
      btn.addEventListener('click', () => responderOpcion(op, btn));
      gameOptionsEl.appendChild(btn);
    });
  }

  function responderOpcion(opcion, btnEl) {
    if (situacionRespondida) return;
    situacionRespondida = true;

    const botones = gameOptionsEl.querySelectorAll('.game-option');
    botones.forEach(b => (b.disabled = true));

    btnEl.classList.add(opcion.correcta ? 'correct' : 'incorrect');

    gameFeedbackEl.textContent = opcion.feedback;
    gameFeedbackEl.classList.add(opcion.correcta ? 'correct' : 'incorrect');

    if (opcion.correcta) {
      correctas++;
      correctCountEl.textContent = correctas;
      addLevel(8);
    } else {
      addLevel(2);
    }

    if (situacionActual < situaciones.length - 1) {
      nextSituationBtn.hidden = false;
    }
  }

  nextSituationBtn.addEventListener('click', () => {
    situacionActual++;
    renderSituacion();
  });

  resetGameBtn.addEventListener('click', () => {
    situacionActual = 0;
    correctas = 0;
    correctCountEl.textContent = 0;
    renderSituacion();
  });

  renderSituacion();

  /* ----------------------------------------------------------
     BOTÓN "DAME UN RETO CIUDADANO"
     ---------------------------------------------------------- */
  const retos = [
    'Hoy, saluda y da las gracias a alguien que normalmente no lo esperarías.',
    'Recoge un papel del suelo aunque no sea tuyo, si es seguro hacerlo.',
    'Escucha por completo la opinión de alguien con quien no estás de acuerdo.',
    'Ayuda a un compañero con una duda antes de que te la pida.',
    'Investiga un derecho o un deber ciudadano que no conocías.',
    'Evita una discusión innecesaria usando el diálogo en vez de gritar.'
  ];

  const challengeText = document.getElementById('challengeText');
  document.getElementById('challengeBtn').addEventListener('click', () => {
    const reto = retos[Math.floor(Math.random() * retos.length)];
    challengeText.textContent = `🎯 Reto: ${reto}`;
    addLevel(3);
  });

  /* ----------------------------------------------------------
     ASISTENTE POR PALABRAS CLAVE: responderSituacion(texto)
     ---------------------------------------------------------- */
  const reglasRespuesta = [
    {
      palabras: ['discrimina', 'bullying', 'acoso', 'burla', 'burlan'],
      respuesta: 'Rechazar la discriminación es fundamental. Puedes apoyar a la persona afectada, no sumarte a la burla y buscar ayuda de un profesor o adulto responsable si la situación continúa.'
    },
    {
      palabras: ['basura', 'parque', 'reciclaje', 'contamina', 'ambiente'],
      respuesta: 'Cuidar el medio ambiente y el espacio público es tarea de todos. Si es seguro, recoge la basura o repórtala, y evita generar más daño al entorno.'
    },
    {
      palabras: ['pelea', 'discusion', 'discusión', 'conflicto', 'pelear'],
      respuesta: 'Ante un conflicto, mantén la calma, escucha a la otra persona y busca resolverlo mediante el diálogo. Si hay riesgo de violencia, busca ayuda de un adulto responsable.'
    },
    {
      palabras: ['billetera', 'perdido', 'perdida', 'objeto'],
      respuesta: 'Lo más responsable es entregar el objeto a una autoridad o persona encargada (un profesor, la coordinación, un punto de información) para que pueda regresar a su dueño.'
    },
    {
      palabras: ['voto', 'eleccion', 'elección', 'elecciones', 'participa', 'politica', 'política'],
      respuesta: 'La participación ciudadana empieza por informarte con fuentes confiables, conocer diferentes posturas y participar con respeto, sin descalificar a quien piensa distinto.'
    },
    {
      palabras: ['norma', 'ley', 'reglamento', 'regla'],
      respuesta: 'Las normas existen para que la convivencia funcione mejor. Si tienes dudas sobre una norma, lo mejor es informarte bien antes de actuar o de opinar sobre ella.'
    },
    {
      palabras: ['respeto', 'respetar', 'irrespeto', 'irrespeta'],
      respuesta: 'El respeto es la base de la convivencia: trata a los demás como te gustaría que te trataran, incluso cuando no estés de acuerdo con ellos.'
    },
    {
      palabras: ['señal', 'transito', 'tránsito', 'daño', 'dañar', 'vandal'],
      respuesta: 'Los bienes públicos son de todos. Si ves que alguien va a dañarlos, puedes decirle con respeto que no lo haga y, si es necesario, avisar a un adulto responsable.'
    }
  ];

  const respuestaGeneral = 'Primero mantén la calma, respeta a las personas involucradas, evita actuar de manera peligrosa y busca una solución pacífica. Si se trata de una situación que requiere autoridad o atención profesional, busca ayuda de la institución o autoridad correspondiente.';

  function responderSituacion(texto) {
    const textoLimpio = texto.toLowerCase();

    for (const regla of reglasRespuesta) {
      const coincide = regla.palabras.some(palabra => textoLimpio.includes(palabra));
      if (coincide) {
        return regla.respuesta;
      }
    }

    return respuestaGeneral;
  }

  const askForm = document.getElementById('askForm');
  const askInput = document.getElementById('askInput');
  const askResponseWrapper = document.getElementById('askResponseWrapper');
  const askResponse = document.getElementById('askResponse');

  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = askInput.value.trim();
    if (!texto) {
      askResponse.textContent = 'Escribe una situación para poder orientarte. 🙂';
      askResponseWrapper.hidden = false;
      return;
    }

    const respuesta = responderSituacion(texto);
    askResponse.textContent = respuesta;
    askResponseWrapper.hidden = false;
    askResponseWrapper.classList.remove('fade-in');
    void askResponseWrapper.offsetWidth;
    askResponseWrapper.classList.add('fade-in');

    addLevel(5);
  });

});
