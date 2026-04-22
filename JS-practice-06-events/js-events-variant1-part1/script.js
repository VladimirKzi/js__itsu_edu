document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('advancedForm');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const charCounter = document.getElementById('currentChar');
    const successOverlay = document.getElementById('successMessage');

    const fields = {
        name: { validate: (v) => /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s]{2,}$/.test(v) },
        email: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        phone: { validate: (v) => /^\+380\d{9}$/.test(v) },
        subject: { validate: (v) => v !== "" },
        message: { validate: (v) => v.length >= 20 && v.length <= 500 }
    };

    const state = { name: false, email: false, phone: false, subject: false, message: false };

    // --- Debounce ---
    function debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    // --- Валідація ---
    const checkField = (name, value) => {
        const isValid = fields[name].validate(value);
        state[name] = isValid;
        
        const group = document.querySelector(`.field-group[data-field="${name}"]`);
        if (value.trim() === "") {
            group.classList.remove('valid', 'invalid');
        } else {
            group.classList.toggle('valid', isValid);
            group.classList.toggle('invalid', !isValid);
        }
        updateUI();
    };

    const updateUI = () => {
        // Прогрес
        const validCount = Object.values(state).filter(Boolean).length;
        const percent = (validCount / 5) * 100;
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${Math.round(percent)}%`;

        // Кнопка
        submitBtn.disabled = validCount < 5;
    };

    // --- Делегування подій ---
    form.addEventListener('input', debounce((e) => {
        const target = e.target;
        if (target.name in fields) {
            checkField(target.name, target.value);
        }
        
        // Лічильник символів
        if (target.name === 'message') {
            charCounter.textContent = target.value.length;
        }
    }, 400));

    // Обробка select (без debounce для кращого UX)
    form.querySelector('select').addEventListener('change', (e) => {
        checkField('subject', e.target.value);
    });

    // --- Submit ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = "Надсилаємо...";
        submitBtn.querySelector('.loader').style.display = "block";

        // Симуляція запиту до API
        await new Promise(resolve => setTimeout(resolve, 2000));

        successOverlay.classList.remove('hidden');
    });
});