import { Car, Truck, Motorcycle, Fleet } from './logic.js';

const myFleet = new Fleet();

// Елементи форми та фільтрів
const form = document.getElementById('addForm');
const fleetDisplay = document.getElementById('fleetGrid');
const statsEl = document.getElementById('stats');

// Поля фільтрації
const filterType = document.getElementById('fType');
const filterYear = document.getElementById('fYear');
const filterMileage = document.getElementById('fMileage');

// Додавання нового транспорту
form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    let v;
    
    const type = data.get('type');
    const brand = data.get('brand');
    const model = data.get('model');
    const year = data.get('year');
    const mileage = data.get('mileage');
    const extra = data.get('extra');

    if (type === 'Car') v = new Car(brand, model, year, mileage, extra);
    else if (type === 'Truck') v = new Truck(brand, model, year, mileage, extra);
    else v = new Motorcycle(brand, model, year, mileage, extra);

    myFleet.add(v);
    render();
    form.reset();
};

// Головна функція фільтрації та відображення
function render() {
    const type = filterType.value;
    const minYear = parseInt(filterYear.value) || 0;
    const maxMil = parseInt(filterMileage.value) || Infinity;

    const filtered = myFleet.all.filter(v => {
        const tMatch = type === 'all' || v.type === type;
        const yMatch = v.year >= minYear;
        const mMatch = v.mileage <= maxMil;
        return tMatch && yMatch && mMatch;
    });

    fleetDisplay.innerHTML = filtered.map(v => `
        <div class="card">
            <h4>${v.brand} ${v.model}</h4>
            <p>Рік: ${v.year} | Тип: ${v.type}</p>
            <p>Пробіг: ${v.mileage} км</p>
            <p class="price">Сервіс: ${v.getMaintenance().toFixed(0)} грн</p>
        </div>
    `).join('');

    updateStats(filtered);
}

function updateStats(list) {
	const stats = myFleet.getStats();
    statsEl.innerHTML = `Знайдено: <b>${stats.total}</b> | Сер. пробіг: <b>${stats.avgMileage} км</b>| Загальна вартість сервісу: <b>${stats.totalCost} грн</b>`;
}

// Слухачі для миттєвої фільтрації
[filterType, filterYear, filterMileage].forEach(el => el.oninput = render);