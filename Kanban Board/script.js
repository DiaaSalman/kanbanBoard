// Get DOM Elements
const notStarted = document.getElementById("not-started");
const inProgress = document.getElementById("in-progress");
const completed = document.getElementById("completed");
const btns = document.querySelectorAll(".add-btn");

let drag = null;

// Tasks List
let tasks = JSON.parse(localStorage.getItem("tasks")) || {
  "not-started": [],
  "in-progress": [],
  completed: [],
};

displayTasks();

// Add Event Listners to Clicked Button
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // get id of column related to clicked button
    elementId = e.target.previousElementSibling.id;
    addTask(elementId);
  });
});

// Create a new Task Element
function createTask(taskEl, columnId) {
  // Create a new task
  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("id", taskEl);
  // The Structure of the new task
  task.innerHTML = `
        <input type="text" value="${taskEl}" draggable="true" id="${columnId}" disabled>
        <div class="task-btns">
        <button class = "task-btn edit" onclick="enableEdit('${taskEl}')"><ion-icon name="create-outline"></ion-icon></button>
        <button class = "task-btn delete" onclick="deleteTask('${taskEl}')"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
    `;
  // append the new task in its column
  document.getElementById(columnId).appendChild(task);
}

// Render the Task Element into the page
function addTask(columnId) {
  // Get The Value of clicked Input
  let taskEl = document.getElementById(`${columnId}-task`).value;
  // console.log(taskEl);
  // Check If The Input is Empty
  if (taskEl.trim() === "") {
    alert("Please Add a task");
  } else {
    // save items in local storage
    // push the value of input in the tasks list "array"
    tasks[columnId].push(taskEl);
    // create task function
    createTask(taskEl, columnId);
    // Empty The input after adding a task
    document.getElementById(`${columnId}-task`).value = "";
    // drag & drop Function
    dragItem(taskEl);

    console.log("Add : ", taskEl);
    saveAtLocalStorage();
  }
}

// Delete a task
function deleteTask(taskEl) {
  const task = document.getElementById(taskEl);
  tasks["not-started"] = tasks["not-started"].filter((task) => task !== taskEl);
  tasks["in-progress"] = tasks["in-progress"].filter((task) => task !== taskEl);
  tasks["completed"] = tasks["completed"].filter((task) => task !== taskEl);

  console.log(tasks);
  saveAtLocalStorage();

  // Remove the task from the Page
  task.parentNode.removeChild(task);
}

// Edit a task
function enableEdit(taskEl) {
  const task = document.getElementById(taskEl);
  task.querySelector("input[type='text']").removeAttribute("disabled");
  task.querySelector(".edit").textContent = "Save";
  task.querySelector(".edit").setAttribute("onclick", `saveEdit('${taskEl}')`);
}

// Save Edited Task
function saveEdit(taskEl) {
  const task = document.getElementById(taskEl);
  if (task.querySelector(".edit").textContent === "Save") {
    task.querySelector(
      ".edit"
    ).innerHTML = `<ion-icon name="create-outline"></ion-icon>`;
    task.querySelector("input[type='text']").setAttribute("disabled", "");
  } else {
    task.querySelector(".edit").textContent = "Save";
    task.querySelector("input[type='text']").removeAttribute("disabled");
  }
  console.log(tasks);
  saveAtLocalStorage();
}

// drag and drop functionality
function dragItem(taskEl) {
  const task = document.getElementById(taskEl);
  const cols = document.querySelectorAll(".columns .col");

  task.addEventListener("dragstart", function () {
    drag = task;
    task.style.opacity = "0.5";
  });

  task.addEventListener("dragend", function () {
    drag = null;
    task.style.opacity = "1";
  });

  cols.forEach((col) => {
    col.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.backgroundColor = "#0f5d0c";
    });
    col.addEventListener("dragleave", function () {
      this.style.backgroundColor = "transparent";
    });

    col.addEventListener("drop", function () {
      this.append(drag);
      const taskInput = drag.children[0];
      const prevCategory = taskInput.id;
      // Update [ the id of task ] to [ the id of new col ]
      taskInput.id = col.id;
      // Add in new col
      tasks[col.id].push(taskInput.value); // children[0] => input in the div (drag)
      // Delete from old col
      tasks[`${prevCategory}`] = tasks[`${prevCategory}`].filter(
        (ele) => ele != taskInput.value
      );
      // Update the local storage
      console.log(tasks);
      saveAtLocalStorage();
      this.style.backgroundColor = "transparent";
    });
  });
}

function saveAtLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
  const cols = ["not-started", "in-progress", "completed"];
  cols.forEach((col) => {
    tasks[col].forEach((task) => {
      document.getElementById(
        col
      ).innerHTML += `<div class="task" id="${task}" style="opacity: 1;" bis_skin_checked="1">
      <input type="text" value="${task}" draggable="true" id="${col}" disabled="">
      <div class="task-btns" bis_skin_checked="1">
      <button class="task-btn edit" onclick="enableEdit('${task}')"><ion-icon name="create-outline" role="img" class="md hydrated" aria-label="create outline"></ion-icon></button>
      <button class="task-btn delete" onclick="deleteTask('${task}')"><ion-icon name="trash-outline" role="img" class="md hydrated" aria-label="trash outline"></ion-icon></button>
      </div>
  </div>`;
      dragItem(task);
    });
  });
}
