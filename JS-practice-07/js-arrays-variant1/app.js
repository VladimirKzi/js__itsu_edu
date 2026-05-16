import { bubbleSort, quickSort, calculateStats, generateRandomStudents } from './logic.js';

// Початкова база студентів
let students = [
    { name: 'Іван Петренко', age: 20, gpa: 95, faculty: 'ФІТ' },
    { name: 'Ольга Сидорчук', age: 19, gpa: 88, faculty: 'ФЕАН' },
    { name: 'Андрій Коваль', age: 22, gpa: 74, faculty: 'ФІТ' },
	{ name: 'Іван Іванов', age: 25, gpa: 90, faculty: 'ФЕАН' },
	{ name: 'Андрій Конотоп', age: 23, gpa: 82, faculty: 'ФІТ' },
    { name: 'Тетяна Мороз', age: 21, gpa: 99, faculty: 'Політех' }
];

// DOM
const studentForm = document.getElementById('studentForm');
const studentsTable = document.getElementById('studentsTable');
const statsPanel = document.getElementById('statsPanel');

// Елементи фільтрації/сортування
const filterFaculty = document.getElementById('filterFaculty');
const filterMinGpa = document.getElementById('filterMinGpa');
const sortBy = document.getElementById('sortBy');
const sortOrder = document.getElementById('sortOrder');

// Елементи пошуку
const searchName = document.getElementById('searchName');
const searchResult = document.getElementById('searchResult');

// Обробка форми додавання студента
studentForm.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(studentForm);
    
    const gpa = parseInt(data.get('gpa'));
    if (gpa < 0 || gpa > 100) return alert('GPA має бути в межах від 0 до 100!');

    students.push({
        name: data.get('name'),
        age: parseInt(data.get('age')),
        gpa: gpa,
        faculty: data.get('faculty')
    });

    render();
    studentForm.reset();
};

// Компаратор для сортування за різними полями
function getComparer(field, order) {
    return (a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (typeof valA === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return order === 'asc' ? valA - valB : valB - valA;
    };
}

searchName.oninput = () => {
    const query = searchName.value.trim().toLowerCase();
    
    if (!query) {
        searchResult.innerHTML = '';
        return;
    }

    // ВИКОРИСТОВУЄМО .find() для пошуку першого збігу
    const found = students.find(s => s.name.toLowerCase().includes(query));

    if (found) {
        searchResult.innerHTML = `<p>Знайдено: ${found.name} (GPA: ${found.gpa}, ${found.faculty})</p>`;
    } else {
        searchResult.innerHTML = '<p>Нікого не знайдено</p>';
    }
};

// Головна функція оновлення інтерфейсу
function render() {
    const faculty = filterFaculty.value;
    const minGpa = parseInt(filterMinGpa.value) || 0;
    const field = sortBy.value;
    const order = sortOrder.value;

    let filtered = students.filter(s => {
        const matchesFaculty = faculty === 'all' || s.faculty === faculty;
        const matchesGpa = s.gpa >= minGpa;
        return matchesFaculty && matchesGpa;
    });

    const { sorted } = quickSort(filtered, getComparer(field, order));

    studentsTable.innerHTML = sorted.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.age}</td>
            <td><b>${s.gpa}</b></td>
            <td>${s.faculty}</td>
        </tr>
    `).join('');

    const stats = calculateStats(filtered);
	const facultyList = Object.entries(stats.distribution).map(([faculty, count]) => `${faculty}: <b>${count}</b>`).join(', ');
    statsPanel.innerHTML = `
        <p>Всього студентів: <b>${stats.count}</b></p>
        <p>Середній GPA: <b>${stats.avgGpa}</b></p>
        <p>Топ-3 (GPA): <b>${stats.top3.map(s => s.name).join(', ') || '—'}</b></p>
        <p>Факультети: <code>${facultyList}</code></p>
    `;
}

// Події зміни фільтрів
[filterFaculty, filterMinGpa, sortBy, sortOrder].forEach(el => el.oninput = render);

// --- БЕНЧМАРК АЛГОРИТМІВ ---
document.getElementById('runBenchmark').onclick = () => {
    const sizes = [100, 1000, 5000];
    const resultsTable = document.getElementById('benchmarkResults');
    resultsTable.innerHTML = '';

    sizes.forEach(size => {
        const testData = generateRandomStudents(size);
        const comparer = (a, b) => a.gpa - b.gpa;

        const t0 = performance.now();
        const bubbleRes = bubbleSort(testData, comparer);
        const t1 = performance.now();
        const bubbleTime = (t1 - t0).toFixed(1);

        const t2 = performance.now();
        const quickRes = quickSort(testData, comparer);
        const t3 = performance.now();
        const quickTime = (t3 - t2).toFixed(1);

        resultsTable.innerHTML += `
            <tr>
                <td><b>${size}</b></td>
                <td>${bubbleTime} ms / ${bubbleRes.comparisons} порівнянь</td>
                <td>${quickTime} ms / ${quickRes.comparisons} порівнянь</td>
            </tr>
        `;
    });
};

render();