import { filterStudents, sortStudents, calculateStats, findStudentByName } from './logic.js';

// Початкова база даних студентів за ТЗ
let students = [
	{ id: 1, name: 'Іван Петренко', age: 20, grade: 95.0, faculty: 'ФІТ' },
    { id: 2, name: 'Ольга Сидорчук', age: 19, grade: 88.5, faculty: 'ФЕАН' },
    { id: 3, name: 'Андрій Коваль', age: 22, grade: 74.0, faculty: 'ФІТ' },
	{ id: 4, name: 'Іван Іванов', age: 25, grade: 90.5, faculty: 'ФЕАН' },
	{ id: 5, name: 'Андрій Конотоп', age: 23, grade: 82.5, faculty: 'ФІТ' },
    { id: 6, name: 'Тетяна Мороз', age: 21, grade: 99.0, faculty: 'Політех' },
    { id: 7, name: "Іван Петренко", age: 30, grade: 85.5, faculty: "IT" },
    { id: 8, name: "Олексій Шатний", age: 27, grade: 71.0, faculty: "IT" }
];
let currentId = 5;

// DOM Елементи
const studentForm = document.getElementById('studentForm');
const studentsTable = document.getElementById('studentsTable');
const statsPanel = document.getElementById('statsPanel');

const filterFaculty = document.getElementById('filterFaculty');
const filterMinGrade = document.getElementById('filterMinGrade');
const sortBy = document.getElementById('sortBy');
const sortOrder = document.getElementById('sortOrder');
const searchName = document.getElementById('searchName');
const searchResult = document.getElementById('searchResult');

// Додавання нового студента (з валідацією крайніх випадків)
studentForm.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(studentForm);
    
    const grade = parseFloat(data.get('grade'));
    const age = parseInt(data.get('age'));
    const name = data.get('name').trim();

    if (grade < 0 || grade > 100 || age < 16) {
        return alert('Некоректні дані! Перевірте вік (16+) та бал (0-100).');
    }

    students.push({
        id: currentId++,
        name,
        age,
        grade,
        faculty: data.get('faculty')
    });

    render();
    studentForm.reset();
};

// Живий пошук через метод .find()
searchName.oninput = () => {
    const query = searchName.value.trim();
    const found = findStudentByName(students, query);

    if (found) {
        searchResult.innerHTML = `<p>Знайдено: ${found.name} (Факультет: ${found.faculty}, Бал: ${found.grade})</p>`;
    } else {
        searchResult.innerHTML = query ? '<p>Нікого не знайдено</p>' : '';
    }
};

// Головна функція рендерингу дашборду
function render() {
    // 1. Фільтрація
    let processed = filterStudents(students, {
        faculty: filterFaculty.value,
        minGrade: parseFloat(filterMinGrade.value) || 0
    });

    // 2. Сортування
    processed = sortStudents(processed, {
        field: sortBy.value,
        order: sortOrder.value
    });

    // 3. Вивід у таблицю за допомогою .map()
    if (processed.length === 0) {
        studentsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Збігів не знайдено</td></tr>`;
    } else {
        studentsTable.innerHTML = processed.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.age}</td>
                <td><b>${s.grade.toFixed(1)}</b></td>
                <td>${s.faculty}</td>
            </tr>
        `).join('');
    }

    // 4. Оновлення панелі статистики
    const stats = calculateStats(processed);
	const facultyList = Object.entries(stats.distribution).map(([faculty, count]) => `${faculty}: <b>${count}</b>`).join(', ');
    statsPanel.innerHTML = `
        <p>Всього студентів: <b>${stats.count}</b></p>
        <p>Середній GPA: <b>${stats.avgGrade}</b></p>
        <p>Найкращий студент: <b>${stats.topStudent ? stats.topStudent.name : '—'}</b> (${stats.topStudent ? stats.topStudent.grade : 0})</p>
        <p>Факультети: <code>${facultyList || 'немає даних'}</code></p>
    `;
}

// Події для фільтрів
[filterFaculty, filterMinGrade, sortBy, sortOrder].forEach(el => el.oninput = render);

// Перший запуск програми
render();