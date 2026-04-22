let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [];

const modal = document.getElementById('modal');
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const filterPriority = document.getElementById('filterPriority');

// --- Ініціалізація та рендер ---
function renderBoard() {
    const searchTerm = searchInput.value.toLowerCase();
    const priorityLimit = filterPriority.value;

    const columns = {
        todo: document.getElementById('todo'),
        inprogress: document.getElementById('inprogress'),
        done: document.getElementById('done')
    };

    // Очищуємо списки
    Object.values(columns).forEach(col => col.innerHTML = '');

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm) || t.desc.toLowerCase().includes(searchTerm);
        const matchesPriority = priorityLimit === 'all' || t.priority === priorityLimit;
        return matchesSearch && matchesPriority;
    });

    filteredTasks.forEach(task => {
        const card = createTaskCard(task);
        columns[task.status].appendChild(card);
    });

    updateCounters();
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = task.id;
    card.dataset.priority = task.priority;
    
    card.innerHTML = `
        <div class="card-header">
            <strong>${task.title}</strong>
            <button class="delete-btn" onclick="deleteTask('${task.id}')">×</button>
        </div>
        <p>${task.desc}</p>
        <div class="card-footer">
            <span>👤 ${task.assignee || '---'}</span>
            <span>📅 ${task.deadline || '---'}</span>
        </div>
    `;

    // Редагування подвійним кліком
    card.addEventListener('dblclick', () => openModal(task));

    // Drag & Drop події
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    return card;
}

// --- Drag & Drop Логіка ---
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.classList.add('drag-over');
        
        const draggingCard = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggingCard);
        } else {
            list.insertBefore(draggingCard, afterElement);
        }
    });

    list.addEventListener('dragleave', () => list.classList.remove('drag-over'));

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
        
        const cardId = document.querySelector('.dragging').dataset.id;
        const newStatus = list.id;
        
        // Оновлюємо стан
        const task = tasks.find(t => t.id === cardId);
        if (task) task.status = newStatus;
        
        saveAndRender();
    });
});

// Допоміжна функція для визначення позиції вставки (Reordering)
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- CRUD та інші функції ---
function saveAndRender() {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    renderBoard();
}

function openModal(task = null) {
    modal.classList.remove('hidden');
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDesc').value = task.desc;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskAssignee').value = task.assignee;
        document.getElementById('taskDeadline').value = task.deadline;
        document.getElementById('modalTitle').textContent = 'Редагувати задачу';
    } else {
        taskForm.reset();
        document.getElementById('taskId').value = '';
        document.getElementById('modalTitle').textContent = 'Нова задача';
    }
}

taskForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const taskData = {
        id: id || Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        desc: document.getElementById('taskDesc').value,
        priority: document.getElementById('taskPriority').value,
        assignee: document.getElementById('taskAssignee').value,
        deadline: document.getElementById('taskDeadline').value,
        status: id ? tasks.find(t => t.id === id).status : 'todo'
    };

    if (id) {
        const index = tasks.findIndex(t => t.id === id);
        tasks[index] = taskData;
    } else {
        tasks.push(taskData);
    }

    modal.classList.add('hidden');
    saveAndRender();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

function updateCounters() {
    document.querySelectorAll('.column').forEach(col => {
        const status = col.dataset.status;
        const count = tasks.filter(t => t.status === status).length;
        col.querySelector('.count').textContent = count;
    });
}

// Debounce для пошуку
const debounce = (fn, ms) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
};

searchInput.oninput = debounce(renderBoard, 300);
filterPriority.onchange = renderBoard;
document.getElementById('addTaskBtn').onclick = () => openModal();
document.getElementById('closeModal').onclick = () => modal.classList.add('hidden');

// Початковий рендер
renderBoard();