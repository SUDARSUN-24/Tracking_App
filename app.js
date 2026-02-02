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
    skinTone: "#f2c5a0",
    hairColor: "#1f2937",
    hairStyle: "short",
    outfitColor: "#4338ca",
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
  skinTone: document.getElementById("skinTone"),
  hairColor: document.getElementById("hairColor"),
  hairStyle: document.getElementById("hairStyle"),
  outfitColor: document.getElementById("outfitColor"),
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
  avatarSkin: document.querySelectorAll(".avatar__skin, .avatar__arm"),
  avatarBody: document.querySelector(".avatar__body"),
  avatarShade: document.querySelector(".avatar__shade"),
  avatarHair: document.querySelectorAll(".avatar__hair"),
  avatarBun: document.querySelector(".avatar__bun"),
  heroSkin: document.querySelectorAll(".hero__skin, .hero__arm"),
  heroBody: document.querySelector(".hero__body"),
  heroGlow: document.querySelector(".hero__glow"),
  heroHair: document.querySelectorAll(".hero__hair"),
  heroBun: document.querySelector(".hero__bun"),
  heroMindValue: document.getElementById("heroMindValue"),
  heroStrengthValue: document.getElementById("heroStrengthValue"),
  heroDisciplineValue: document.getElementById("heroDisciplineValue"),
  heroClarityValue: document.getElementById("heroClarityValue"),
  heroMindBar: document.getElementById("heroMindBar"),
  heroStrengthBar: document.getElementById("heroStrengthBar"),
  heroDisciplineBar: document.getElementById("heroDisciplineBar"),
  heroClarityBar: document.getElementById("heroClarityBar"),
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

const updateAvatar = () => {
  const { skinTone, hairColor, hairStyle, outfitColor } = state.character;
  elements.avatarSkin.forEach((element) => {
    element.style.fill = skinTone;
  });
  elements.avatarHair.forEach((element) => {
    element.style.fill = hairColor;
    element.classList.toggle("is-active", element.classList.contains(`avatar__hair--${hairStyle}`));
  });
  if (elements.avatarBun) {
    elements.avatarBun.style.fill = hairColor;
    elements.avatarBun.classList.toggle("is-active", hairStyle === "bun");
  }
  if (elements.avatarBody) {
    elements.avatarBody.style.fill = outfitColor;
  }
  if (elements.avatarShade) {
    elements.avatarShade.style.fill = outfitColor;
  }
};

const updateHero = () => {
  const { skinTone, hairColor, hairStyle, outfitColor } = state.character;
  elements.heroSkin.forEach((element) => {
    element.style.fill = skinTone;
  });
  elements.heroHair.forEach((element) => {
    element.style.fill = hairColor;
    element.classList.toggle("is-active", element.classList.contains(`hero__hair--${hairStyle}`));
  });
  if (elements.heroBun) {
    elements.heroBun.style.fill = hairColor;
    elements.heroBun.classList.toggle("is-active", hairStyle === "bun");
  }
  if (elements.heroBody) {
    elements.heroBody.style.fill = outfitColor;
  }
  if (elements.heroGlow) {
    elements.heroGlow.style.fill = outfitColor;
  }

  const maxStat = 10;
  const mind = state.stats.mind;
  const strength = state.stats.strength;
  const discipline = state.stats.discipline;
  const clarity = state.stats.clarity;

  elements.heroMindValue.textContent = mind;
  elements.heroStrengthValue.textContent = strength;
  elements.heroDisciplineValue.textContent = discipline;
  elements.heroClarityValue.textContent = clarity;

  elements.heroMindBar.style.width = `${Math.min((mind / maxStat) * 100, 100)}%`;
  elements.heroStrengthBar.style.width = `${Math.min((strength / maxStat) * 100, 100)}%`;
  elements.heroDisciplineBar.style.width = `${Math.min((discipline / maxStat) * 100, 100)}%`;
  elements.heroClarityBar.style.width = `${Math.min((clarity / maxStat) * 100, 100)}%`;

  const glowIntensity = Math.min(state.stats.level / 10, 1);
  if (elements.heroGlow) {
    elements.heroGlow.style.opacity = 0.15 + glowIntensity * 0.45;
  }
  const orbOpacity = 0.25 + glowIntensity * 0.5;
  document.querySelectorAll(".hero__orb").forEach((orb) => {
    orb.style.opacity = orbOpacity.toString();
  });
};

const updateStats = () => {
  elements.statMind.textContent = state.stats.mind;
  elements.statStrength.textContent = state.stats.strength;
  elements.statDiscipline.textContent = state.stats.discipline;
  elements.statClarity.textContent = state.stats.clarity;
  elements.statStreak.textContent = `${state.stats.streak} days`;
  elements.levelValue.textContent = state.stats.level;
  elements.xpValue.textContent = `${state.stats.xp} / ${state.stats.level * 100} XP`;
  updateHero();
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
  state.character.skinTone = elements.skinTone.value;
  state.character.hairColor = elements.hairColor.value;
  state.character.hairStyle = elements.hairStyle.value;
  state.character.outfitColor = elements.outfitColor.value;
  saveState();
  updateCharacterCard();
  updateAvatar();
  updateHero();
};

const init = () => {
  loadState();
  elements.characterName.value = state.character.name;
  elements.characterClass.value = state.character.className;
  elements.accentColor.value = state.character.accent;
  elements.skinTone.value = state.character.skinTone;
  elements.hairColor.value = state.character.hairColor;
  elements.hairStyle.value = state.character.hairStyle;
  elements.outfitColor.value = state.character.outfitColor;
  updateCharacterCard();
  updateAvatar();
  updateHero();
  updateStats();
  renderTasks();
};

elements.characterForm.addEventListener("submit", updateCharacter);
elements.taskForm.addEventListener("submit", addTask);
elements.resetButton.addEventListener("click", resetDailyTasks);

init();
