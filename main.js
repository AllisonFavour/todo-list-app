const main = document.querySelector('main');
const modeBtn = document.querySelector('.mode-btn');
const form = document.getElementById('js-todo-form');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('js-todo-btn');
const todosDiv = document.getElementById('todos');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

if (localStorage.getItem('theme') === 'dark') {
    main.classList.add('dark');
    modeBtn.classList.remove('fa-moon');
    modeBtn.classList.add('fa-sun');
} else {
    main.classList.remove('dark');
    modeBtn.classList.remove('fa-sun');
    modeBtn.classList.add('fa-moon');
}

modeBtn.addEventListener('click', () => {
    main.classList.toggle('dark');
    
    if (main.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        modeBtn.classList.remove('fa-moon');
        modeBtn.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        modeBtn.classList.remove('fa-sun');
        modeBtn.classList.add('fa-moon');
    }
});

addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (todoInput.value === '') return alert('Please enter a todo');
    addTask(todoInput.value);
    todoInput.value = '';
});

function addTask(text) {
    todos.push({ text, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodoItem(todos.length - 1);  // Render the new todo immediately
}

function removeTodo(index) {
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));

    const todoDiv = document.getElementById(`todo-${index}`);
    todoDiv.classList.add('fade-out');  // Apply fade-out animation
    setTimeout(() => todoDiv.remove(), 300); // Remove the todo after animation
}

function editTodo(index) {
    const todoItem = todos[index];
    const newText = prompt('Edit your todo: ', todoItem.text);

    if (newText !== null && newText.trim() !== '') {
        todos[index].text = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
        
        // Directly update the todo item in the UI
        const todoDiv = document.getElementById(`todo-${index}`);
        const textDiv = todoDiv.querySelector('.todo-text');
        textDiv.textContent = newText;
    }
}

function toggleCompleted(index) {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
    updateTodoItem(index);  // Only update the checkbox status and text
}

function updateTodoItem(index) {
    const todoItem = todos[index];
    const todoDiv = document.getElementById(`todo-${index}`);
    const textDiv = todoDiv.querySelector('.todo-text');
    const completedCheckbox = todoDiv.querySelector('input[type="checkbox"]');

    // Update text-decoration and checkbox
    if (todoItem.completed) {
        textDiv.style.textDecoration = 'line-through';
        completedCheckbox.checked = true;
    } else {
        textDiv.style.textDecoration = 'none';
        completedCheckbox.checked = false;
    }
}

function renderTodos() {
    todosDiv.innerHTML = ''; // Clear the existing list
    todos.forEach((todoItem, index) => renderTodoItem(index));
}

function renderTodoItem(index) {
    const todoItem = todos[index];

    // Create elements for each todo item
    const todoDiv = document.createElement('div');
    const textDiv = document.createElement('div');
    const actionsDiv = document.createElement('div');
    const editBtn = document.createElement('button');
    const completedLabel = document.createElement('label');
    const completedCheckbox = document.createElement('input');
    const deleteBtn = document.createElement('button');

    todoDiv.id = `todo-${index}`;
    todoDiv.classList.add('todo-div');
    textDiv.classList.add('todo-text');
    actionsDiv.classList.add('todo-actions');
    editBtn.classList.add('edit-btn');
    deleteBtn.classList.add('delete-btn');
    editBtn.textContent = 'Edit';
    deleteBtn.textContent = 'Delete';
    completedCheckbox.type = 'checkbox';
    completedLabel.textContent = 'Completed ';

    textDiv.textContent = todoItem.text;

    if (todoItem.completed) {
        textDiv.style.textDecoration = 'line-through';
        completedCheckbox.checked = true;
        textDiv.classList.add('completed');
    }

    completedLabel.appendChild(completedCheckbox);

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(completedLabel);
    actionsDiv.appendChild(deleteBtn);

    todoDiv.appendChild(textDiv);
    todoDiv.appendChild(actionsDiv);
    todosDiv.appendChild(todoDiv);

    editBtn.addEventListener('click', () => editTodo(index));
    completedCheckbox.addEventListener('change', () => toggleCompleted(index));
    deleteBtn.addEventListener('click', () => removeTodo(index));
}

// Initialize render
renderTodos();