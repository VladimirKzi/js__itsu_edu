import * as sorts from './logic.js';

const resultsTable = document.getElementById('resultsTable');
const arraySizeSelect = document.getElementById('arraySize');
const arrayTypeSelect = document.getElementById('arrayType');
const runBtn = document.getElementById('runBtn');

// Генерація тестових наборів даних згідно з ТЗ
function generateTestData(size, type) {
    let arr = Array.from({ length: size }, () => Math.floor(Math.random() * size * 10));
    
    switch (type) {
        case 'sorted': 
            return arr.sort((a, b) => a - b);
        case 'reversed': 
            return arr.sort((a, b) => b - a);
        case 'identical': 
            return Array(size).fill(77);
        default: 
            return arr; // випадкові числа
    }
}

function runBenchmark() {
    const size = parseInt(arraySizeSelect.value);
    const type = arrayTypeSelect.value;
    const testArray = generateTestData(size, type);
    
    runBtn.disabled = true;
    runBtn.textContent = 'Обробка алгоритмів...';
    resultsTable.innerHTML = '';

    // Список алгоритмів для тестування
    const algorithms = [
        { name: 'Bubble Sort (Бульбашка)', fn: sorts.bubbleSort },
        { name: 'Selection Sort (Вибором)', fn: sorts.selectionSort },
        { name: 'Insertion Sort (Вставками)', fn: sorts.insertionSort },
        { name: 'Merge Sort (Злиттям)', fn: sorts.mergeSort },
        { name: 'Quick Sort (Швидке)', fn: sorts.quickSort }
    ];

    // Використовуємо setTimeout, щоб інтерфейс не зависав під час важких розрахунків
    setTimeout(() => {
        algorithms.forEach(algo => {
            const stats = algo.fn(testArray);
            
            const row = `
                <tr>
                    <td><b>${algo.name}</b></td>
                    <td><span class="badge-size">${size}</span></td>
                    <td>${stats.comparisons.toLocaleString()}</td>
                    <td>${stats.swaps.toLocaleString()}</td>
                    <td><mark>${stats.duration} ms</mark></td>
                </tr>
            `;
            resultsTable.innerHTML += row;
        });

        runBtn.disabled = false;
        runBtn.textContent = 'Запустити аналіз';
    }, 50);
}

// Прив'язка події до кнопки
runBtn.onclick = runBenchmark;