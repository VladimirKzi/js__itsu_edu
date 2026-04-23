import { chain, memoize, curry, pipe, compose, myReduce, myFilter, myMap } from './hof.js';

// --- 1. Chain Demo ---
const numbers = [1, 2, 3, 4, 5, 6];
const chainResult = chain(numbers)
    .filter(n => n % 2 === 0)
    .map(n => n * n)
    .value();

const chainEl = document.getElementById('chainOutput');
if (chainEl) chainEl.textContent = `Результат: [${chainResult.join(', ')}]`;

// --- 2. Memoize Demo ---
const slowFib = (n) => (n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2));
const fastFib = memoize(slowFib);

const btn = document.getElementById('runFib');
const fibOut = document.getElementById('fibOutput');

if (btn && fibOut) {
    btn.onclick = () => {
        fibOut.textContent = "Обчислюю перший раз...";
        
        setTimeout(() => {
            const t1 = performance.now();
            const res1 = fastFib(35);
            const t2 = performance.now();

            const t3 = performance.now();
            const res2 = fastFib(35);
            const t4 = performance.now();

            fibOut.textContent = `Результат: ${res1}\n`;
            fibOut.textContent += `Перший виклик: ${(t2 - t1).toFixed(2)} ms\n`;
            fibOut.textContent += `Другий виклик (КЕШ): ${(t4 - t3).toFixed(2)} ms`;
        }, 50);
    };
}

// --- 3. Pipe & Curry Demo ---
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

const addTen = curry(add)(10);
const double = curry(multiply)(2);

const process = pipe(addTen, double);
const pipeEl = document.getElementById('pipeOutput');
if (pipeEl) pipeEl.textContent = `Вхід: 5 -> (5 + 10) * 2 = ${process(5)}`;

const users = [
    { name: 'Олексій', age: 25, role: 'admin' },
    { name: 'Марія', age: 19, role: 'user' },
    { name: 'Іван', age: 32, role: 'user' },
    { name: 'Анна', age: 28, role: 'admin' }
];

const adminNames = chain(users)
    .filter(u => u.role === 'admin')
    .map(u => u.name)
    .value();

console.log('Адміни chain:', adminNames);

console.log('Результат Pipe (5):', process(5));
const processCompose = compose(addTen, double);
console.log('Результат compose (5):', processCompose(5));

const expensiveCalculation = (n) => {
    console.log('Виконую складне обчислення...');
    return n * n;
};

const memoCalc = memoize(expensiveCalculation);
console.log('Результат memoize (5):', memoCalc(5));

const nums = [1, 2, 3];
const doubles = myMap(nums, n => n * 2);
console.log('myMap([1, 2, 3]) * 2:', doubles);

const tasks = [
    { id: 1, status: 'todo' },
    { id: 2, status: 'inprogress' },
    { id: 3, status: 'todo' },
    { id: 4, status: 'done' },
    { id: 5, status: 'inprogress' }
];

const stats = myReduce(tasks, (acc, task) => {
    const status = task.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
}, {});

console.log('myReduce(Статистика):', stats);