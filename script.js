// Seleção de elementos
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");

// Função para formatar a data e hora no formato brasileiro (negócio horrível, estudar) - chatgpt que me deu a formatação
function formatDate(dateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

// Carregar tarefas do localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  taskList.innerHTML = ""; // Limpa a lista de tarefas pendentes
  completedList.innerHTML = ""; // Limpa a lista de tarefas concluidas

 
 // Exibe as tarefas pendentes
  tasks.forEach((task, index) => {
    const listItem = createTaskElement(task, index, false);
    taskList.appendChild(listItem);
  });


  // Exibe as tarefas concluidas
  completedTasks.forEach((task, index) => {
    const listItem = createTaskElement(task, index, true);
    completedList.appendChild(listItem);
  });
}

// Criar elementos para a tarefa
function createTaskElement(task, index, isCompleted) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `${task.text} <span class="task-date">(${formatDate(task.date)})</span>`;

  if (!isCompleted) {
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => editTask(index));
    listItem.appendChild(editButton);

    const doneButton = document.createElement("button");
    doneButton.textContent = "Feito";
    doneButton.addEventListener("click", () => markAsDone(index));
    listItem.appendChild(doneButton);
  }

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remover";
  removeButton.addEventListener("click", () => removeTask(index, isCompleted));
  listItem.appendChild(removeButton);

  return listItem;
}

// Adicionar tarefa
function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text === "" || date === "") {
    alert("Preencha todos os campos!");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, date });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  taskDate.value = "";
  loadTasks();
}

// Editar tarefa
function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];

  const newText = prompt("Edite a tarefa:", task.text);
  const newDate = prompt("Edite a data e hora (YYYY-MM-DDTHH:mm):", task.date);

  if (newText && newDate) {
    tasks[index] = { text: newText, date: newDate };
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

// Marcar como concluída
function markAsDone(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  // Pega a tarefa e remove de tasks
  const task = tasks.splice(index, 1)[0];

  // Adiciona a tarefa no histórico de tarefas concluídas
  completedTasks.push(task);

  // Atualiza o localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

  // Atualiza a lista na interface
  loadTasks();
}

// Remover tarefa
function removeTask(index, isCompleted) {
  const key = isCompleted ? "completedTasks" : "tasks";
  const tasks = JSON.parse(localStorage.getItem(key)) || [];

  tasks.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(tasks));
  loadTasks();
}

// Eventos
addTaskButton.addEventListener("click", addTask);
loadTasks();
