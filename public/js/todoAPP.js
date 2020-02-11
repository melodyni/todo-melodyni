const goToHome = function(responseText) {};

const deleteTask = function(taskId) {
  sendXMLRequest('DELETE', '/deleteTask', goToHome, taskId);
};

const deleteTodo = function(todoId) {
  sendXMLRequest('DELETE', '/deleteTodo', goToHome, todoId);
};

const toggleTaskStatus = function(taskId) {
  sendXMLRequest('POST', '/toggleTaskStatus', goToHome, taskId);
};

const editTask = function(taskId) {
  if (event.key === 'Enter') {
    const editedTask = event.target.innerHTML;
    const content = JSON.stringify({ editedTask, taskId });
    sendXMLRequest('POST', '/editTask', goToHome, content);
  }
};

const getValue = element => element.value;

const saveTodo = function() {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.taskInput'));
  const tasks = taskElements.map(getValue);
  const todoContent = JSON.stringify({ title, tasks });
  sendXMLRequest('POST', '/postNewTodos', goToHome, todoContent);
};

const getTaskInputBox = function() {
  const html = document.createElement('div');
  html.innerHTML = `
  <input type="checkbox" class="checkBox __status__">
  <input type="text" class="taskInput" onkeypress="insertInputBox(event)">`;
  html.className = 'taskBox';
  html.id = '__taskId__';
  return html;
};

const appendHTML = (selector, html) => {
  document.querySelector(selector).append(html);
};

const insertInputBox = function(event) {
  if (event.key === 'Enter') {
    appendHTML('#newTask', getTaskInputBox());
  }
};

const attachEventListener = function() {
  const titleInput = document.querySelector('#todoTitle');
  titleInput.onkeypress = insertInputBox;
};

const generateTodoDiv = todo => fillTemplate(todoTemplate, todo);

const insertHTML = (selector, html) => {
  document.querySelector(selector).innerHTML = html;
};

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

const fillTemplate = function(template, propertyBag) {
  const keys = Object.keys(propertyBag);
  const replaceKeyByValue = function(template, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return template.replace(pattern, propertyBag[key]);
  };
  const html = keys.reduce(replaceKeyByValue, template);
  return html;
};

const generateTaskDiv = task => fillTemplate(taskTemplate, task);
const displayTasks = function(responseText) {
  const tasks = JSON.parse(responseText);
  insertHTML('#items', tasks.map(generateTaskDiv).join('\n'));
};

const loadTasks = todoId => {
  const html = `
  <div class="navBar">
    <img src="images/save.png" alt="save" />
    <a href="index.html"><img src="images/cross.png" alt="cross"/></a>
  </div>
  <hr />
  <br />
  <div id="items">__TODO_ITEMS__</div>`;
  insertHTML('#todoDisplay', html);
  const todoDisplay = document.querySelector('#todoDisplay');
  todoDisplay.style['background-color'] = '#3b4446';
  sendXMLRequest('GET', `/fetchTasks?id=${todoId}`, displayTasks, '');
};

const todoTemplate = `
<div style="display:flex;justify-content:end;margin:0px" >
  <div class="log" id="__id__" onclick="loadTasks('__id__')" > 
    <h1 class="title" >__title__</h1>
    <div>
      <img src="/images/edit.png" class="miniImg" alt="edit" >
      <img src="/images/bin.png" class="miniImg" alt="delete" 
        onclick="deleteTodo('__id__')">
    </div>
  </div>
</div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <input type="checkbox" id="taskId" class="checkBox" 
    onclick="toggleTaskStatus('__taskId__')" __status__>
  <div class="task">
    <h6 contenteditable onkeypress="editTask('__taskId__')">__taskName__<h6>
  </div>
  <img src="/images/bin.png" class="miniImg" alt="delete" 
    onclick="deleteTask('__taskId__')">
</div>
<br>`;

const sendXMLRequest = function(method, url, callBack, data) {
  const STATUS_CODES = { OK: 200 };
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callBack(this.responseText);
    }
  };
  request.open(method, url);
  request.send(data);
};

const displayTodos = responseText => {
  const todos = JSON.parse(responseText);
  return insertHTML('#todo', todos.map(generateTodoDiv).join('\n'));
};

const main = () => sendXMLRequest('GET', 'oldTodos', displayTodos);
window.onload = main;
