// Simple array to store todos
let todos = [];

// Load from localStorage when page starts
document.addEventListener('DOMContentLoaded', function() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    } else {
        // Add sample todos for first time
        todos = [
            { id: 1, text: 'Welcome to Todo App!', completed: false },
            { id: 2, text: 'Click checkbox to complete', completed: false },
            { id: 3, text: 'Try editing this task', completed: true }
        ];
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
    const todo = todos.find(function(t) {
        return t.id === id;
    });
    
    if (todo) {
        todo.completed = !todo.completed;
        saveAndRender();
    }
}

// Delete single todo
function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        todos = todos.filter(function(t) {
            return t.id !== id;
        });
        saveAndRender();
    }
}

// Edit todo
function editTodo(id) {
    const todo = todos.find(function(t) {
        return t.id === id;
    });
    
    const newText = prompt('Edit task:', todo.text);
    
    if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        saveAndRender();
    }
}

// Clear completed todos
function clearCompleted() {
    let completedCount = 0;
    for(let i = 0; i < todos.length; i++) {
        if(todos[i].completed) {
            completedCount++;
        }
    }
    
    if (completedCount === 0) {
        alert('No completed tasks!');
        return;
    }
    
    if (confirm('Delete ' + completedCount + ' completed task(s)?')) {
        todos = todos.filter(function(t) {
            return !t.completed;
        });
        saveAndRender();
    }
}

// Update statistics
function updateStats() {
    let total = todos.length;
    let completed = 0;
    
    for(let i = 0; i < todos.length; i++) {
        if(todos[i].completed) {
            completed++;
        }
    }
    
    let pending = total - completed;
    
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
    
    let html = '';
    
    for(let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        const completedClass = todo.completed ? 'completed' : '';
        const checked = todo.completed ? 'checked' : '';
        
        html += `
            <li class="todo-item ${completedClass}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${checked}
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
        `;
    }
    
    list.innerHTML = html;
    updateStats();
}

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// Add todo with Enter key
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});
