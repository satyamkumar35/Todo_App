  let todolist = [
        { item: "task1", Date: "2023-10-10", time: "10:00", completed : false },
        { item: "task2", Date: "2023-10-11", time: "11:00", completed : false},
      ];

      function addtodo() {
        let inputelement = document.getElementById("input_task");
        let inputdate = document.getElementById("input_date");
        let inputtime = document.getElementById("input_time");
        let inputvalue = inputelement.value.trim();
        let datevalue = inputdate.value;
        let timevalue = inputtime.value;
        if (inputvalue === "" || datevalue === "" || timevalue === "") {
          alert("Please enter task, time and date!");
          return;
        }

        todolist.push({ item: inputvalue, Date: datevalue, time: timevalue, completed: false });

        inputelement.value = "";
        inputdate.value = "";
        inputtime.value = "";
        saveTasks();
        displaytodo();
      }

    function saveTasks() {
localStorage.setItem("todolist", JSON.stringify(todolist));
}

function loadTasks() {
  let stored = localStorage.getItem("todolist");
  if (stored) {
    todolist = JSON.parse(stored);
  }
  displaytodo();
}

function toggleComplete(index) {
  todolist[index].completed = !todolist[index].completed;
  displaytodo();
}
  
function displaytodo(list = todolist) {
  let containerelement = document.querySelector(".todo-container");
  containerelement.innerHTML = ""; // clear old content

  list.forEach((todo, i) => {
    containerelement.innerHTML += `
        <div class="todo-item ${todo.completed ? "completed" : ""}">
        <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="toggleComplete(${i})">
        <span>${todo.item}</span>
        <span>${todo.Date}</span>
        <span>${todo.time}</span>
        <button onclick="editTask(${i})">Edit</button>
        <button onclick="todolist.splice(${i},1); displaytodo();">Delete</button>
      </div>
    `;
  });
  saveTasks();
}
function editTask(index) {
  let newTask = prompt("Edit task:", todolist[index].item);
  if (newTask) {
    todolist[index].item = newTask;
    saveTasks();
    displaytodo();
  }
}


function filterTasks(status) {
  let filtered = todolist.filter(todo => {
    if (status === "all") return true;
    if (status === "completed") return todo.completed;
    if (status === "pending") return !todo.completed;
  });
  displaytodo(filtered);
}

loadTasks();