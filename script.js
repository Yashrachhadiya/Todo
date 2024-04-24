const errorMassge = document.getElementById("errorMessage");
const todoList = document.getElementById("todoList");
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  todoList.innerHTML = "";
  errorMassge.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.innerHTML = `<div class="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-md md:shadow-2xl">
        <div class="flex flex-col md:flex-row items-center w-full">
            <div class="md:mr-auto mb-2 md:mb-0 md:pr-4">
                <div class="my-2">
                    <span class="font-bold">Task -</span> ${task.priority}
                </div>
                <div>
                    <span class="font-bold">Description -</span> ${task.task}
                </div>
            </div>
            <div class="flex justify-center md:justify-end">
                <button class="text-blue-500 mr-2 bg-green-200 rounded p-3" onclick="editTask(${index})">Edit</button>
                <button class="text-red-500 bg-red-200 rounded p-3" onclick="deleteTask(${index})">Delete</button>
            </div>
        </div>
    </div>`;
    todoList.appendChild(taskElement);
  });
}

function addTask(taskText, priority) {
  const existingIndex = tasks.findIndex((t) => t.priority === priority);
  if (existingIndex !== -1) {
    tasks = tasks.map((t) => {
      if (t.priority >= priority) {
        t.priority++;
      }
      return t;
    });
  }
  tasks.push({ task: taskText, priority });
  tasks.sort((a, b) => a.priority - b.priority);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  const newTask = prompt("Edit task:", tasks[index].task);
  if (newTask !== null) {
    const newPriority = parseInt(prompt("Enter new priority for the task:", tasks[index].priority));
    if (!isNaN(newPriority) && newPriority >= 1) {
      const oldPriority = tasks[index].priority;
      tasks[index].task = newTask;
      if (newPriority !== oldPriority) {
        const existingIndex = tasks.findIndex(task => task.priority === newPriority);
        if (existingIndex !== -1) {
          tasks.forEach((task) => {
            if (task.priority >= newPriority && task !== tasks[index]) {
              task.priority++;
            }
          });
        }
        tasks[index].priority = newPriority;
        tasks.sort((a, b) => a.priority - b.priority);
        tasks.forEach((task, i) => {
          task.priority = i + 1;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
    } else {
      alert("Please enter a valid priority (a positive integer).");
    }
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  tasks.forEach((task, i) => {
    task.priority = i + 1;
  });
  confirm("Are you sure you want to delete this task?");
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const taskInput = document.getElementById("taskInput");
  const taskPriority = document.getElementById("taskPriority").value.trim();
  const taskText = taskInput.value.trim();
  const priority = parseInt(taskPriority);

  if (taskText !== "" && !isNaN(priority) && priority >= 1) {
    addTask(taskText, priority);
    taskInput.value = "";
    document.getElementById("taskPriority").value = "";
  } else {
    errorMassge.innerHTML =
      "Please make sure you entered proper details and priority of your tasks.";
  }
});

renderTasks();
