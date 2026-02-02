const DEFAULT_TASKS = [
  { name: "Study for 45 minutes", category: "study", xp: 25, completed: false },
  { name: "Workout session", category: "workout", xp: 30, completed: false },
  { name: "Read 20 pages", category: "read", xp: 20, completed: false },
  { name: "Skill training", category: "train", xp: 25, completed: false },
];

const CATEGORY_STAT = {
  study: "mind",
  train: "discipline",
  workout: "strength",
  read: "clarity",
};

const STORAGE_KEY = "levelup-daily";

const state = {
  character: {
    name: "Nova",
    className: "Scholar",
    accent: "#6c5ce7",
  },
  stats: {
    mind: 0,
    strength: 0,
    discipline: 0,
    clarity: 0,
    streak: 0,
    xp: 0,
    level: 1,
  },
  tasks: [...DEFAULT_TASKS],
};

const elements = {
  characterForm: document.getElementById("characterForm"),
  characterName: document.getElementById("characterName"),
  characterClass: document.getElementById("characterClass"),
  accentColor: document.getElementById("accentColor"),
  characterAvatar: document.getElementById("characterAvatar"),
  characterDisplayName: document.getElementById("characterDisplayName"),
  characterDisplayClass: document.getElementById("characterDisplayClass"),
  taskForm: document.getElementById("taskForm"),
  taskName: document.getElementById("taskName"),
  taskCategory: document.getElementById("taskCategory"),
  taskXp: document.getElementById("taskXp"),
  taskList: document.getElementById("taskList"),
  statMind: document.getElementById("statMind"),
  statStrength: document.getElementById("statStrength"),
  statDiscipline: document.getElementById("statDiscipline"),
  statClarity: document.getElementById("statClarity"),
  statStreak: document.getElementById("statStreak"),
  levelValue: document.getElementById("levelValue"),
  xpValue: document.getElementById("xpValue"),
  resetButton: document.getElementById("resetButton"),
};

const loadState = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }
  const parsed = JSON.parse(stored);
  if (parsed) {
    Object.assign(state, parsed);
  }
};

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const updateCharacterCard = () => {
  const { name, className, accent } = state.character;
  elements.characterDisplayName.textContent = name;
  elements.characterDisplayClass.textContent = className;
  elements.characterAvatar.textContent = name.charAt(0).toUpperCase();
  elements.characterAvatar.style.background = accent;
  document.documentElement.style.setProperty("--accent", accent);
};

const updateStats = () => {
  elements.statMind.textContent = state.stats.mind;
  elements.statStrength.textContent = state.stats.strength;
  elements.statDiscipline.textContent = state.stats.discipline;
  elements.statClarity.textContent = state.stats.clarity;
  elements.statStreak.textContent = `${state.stats.streak} days`;
  elements.levelValue.textContent = state.stats.level;
  elements.xpValue.textContent = `${state.stats.xp} / ${state.stats.level * 100} XP`;
};

const renderTasks = () => {
  elements.taskList.innerHTML = "";
  state.tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.className = `task${task.completed ? " task--completed" : ""}`;

    const info = document.createElement("div");
    info.className = "task__info";
    info.innerHTML = `<strong>${task.name}</strong><span>${task.category.toUpperCase()} · ${task.xp} XP</span>`;

    const actions = document.createElement("div");
    actions.className = "task__actions";

    const button = document.createElement("button");
    button.className = "task__button";
    button.textContent = task.completed ? "Completed" : "Complete";
    button.disabled = task.completed;
    button.addEventListener("click", () => completeTask(index));

    actions.appendChild(button);
    listItem.appendChild(info);
    listItem.appendChild(actions);
    elements.taskList.appendChild(listItem);
  });
};

const levelUpIfNeeded = () => {
  const requiredXp = state.stats.level * 100;
  if (state.stats.xp >= requiredXp) {
    state.stats.level += 1;
    state.stats.xp -= requiredXp;
  }
};

const completeTask = (index) => {
  const task = state.tasks[index];
  if (!task || task.completed) {
    return;
  }
  task.completed = true;

  const statKey = CATEGORY_STAT[task.category];
  state.stats[statKey] += 1;
  state.stats.xp += task.xp;
  levelUpIfNeeded();
  if (state.tasks.every((item) => item.completed)) {
    state.stats.streak += 1;
  }

  saveState();
  updateStats();
  renderTasks();
};

const resetDailyTasks = () => {
  state.tasks = state.tasks.map((task) => ({ ...task, completed: false }));
  saveState();
  renderTasks();
};

const addTask = (event) => {
  event.preventDefault();
  const newTask = {
    name: elements.taskName.value.trim(),
    category: elements.taskCategory.value,
    xp: Number(elements.taskXp.value),
    completed: false,
  };

  if (!newTask.name) {
    return;
  }

  state.tasks.push(newTask);
  elements.taskName.value = "";
  elements.taskXp.value = "20";
  saveState();
  renderTasks();
};

const updateCharacter = (event) => {
  event.preventDefault();
  state.character.name = elements.characterName.value.trim() || "Nova";
  state.character.className = elements.characterClass.value;
  state.character.accent = elements.accentColor.value;
  saveState();
  updateCharacterCard();
};

const init = () => {
  loadState();
  elements.characterName.value = state.character.name;
  elements.characterClass.value = state.character.className;
  elements.accentColor.value = state.character.accent;
  updateCharacterCard();
  updateStats();
  renderTasks();
};

elements.characterForm.addEventListener("submit", updateCharacter);
elements.taskForm.addEventListener("submit", addTask);
elements.resetButton.addEventListener("click", resetDailyTasks);

init();
