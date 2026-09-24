/* =========================================
   MI ESPACIO NEURODIVERGENTE
   Aplicación sin servidor
========================================= */


/* -----------------------------------------
   DATOS INICIALES
----------------------------------------- */

const defaultTools = [
  {
    id: 1,
    name: "Dividir una tarea",
    category: "procrastinacion",
    description:
      "Divide una tarea grande en pasos muy pequeños. El objetivo no es terminarla de golpe, sino saber cuál es el siguiente paso.",
    favorite: false
  },

  {
    id: 2,
    name: "Temporizador corto",
    category: "concentracion",
    description:
      "Pon un temporizador de pocos minutos y trabaja solamente durante ese tiempo. Cuando termine puedes decidir si continuar o parar.",
    favorite: false
  },

  {
    id: 3,
    name: "Lista de tres cosas",
    category: "organizacion",
    description:
      "En lugar de hacer una lista enorme, elige solamente tres cosas importantes para este momento.",
    favorite: false
  },

  {
    id: 4,
    name: "Reducir estímulos",
    category: "regulacion",
    description:
      "Si hay demasiados estímulos, intenta reducir luz, ruido, personas, olores u otros estímulos que estén aumentando la sobrecarga.",
    favorite: false
  },

  {
    id: 5,
    name: "Escribir en lugar de hablar",
    category: "comunicacion",
    description:
      "Si hablar resulta difícil, puedes escribir lo que necesitas decir en una nota, mensaje o tarjeta.",
    favorite: false
  },

  {
    id: 6,
    name: "Descanso sin culpa",
    category: "descanso",
    description:
      "Descansar también es una necesidad. No necesitas esperar a estar completamente agotado/a para hacer una pausa.",
    favorite: false
  },

  {
    id: 7,
    name: "Preparar el entorno",
    category: "vida diaria",
    description:
      "Deja preparados los objetos que vas a necesitar antes de comenzar una tarea.",
    favorite: false
  },

  {
    id: 8,
    name: "Body doubling",
    category: "estudio",
    description:
      "Haz una tarea mientras otra persona está presente físicamente o mediante una videollamada, sin necesidad de que te ayude directamente.",
    favorite: false
  }
];


const categories = [
  ["todos", "✨ Todas"],
  ["estudio", "📚 Estudio"],
  ["organizacion", "📋 Organización"],
  ["procrastinacion", "⏳ Procrastinación"],
  ["regulacion", "🧘 Regulación"],
  ["comunicacion", "💬 Comunicación"],
  ["relaciones", "👥 Relaciones"],
  ["descanso", "😴 Descanso"],
  ["vida diaria", "🏠 Vida diaria"],
  ["concentracion", "🎯 Concentración"],
  ["autocuidado", "🌱 Autocuidado"]
];


const needs = [
  "📚 Estudio",
  "📋 Organización",
  "⏳ Procrastinación",
  "🎯 Concentración",
  "🧘 Regulación",
  "💬 Comunicación",
  "👥 Relaciones",
  "😴 Descanso",
  "🏠 Vida diaria",
  "🌱 Autocuidado",
  "⚡ Energía",
  "🔊 Sensibilidad sensorial"
];


/* -----------------------------------------
   ESTADO
----------------------------------------- */

let tools =
  JSON.parse(localStorage.getItem("nd_tools")) ||
  defaultTools;

let tasks =
  JSON.parse(localStorage.getItem("nd_tasks")) ||
  [];

let settings =
  JSON.parse(localStorage.getItem("nd_settings")) ||
  {
    theme: "lavanda",
    dark: false,
    needs: []
  };

let selectedCategory = "todos";


/* -----------------------------------------
   GUARDAR
----------------------------------------- */

function saveTools() {
  localStorage.setItem(
    "nd_tools",
    JSON.stringify(tools)
  );
}


function saveTasks() {
  localStorage.setItem(
    "nd_tasks",
    JSON.stringify(tasks)
  );
}


