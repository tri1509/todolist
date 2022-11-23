const TODOLIST_APP = "TODOLIST_APP";
let data = [
  {
    task: "Run 2km",
    is_complete: true,
  },
  {
    task: "Học bài",
    is_complete: false,
  },
];

const saveData = (data) => {
  localStorage.setItem(TODOLIST_APP, JSON.stringify(data));
};

const loadData = () => {
  let data;
  data = JSON.parse(localStorage.getItem(TODOLIST_APP));
  data = data ? data : [];
  return data;
};

const addTask = (new_task) => {
  let data;
  data = loadData();
  data.push(new_task);
  saveData(data);
};

const createTaskItem = (task, is_complete, index) => {
  return `
    <li class="task-item" is-complete="${is_complete}" index="${index}">
      <span class="task" onclick="markTaskComplete(${index})">${task}</span>
      <div class="task-action">
        <button onclick="pushEditTask(${index})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button onclick="deleteTask(this,${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>
    `;
};

const renderTasks = () => {
  let data, ulTasksHtml, ulTasks, task_result, count_complete;
  task_result = document.querySelector(".task-result");
  ulTasks = document.querySelector("ul.tasks");
  data = loadData();
  count_complete = 0;
  ulTasksHtml = data.map((element, index) => {
    if (element.is_complete == true) count_complete++;
    return createTaskItem(element.task, element.is_complete, index);
  });
  task_result.innerText =
    count_complete > 0 ? `Yeah, ${count_complete} tasks completed !` : [];
  ulTasks.innerHTML = ulTasksHtml.join("");
};

const markTaskComplete = (index) => {
  let data;
  data = loadData();
  data[index].is_complete = data[index].is_complete == true ? false : true;
  saveData(data);
  renderTasks();
};

const deleteTask = (element, index) => {
  let data;
  let delete_confirm = confirm("Bạn có muốn xoá không ?");
  if (delete_confirm) {
    data = loadData();
    data.splice(index, 1);
    saveData(data);
    element.closest(".task-item").remove();
  }
};

const pushEditTask = (index) => {
  let data = loadData();
  const btn = document.querySelector("#add_task button");
  const task = document.querySelector("#task");
  task.value = data[index].task;
  task.setAttribute("index", index);
  btn.innerText = "EDIT TASK";
};

const editTask = (task, index) => {
  const btn = document.querySelector("#add_task button");
  let data = loadData();
  data[index].task = task;
  saveData(data);
  btn.innerText = "ADD TASK";
};

const formAddTask = document.forms.add_task;
formAddTask.addEventListener("submit", (e) => {
  let new_task;
  const task = document.querySelector("#task");
  const index = task.getAttribute("index");
  if (task.value.length < 2) {
    alert("Enter Your Task !");
    return false;
  }
  if (index) {
    editTask(task.value, index);
    task.removeAttribute("index");
  } else {
    new_task = {
      task: task.value,
      is_complete: false,
    };
    addTask(new_task);
  }

  renderTasks();
  task.value = "";
  e.preventDefault();
});

document.addEventListener("keyup", (e) => {
  const task = document.querySelector("#task");
  if (e.which == 27) {
    task.value = "";
    const btn = document.querySelector("#add_task button");
    btn.innerText = "ADD TASK";
    task.removeAttribute("index");
  }
});

renderTasks();
