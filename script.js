// Global variables
let tasks = [];
let currentFilter = 'all';

// Load tasks from local storage when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateStats();
    filterTasks('all');
});

// Add new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        priority: priority,
        completed: false,
        createdAt: new Date().toLocaleString()
    };
    
    tasks.push(task);
    taskInput.value = '';
    
    // Save to local storage
    saveToLocalStorage();
    
    // Refresh display
    filterTasks(currentFilter);
    updateStats();
    
    // Show success message
    showNotification('Task added successfully!', 'success');
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveToLocalStorage();
        filterTasks(currentFilter);
        updateStats();
        showNotification('Task deleted successfully!', 'success');
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveToLocalStorage();
        filterTasks(currentFilter);
        showNotification('Task updated successfully!', 'success');
    }
}

// Toggle task completion
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveToLocalStorage();
    filterTasks(currentFilter);
    updateStats();
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredTasks = [];
    
    if (filter === 'all') {
        filteredTasks = tasks;
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    displayTasks(filteredTasks);
}

// Display tasks in UI
function displayTasks(tasksToDisplay) {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    if (tasksToDisplay.length === 0) {
        taskList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Sort tasks: high priority first, then medium, then low
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
    const sortedTasks = tasksToDisplay.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    taskList.innerHTML = sortedTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleComplete(${task.id})">
            
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    <span class="created-at">
                        <i class="far fa-clock"></i> ${task.createdAt}
                    </span>
                </div>
            </div>
            
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
}

// Save to local storage
function saveToLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    showNotification('Tasks saved to local storage!', 'success');
}

// Load from local storage
function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        showNotification('Tasks loaded from local storage!', 'info');
    } else {
        // Add some sample tasks for first-time users
        tasks = [
            {
                id: 1,
                text: 'Welcome to your To-Do App!',
                priority: 'high',
                completed: false,
                createdAt: new Date().toLocaleString()
            },
            {
                id: 2,
                text: 'Try adding a new task',
                priority: 'medium',
                completed: false,
                createdAt: new Date().toLocaleString()
            },
            {
                id: 3,
                text: 'Mark this as completed',
                priority: 'low',
                completed: true,
                createdAt: new Date().toLocaleString()
            }
        ];
    }
}

// Delete all tasks
function deleteAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
        tasks = [];
        saveToLocalStorage();
        filterTasks(currentFilter);
        updateStats();
        showNotification('All tasks deleted!', 'warning');
    }
}

// Save tasks (explicit save button)
function saveTasks() {
    saveToLocalStorage();
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add keyboard shortcut (Enter key to add task)
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add some CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