function saveSettings() {
  localStorage.setItem(
    "nd_settings",
    JSON.stringify(settings)
  );
}


/* -----------------------------------------
   NAVEGACIÓN
----------------------------------------- */

const sections =
  document.querySelectorAll(".section");

const navButtons =
  document.querySelectorAll(".nav-button");


function showSection(sectionId) {

  sections.forEach(section => {
    section.classList.remove("active");
  });

  const selected =
    document.getElementById(sectionId);

  if (selected) {
    selected.classList.add("active");
  }

  navButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.section === sectionId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (sectionId === "herramientas") {
    renderTools();
  }

  if (sectionId === "favoritos") {
    renderFavorites();
  }

  if (sectionId === "tareas") {
    renderTasks();
  }
}


navButtons.forEach(button => {

  button.addEventListener("click", () => {
    showSection(button.dataset.section);
  });

});


document.querySelectorAll("[data-go]").forEach(button => {

  button.addEventListener("click", () => {
    showSection(button.dataset.go);
  });

});


/* -----------------------------------------
   CATEGORÍAS
----------------------------------------- */

const categoryButtons =
  document.getElementById("categoryButtons");


function renderCategories() {

  categoryButtons.innerHTML = "";

  categories.forEach(category => {

    const button =
      document.createElement("button");

    button.textContent = category[1];

    button.classList.toggle(
      "active",
      selectedCategory === category[0]
    );

    button.addEventListener("click", () => {

      selectedCategory = category[0];

      renderCategories();
      renderTools();

    });

    categoryButtons.appendChild(button);

  });
}


/* -----------------------------------------
   HERRAMIENTAS
----------------------------------------- */

function renderTools() {

  const container =
    document.getElementById("toolsContainer");

  const search =
    document
      .getElementById("searchTools")
      .value
      .toLowerCase()
      .trim();

  let filtered = [...tools];

  if (selectedCategory !== "todos") {

    filtered =
      filtered.filter(
        tool =>
          tool.category === selectedCategory
      );

  }

  if (search) {

    filtered =
      filtered.filter(tool =>
        tool.name
          .toLowerCase()
          .includes(search) ||
        tool.description
          .toLowerCase()
          .includes(search) ||
        tool.category
          .toLowerCase()
          .includes(search)
      );

  }

  if (filtered.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <div style="font-size:35px">🔎</div>
        <p>No hemos encontrado ninguna herramienta.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = "";

  filtered.forEach(tool => {

    container.appendChild(
      createToolCard(tool)
    );

  });
}


function createToolCard(tool) {

  const card =
    document.createElement("article");

  card.className = "tool-card";

  const categoryName =
    categories.find(
      category =>
        category[0] === tool.category
    );

  const categoryText =
    categoryName
      ? categoryName[1]
      : tool.category;

  card.innerHTML = `

    <div class="tool-top">

      <div>
        <h3>${escapeHTML(tool.name)}</h3>

        <span class="tool-category">
          ${escapeHTML(categoryText)}
        </span>
      </div>

      <button
        class="favorite-button"
        title="Favorito"
      >
        ${tool.favorite ? "⭐" : "☆"}
      </button>

    </div>

    <p>
      ${escapeHTML(tool.description)}
    </p>

    <div class="tool-actions">

      <button class="small-button delete-small">
        🗑️ Eliminar
      </button>

    </div>
  `;


  const favoriteButton =
    card.querySelector(".favorite-button");

  favoriteButton.addEventListener(
    "click",
    () => {

      tool.favorite = !tool.favorite;

      saveTools();

      renderTools();
      renderFavorites();

    }
  );


  card
    .querySelector(".delete-small")
    .addEventListener(
      "click",
      () => {

        const confirmation =
          confirm(
            "¿Quieres eliminar esta herramienta?"
          );

        if (!confirmation) return;

        tools =
          tools.filter(
            item => item.id !== tool.id
          );

        saveTools();

        renderTools();
        renderFavorites();

      }
    );


  return card;
}


/* -----------------------------------------
   FAVORITOS
----------------------------------------- */

function renderFavorites() {

  const container =
    document.getElementById(
      "favoritesContainer"
    );

  const favorites =
    tools.filter(tool => tool.favorite);

  if (favorites.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <div style="font-size:35px">⭐</div>
        <p>
          Todavía no tienes herramientas favoritas.
        </p>
        <p>
          Pulsa ☆ en una herramienta para guardarla aquí.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = "";

  favorites.forEach(tool => {

    container.appendChild(
      createToolCard(tool)
    );

  });
}


/* -----------------------------------------
   BUSCADOR
----------------------------------------- */

document
  .getElementById("searchTools")
  .addEventListener(
    "input",
    renderTools
  );


/* -----------------------------------------
   MODAL HERRAMIENTA
----------------------------------------- */

const toolModal =
  document.getElementById("toolModal");

document
  .getElementById("addToolButton")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("toolName")
        .value = "";

      document
        .getElementById("toolDescription")
        .value = "";

      toolModal.classList.remove("hidden");

    }
  );


