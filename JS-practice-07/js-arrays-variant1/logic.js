/**
 * Сортування (Bubble Sort)
 */
export function bubbleSort(arr, compareFn) {
    let comparisons = 0;
    const newArr = [...arr];
    const n = newArr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            if (compareFn(newArr[j], newArr[j + 1]) > 0) {
                [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
            }
        }
    }
    return { sorted: newArr, comparisons };
}

/**
 * Швидке(Quick Sort)
 */
export function quickSort(arr, compareFn) {
    let comparisons = 0;

    function sort(array) {
        if (array.length <= 1) return array;
        
        const pivot = array[array.length - 1];
        const left = [];
        const right = [];

        for (let i = 0; i < array.length - 1; i++) {
            comparisons++;
            if (compareFn(array[i], pivot) < 0) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }
        return [...sort(left), pivot, ...sort(right)];
    }

    return { sorted: sort([...arr]), comparisons };
}

/**
 * Розрахунок статистики за допомогою методів масивів (reduce, filter, map)
 */
export function calculateStats(students) {
    if (students.length === 0) {
        return { count: 0, avgGpa: 0, top3: [], distribution: {} };
    }

    const count = students.length;
	
    const totalGpa = students.reduce((sum, student) => sum + student.gpa, 0);
    const avgGpa = (totalGpa / count).toFixed(1);

    const { sorted: sortedByGpa } = quickSort(students, (a, b) => b.gpa - a.gpa);
    const top3 = sortedByGpa.slice(0, 3);

    const distribution = students.reduce((acc, student) => {
        acc[student.faculty] = (acc[student.faculty] || 0) + 1;
        return acc;
    }, {});

    return { count, avgGpa, top3, distribution };
}

/**
 * Генератор рандомних даних для бенчмарку
 */
export function generateRandomStudents(size) {
    const faculties = ['ФІТ', 'ФЕАН', 'Юридичний', 'Політех'];
    const names = ['Олександр', 'Марія', 'Дмитро', 'Анна', 'Артем', 'Олена', 'Ігор', 'Вікторія'];
    
    return Array.from({ length: size }, () => ({
        name: names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 100),
        age: Math.floor(Math.random() * 10) + 17,
        gpa: Math.floor(Math.random() * 61) + 40, // GPA від 40 до 100
        faculty: faculties[Math.floor(Math.random() * faculties.length)]
    }));
}