(function(){
// глобальные переменные
const toDoList = document.getElementById("todoList");
const userSelect = document.getElementById("userSelect");
const form = document.querySelector("form");
let todos = [];
let users = [];

// привязка событий
document.addEventListener("DOMContentLoaded", initApp);
form.addEventListener("submit", handleSubmit);

// отрисовка

function getUserName(userId){
  const user = users.find((user) => user.id === userId);
  return user.username;
}

function printToDo({id, userId, title, completed}){
  // создаем элемент списка
  const li = document.createElement("li");
  li.className = "toDoItem";
  li.dataset.id = id;
  li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

  const status = document.createElement('input');
  status.type = "checkbox";
  status.checked = completed;
  status.addEventListener("change", handleToDoChange);

  const close = document.createElement("span");
  close.innerHTML = "&times;" //X
  close.className = "close";
  close.addEventListener("click", handleClose);

  li.prepend(status);
  li.append(close);

  toDoList.prepend(li);
}

function createUserOption(user){
  const option = document.createElement("option");
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

function removeToDo(todoId){
  todos = todos.filter(todo => todo.id !== todoId);

  const todo = toDoList.querySelector(`[data-id="${todoId}"]`);
  todo.querySelector("input").removeEventListener("change", handleToDoChange);
  todo.querySelector(".close").removeEventListener("click", handleClose);

  todo.remove();
}

// логика событий
function initApp(){
  Promise.all([getAllTodos(), getAllUsers()])
    .then(values => {
      [todos, users] = values;
      todos.forEach(todo => printToDo(todo));
      users.forEach(user => createUserOption(user));
    })
}

function handleSubmit(e){
  e.preventDefault();

  createToDo({
    userId: Number(userSelect.value),
    title: form.toDo.value,
    completed: false
  });
}

function handleToDoChange(){
  const todoId = this.parentElement.dataset.id;
  const completed = this.checked;

  toggleToDoComplete(todoId, completed);
}

function handleClose(){
  const todoId = this.parentElement.dataset.id;
  deleteToDo(todoId);
}


// асинхронная логика
async function getAllTodos(){
 try{
  const responce = await fetch("https://jsonplaceholder.typicode.com/todos");
  if(!responce.ok){
    throw new Error(responce.status);
  }
  const data = await responce.json();
  return data;
 }catch(err){
   alertError(err);
 }
}

async function getAllUsers(){
  try{
    const responce = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!responce.ok){
      throw new Error(responce.status);
    }
    const data = await responce.json();
    return data;
  }catch(err){
    alertError(err);
  }
}

async function createToDo(todo){
  try{
    const responce = await fetch("https://jsonplaceholder.typicode.com/todos",
    {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if(!responce.ok){
      throw new Error(responce.status);
    }
    const toDo = await responce.json();
    printToDo(toDo);
  }catch(err){
    alertError(err);
  }
}

async function toggleToDoComplete(todoId, completed){
  try{
    const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
  {
    method: "PATCH",
    body: JSON.stringify({completed}),
    headers: {
      'Content-type': 'application/json',
    },
  });
  if(!responce.ok){
    throw new Error(responce.status);
  }

  const data = await responce.json();

  console.log(data)

  }catch(err){
    alertError(err);
  }
}

async function deleteToDo(todoId){
  try{
    const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
    {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json',
      },
    });
  
    if(responce.ok){
      removeToDo(todoId);
    }else{
        throw new Error(responce.status);
    }
  }catch(err){
    alertError(err);
  }
}

// обработка ошибок
function alertError(err){
  alert(err.message);
}
})()

