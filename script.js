let tasks = [];

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterSelect = document.getElementById("filterSelect");

const STORAGE_KEY = "todo_tasks";

function saveTasksToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

function addTask(text, dueDate, priority) {
  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    dueDate: dueDate || "",
    priority: priority || "Medium"
  };
  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasksToLocalStorage();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  const newText = prompt("Edit task:", task.text);
  if (newText === null) return;
  const trimmed = newText.trim();
  if (!trimmed) return;
  task.text = trimmed;

  const newDue = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
  if (newDue !== null) task.dueDate = newDue;

  const newPriority = prompt("Edit priority (High/Medium/Low):", task.priority);
  if (newPriority !== null) task.priority = newPriority;

  saveTasksToLocalStorage();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(t => !t.completed);
  saveTasksToLocalStorage();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value;

  let filteredTasks = tasks;

  if (filter === "completed") filteredTasks = tasks.filter(t => t.completed);
  else if (filter === "pending") filteredTasks = tasks.filter(t => !t.completed);
  else if (filter === "high") filteredTasks = tasks.filter(t => t.priority === "High");
  else if (filter === "medium") filteredTasks = tasks.filter(t => t.priority === "Medium");
  else if (filter === "low") filteredTasks = tasks.filter(t => t.priority === "Low");

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="task-item"><span class="task-text">No tasks found.</span></li>`;
    taskCount.textContent = "0 tasks";
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    if (task.completed) textSpan.classList.add("completed");

    const infoSpan = document.createElement("span");
    infoSpan.className = "task-info";
    infoSpan.textContent = task.dueDate ? ` | Due: ${task.dueDate}` : "";
    infoSpan.style.marginLeft = "6px";

    const prioritySpan = document.createElement("span");
    prioritySpan.className = "task-priority";
    prioritySpan.textContent = ` [${task.priority}]`;
    prioritySpan.style.marginLeft = "4px";
    prioritySpan.style.color =
      task.priority === "High" ? "#f87171" :
      task.priority === "Medium" ? "#fbbf24" : "#34d399";

    left.appendChild(checkbox);
    left.appendChild(textSpan);
    left.appendChild(infoSpan);
    left.appendChild(prioritySpan);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn edit";
    editBtn.textContent = "✏️";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete";
    deleteBtn.textContent = "🗑";

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  taskCount.textContent = filteredTasks.length === 1 ? "1 task" : `${filteredTasks.length} tasks`;
}

// Event Listeners
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const dueDate = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;

  addTask(text, dueDate, priority);

  taskInput.value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("priorityInput").value = "Medium";
});

taskList.addEventListener("click", function(e) {
  const target = e.target;
  const li = target.closest(".task-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (target.classList.contains("task-checkbox") || target.classList.contains("task-text")) {
    toggleTaskCompleted(id);
  } else if (target.classList.contains("edit")) {
    editTask(id);
  } else if (target.classList.contains("delete")) {
    deleteTask(id);
  }
});

filterSelect.addEventListener("change", renderTasks);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Initialize
loadTasksFromLocalStorage();
renderTasks();
