/**
 * Фільтрація масиву студентів за факультетом та мінімальним балом
 * Використовує вбудований метод .filter()
 */
export function filterStudents(students, { faculty, minGrade }) {
    return students.filter(s => {
        const matchesFaculty = faculty === 'all' || s.faculty === faculty;
        const matchesGrade = s.grade >= minGrade;
        return matchesFaculty && matchesGrade;
    });
}

/**
 * Гнучке сортування масиву за допомогою нативного .sort()
 * Підтримує текстові (localeCompare) та числові поля, а також режими ASC/DESC
 */
export function sortStudents(students, { field, order }) {
    return [...students].sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (typeof valA === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return order === 'asc' ? valA - valB : valB - valA;
    });
}

/**
 * Розрахунок глибокої аналітики за допомогою .reduce()
 */
export function calculateStats(students) {
    if (students.length === 0) {
        return { count: 0, avgGrade: 0, topStudent: null, distribution: {} };
    }

    const count = students.length;
    
    // 1. Рахуємо суму балів для середнього значення
    const totalGrade = students.reduce((sum, s) => sum + s.grade, 0);
    const avgGrade = (totalGrade / count).toFixed(1);

    // 2. Шукаємо лідера за балами
    const topStudent = students.reduce((best, current) => {
        return (current.grade > (best?.grade || 0)) ? current : best;
    }, null);

    // 3. Групуємо за факультетами
    const distribution = students.reduce((acc, s) => {
        acc[s.faculty] = (acc[s.faculty] || 0) + 1;
        return acc;
    }, {});

    return { count, avgGrade, topStudent, distribution };
}

/**
 * Пошук першого збігу за ім'ям за допомогою .find()
 */
export function findStudentByName(students, nameQuery) {
    if (!nameQuery) return null;
    return students.find(s => s.name.toLowerCase().includes(nameQuery.toLowerCase()));
}