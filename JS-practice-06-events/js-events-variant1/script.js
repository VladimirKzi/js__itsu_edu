document.addEventListener('DOMContentLoaded', () => {
    // 30+ Елементів для списку пошуку
    const students = [
        "Олександр Мельник", "Марія Шевченко", "Андрій Коваленко", "Тетяна Бондаренко",
        "Сергій Ткаченко", "Ольга Кравченко", "Дмитро Олійник", "Анна Поліщук",
        "Ігор Луценко", "Наталія Кравчук", "Михайло Савченко", "Юлія Козак",
        "Вадим Марченко", "Ірина Кузьменко", "Артем Мороз", "Олена Лисенко",
        "Віталій Романюк", "Яна Петренко", "Максим Клименко", "Світлана Павленко",
        "Денис Сидоренко", "Катерина Дудник", "Роман Харченко", "Вікторія Мельничук",
        "Богдан Гончар", "Оксана Коваль", "Ярослав Бабич", "Анастасія Мазур",
        "Павло Кравчук", "Євгенія Бойко", "Антон Ткачук", "Марина Сорока"
    ];

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    const noResults = document.getElementById('noResults');

    // Стан для контролю валідності
    const validationState = { name: false, email: false, phone: false, message: false };

    // --- Функція Debounce (універсальна) ---
    function debounce(func, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }

    // --- Логіка валідації ---
    const validators = {
        name: (val) => val.trim().length >= 2,
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        phone: (val) => /^\+380\d{9}$/.test(val),
        message: (val) => val.length >= 20 && val.length <= 500
    };

    const errorMessages = {
        name: "Ім'я повинно містити не менше 2 символів.",
        email: "Введіть коректний email (наприклад, user@example.com).",
        phone: "Введіть номер у форматі +380XXXXXXXXX.",
        message: "Текст повинен містити від 20 до 500 символів."
    };

    function validateField(field, value) {
        const isValid = validators[field](value);
        validationState[field] = isValid;
        
        const group = document.querySelector(`.form-group[data-field="${field}"]`);
        const errorSpan = group.querySelector('.error-message');

        if (value.trim() === '') {
            group.classList.remove('valid', 'invalid');
            errorSpan.textContent = '';
        } else if (isValid) {
            group.classList.remove('invalid');
            group.classList.add('valid');
            errorSpan.textContent = '';
        } else {
            group.classList.remove('valid');
            group.classList.add('invalid');
            errorSpan.textContent = errorMessages[field];
        }
        updateProgress();
    }

    function updateProgress() {
        const totalFields = Object.keys(validationState).length;
        const validFields = Object.values(validationState).filter(Boolean).length;
        const percentage = Math.round((validFields / totalFields) * 100);

        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        progressText.textContent = `${percentage}%`;

        submitBtn.disabled = validFields !== totalFields;
    }

    // Live-валідація з debounce
    form.addEventListener('input', debounce((e) => {
        const group = e.target.closest('.form-group');
        if (group) {
            const field = group.dataset.field;
            validateField(field, e.target.value);
        }
    }, 300));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Форму успішно відправлено!');
    });

    // --- Логіка пошуку ---
    function renderList(filteredItems, query = '') {
        resultsList.innerHTML = '';
        
        if (filteredItems.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }
        noResults.classList.add('hidden');

        filteredItems.forEach(item => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0'); // Доступність із клавіатури
            
            if (query) {
                const regex = new RegExp(`(${query})`, 'gi');
                li.innerHTML = item.replace(regex, '<span class="highlight">$1</span>');
            } else {
                li.textContent = item;
            }
            resultsList.appendChild(li);
        });
    }

    const handleSearch = debounce((query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            renderList(students);
            return;
        }
        const filtered = students.filter(s => s.toLowerCase().includes(trimmedQuery.toLowerCase()));
        renderList(filtered, trimmedQuery);
    }, 300);

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

    // --- Event Delegation (Делегування подій) ---
    resultsList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) alert(`Ви обрали студента: ${li.textContent}`);
    });

    resultsList.addEventListener('keydown', (e) => {
        const li = e.target.closest('li');
        if (li && e.key === 'Enter') alert(`Ви обрали студента: ${li.textContent}`);
    });

    renderList(students);
});