document
  .getElementById("closeToolModal")
  .addEventListener(
    "click",
    () => {
      toolModal.classList.add("hidden");
    }
  );


document
  .getElementById("saveTool")
  .addEventListener(
    "click",
    () => {

      const name =
        document
          .getElementById("toolName")
          .value
          .trim();

      const category =
        document
          .getElementById("toolCategory")
          .value;

      const description =
        document
          .getElementById("toolDescription")
          .value
          .trim();

      if (!name) {

        alert(
          "Escribe un nombre para la herramienta."
        );

        return;
      }

      tools.push({

        id: Date.now(),

        name,

        category,

        description:
          description ||
          "Herramienta creada por mí.",

        favorite: false

      });

      saveTools();

      toolModal.classList.add("hidden");

      renderTools();

    }
  );


/* -----------------------------------------
   TAREAS
----------------------------------------- */

function renderTasks() {

  const container =
    document.getElementById(
      "tasksContainer"
    );

  if (tasks.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <div style="font-size:35px">🌱</div>
        <p>
          No tienes ningún quehacer añadido.
        </p>
      </div>
    `;

    updateTaskProgress();

    return;
  }

  container.innerHTML = "";

  tasks.forEach(task => {

    const card =
      document.createElement("div");

    card.className =
      "task-card" +
      (task.completed
        ? " completed"
        : "");

    let stepsHTML = "";

    task.steps.forEach(
      (step, index) => {

        stepsHTML += `
          <label class="step">

            <input
              type="checkbox"
              data-task="${task.id}"
              data-step="${index}"
              ${step.done ? "checked" : ""}
            >

            <span>
              ${escapeHTML(step.text)}
            </span>

          </label>
        `;

      }
    );


    card.innerHTML = `

      <div class="task-title">

        <input
          type="checkbox"
          class="task-complete"
          ${task.completed ? "checked" : ""}
        >

        <h3>
          ${escapeHTML(task.name)}
        </h3>

      </div>

      <span class="tool-category">
        ${escapeHTML(task.category)}
      </span>

      <div class="task-steps">
        ${stepsHTML}
      </div>

      <div class="task-footer">

        <button class="small-button delete-task">
          🗑️ Eliminar
        </button>

      </div>
    `;


    card
      .querySelector(".task-complete")
      .addEventListener(
        "change",
        event => {

          task.completed =
            event.target.checked;

          saveTasks();
          renderTasks();

        }
      );


    card
      .querySelectorAll(
        ".step input"
      )
      .forEach(input => {

        input.addEventListener(
          "change",
          event => {

            const stepIndex =
              Number(
                event.target.dataset.step
              );

            task.steps[
              stepIndex
            ].done =
              event.target.checked;

            const allDone =
              task.steps.length > 0 &&
              task.steps.every(
                step => step.done
              );

            task.completed =
              allDone;

            saveTasks();

            renderTasks();

          }
        );

      });


    card
      .querySelector(".delete-task")
      .addEventListener(
        "click",
        () => {

          if (
            !confirm(
              "¿Quieres eliminar este quehacer?"
            )
          ) return;

          tasks =
            tasks.filter(
              item =>
                item.id !== task.id
            );

          saveTasks();

          renderTasks();

        }
      );


    container.appendChild(card);

  });

  updateTaskProgress();
}


function updateTaskProgress() {

  const text =
    document.getElementById(
      "taskProgressText"
    );

  const bar =
    document.getElementById(
      "taskProgressBar"
    );

  if (tasks.length === 0) {

    text.textContent = "0%";
    bar.style.width = "0%";

    return;
  }

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const percentage =
    Math.round(
      (completed / tasks.length) * 100
    );

  text.textContent =
    percentage + "%";

  bar.style.width =
    percentage + "%";
}


/* -----------------------------------------
   MODAL TAREAS
----------------------------------------- */

const taskModal =
  document.getElementById("taskModal");


document
  .getElementById("addTaskButton")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("taskName")
        .value = "";

      document
        .getElementById("taskSteps")
        .value = "";

      taskModal.classList.remove(
        "hidden"
      );

    }
  );


document
  .getElementById("closeTaskModal")
  .addEventListener(
    "click",
    () => {

      taskModal.classList.add(
        "hidden"
      );

    }
  );


document
  .getElementById("saveTask")
  .addEventListener(
    "click",
    () => {

      const name =
        document
          .getElementById("taskName")
          .value
          .trim();

      const category =
        document
          .getElementById("taskCategory")
          .value;

      const stepsText =
        document
          .getElementById("taskSteps")
          .value
          .trim();


      if (!name) {

        alert(
          "Escribe un nombre para el quehacer."
        );

        return;
      }


      const lines =
        stepsText
          ? stepsText
              .split("\n")
              .map(
                text => text.trim()
              )
              .filter(Boolean)
          : [];


      const steps =
        lines.map(text => ({
          text,
          done: false
        }));


      tasks.push({

        id: Date.now(),

        name,

        category,

        steps,

        completed: false

      });


      saveTasks();

      taskModal.classList.add(
        "hidden"
      );

      renderTasks();

    }
  );


/* -----------------------------------------
   EMOCIONES
----------------------------------------- */

document
  .querySelectorAll(".emotion-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const emotion =
          button.dataset.emotion;

        const message =
          document.getElementById(
            "emotionMessage"
          );

        const messages = {

          "😊 Bien":
            "Qué bien 💚 Puedes seguir con tu día como te resulte cómodo.",

          "😐 Normal":
            "No pasa nada por sentirse simplemente normal. No tienes que estar siempre bien o mal.",

          "😣 Agobiado/a":
            "Quizá ahora mismo necesites reducir lo que tienes que hacer y centrarte solamente en lo más inmediato.",

          "😴 Cansado/a":
            "Tu cansancio merece ser tenido en cuenta. Si puedes, reduce exigencias y busca un poco de descanso.",

          "😢 Triste":
            "No necesitas solucionar todo ahora mismo. Puedes permitirte estar triste y buscar apoyo si lo necesitas.",

          "😡 Enfadado/a":
            "Antes de actuar quizá puedas darte un poco de espacio para bajar la intensidad.",

          "😰 Nervioso/a":
            "Si puedes, busca un lugar y unas condiciones que te resulten más seguras y predecibles.",

          "🫥 Saturado/a":
            "Puede ser buena idea reducir estímulos y decisiones durante un rato."
        };


        message.textContent =
          messages[emotion] ||
          "Puedes parar un momento y comprobar qué necesitas.";

        message.classList.remove(
          "hidden"
        );

      }
    );

  });


/* -----------------------------------------
   NOTAS DE EMOCIONES
----------------------------------------- */

const emotionNotes =
  document.getElementById(
    "emotionNotes"
  );

emotionNotes.value =
  localStorage.getItem(
    "nd_emotion_notes"
  ) || "";


document
  .getElementById("saveEmotionNotes")
  .addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "nd_emotion_notes",
        emotionNotes.value
      );

      alert(
        "Guardado 💚"
      );

    }
  );


/* -----------------------------------------
   TEMAS
----------------------------------------- */

function applySettings() {

  document.body.dataset.theme =
    settings.theme;

  document.body.classList.toggle(
    "dark",
    settings.dark
  );

  document.getElementById(
    "themeButton"
  ).textContent =
    settings.dark
      ? "☀️"
      : "🌙";

}


document
  .getElementById("themeButton")
  .addEventListener(
    "click",
    () => {

      settings.dark =
        !settings.dark;

      saveSettings();
      applySettings();

    }
  );


document
  .querySelectorAll(".theme-option")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        settings.theme =
          button.dataset.theme;

        saveSettings();
        applySettings();

      }
    );

  });


/* -----------------------------------------
   NECESIDADES
----------------------------------------- */

function renderNeeds() {

  const container =
    document.getElementById(
      "needsContainer"
    );

  container.innerHTML = "";

  needs.forEach(need => {

    const label =
      document.createElement("label");

    label.className =
      "need-check";

    const checked =
      settings.needs.includes(need);

    label.innerHTML = `

      <input
        type="checkbox"
        value="${escapeHTML(need)}"
        ${checked ? "checked" : ""}
      >

      <span>
        ${escapeHTML(need)}
      </span>

    `;

    container.appendChild(label);

  });
}


document
  .getElementById("saveNeeds")
  .addEventListener(
    "click",
    () => {

      const checked =
        document.querySelectorAll(
          "#needsContainer input:checked"
        );

      settings.needs =
        Array.from(
          checked
        ).map(
          input => input.value
        );

      saveSettings();

      alert(
        "Tus necesidades se han guardado 💚"
      );

    }
  );


/* -----------------------------------------
   BORRAR DATOS
----------------------------------------- */

document
  .getElementById("deleteData")
  .addEventListener(
    "click",
    () => {

      const confirmation =
        confirm(
          "Esto eliminará tus herramientas, tareas, favoritos, necesidades y notas guardadas. ¿Quieres continuar?"
        );

      if (!confirmation) return;

      localStorage.removeItem(
        "nd_tools"
      );

      localStorage.removeItem(
        "nd_tasks"
      );

      localStorage.removeItem(
        "nd_settings"
      );

      localStorage.removeItem(
        "nd_emotion_notes"
      );

      location.reload();

    }
  );


/* -----------------------------------------
   BOTONES DE NECESIDAD EN INICIO
----------------------------------------- */

document
  .querySelectorAll(
    ".need-buttons button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const category =
          button.dataset.category;

        selectedCategory =
          category;

        renderCategories();
        renderTools();

        showSection(
          "herramientas"
        );

      }
    );

  });


/* -----------------------------------------
   CERRAR MODALES TOCANDO FUERA
----------------------------------------- */

window.addEventListener(
  "click",
  event => {

    if (
      event.target === toolModal
    ) {

      toolModal.classList.add(
        "hidden"
      );

    }

    if (
      event.target === taskModal
    ) {

      taskModal.classList.add(
        "hidden"
      );

    }

  }
);


/* -----------------------------------------
   SEGURIDAD BÁSICA PARA TEXTO DEL USUARIO
----------------------------------------- */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* -----------------------------------------
   INICIAR APP
----------------------------------------- */

applySettings();

renderCategories();

renderTools();

renderFavorites();

renderTasks();

renderNeeds();
