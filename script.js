// Simple array to store todos
let todos = [];

// Load from localStorage when page starts
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('darkTodos');
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    }
});

// Add new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    input.value = '';
    
    saveAndRender();
}

// Toggle complete status
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveAndRender();
    }
}

// Delete single todo
function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
    }
}

// Edit todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    const newText = prompt('Edit task:', todo.text);
    
    if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        saveAndRender();
    }
}

// Clear completed todos
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks!');
        return;
    }
    
    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveAndRender();
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('doneCount').textContent = completed;
    document.getElementById('leftCount').textContent = pending;
}

// Render todos to screen
function renderTodos() {
    const list = document.getElementById('todoList');
    
    if (todos.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard"></i>
                <p>No tasks yet. Add one above!</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    list.innerHTML = todos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onclick="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button onclick="editTodo(${todo.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTodo(${todo.id})" class="delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
    
    updateStats();
}

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('darkTodos', JSON.stringify(todos));
    renderTodos();
}

// Add todo with Enter key
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
