/**
 * Система обробки замовлення їжі (Варіант 1)
 */

// Допоміжна функція для випадкової помилки (20% шанс)
const shouldFail = () => Math.random() < 0.2;

function logStatus(message, isError = false) {
    const statusEl = document.getElementById('statusLogs');
    const log = document.createElement('p');
    log.className = isError ? 'log-error' : 'log-info';
    log.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    statusEl.appendChild(log);
    console.log(message);
}

// Перевірка наявності
function checkAvailability(orderId) {
	const orderAmount = Math.floor(Math.random() * 400) + 200;
    return new Promise((resolve, reject) => {
        logStatus(`Перевірка наявності для замовлення #${orderId}...`);
        
        setTimeout(() => {
            if (shouldFail()) {
                reject(`Помилка: Товар за замовленням #${orderId} відсутній на складі.`);
            } else {
                logStatus("Товари в наявності.");
                resolve({ orderId, amount: orderAmount }); // Передаємо дані далі
            }
        }, 1000);
    });
}

// Резервування
function reserveItems(data) {
    return new Promise((resolve, reject) => {
        logStatus(`Резервування товарів для #${data.orderId}...`);
        
        setTimeout(() => {
            if (shouldFail()) {
                reject(`Помилка: Не вдалося зарезервувати товари для #${data.orderId}.`);
            } else {
                logStatus("Товари зарезервовано.");
                resolve(data);
            }
        }, 1000);
    });
}

// Оплата
function processPayment(data) {
    return new Promise((resolve, reject) => {
        logStatus(`Обробка оплати на суму ${data.amount} грн...`);
        
        setTimeout(() => {
            if (shouldFail()) {
                reject(`Помилка: Платіж для #${data.orderId} відхилено банком.`);
            } else {
                logStatus("Оплата успішна.");
                resolve(data.orderId);
            }
        }, 1500);
    });
}

// Доставка
function scheduleDelivery(orderId) {
    return new Promise((resolve, reject) => {
        logStatus(`Планування доставки для #${orderId}...`);
        
        setTimeout(() => {
            if (shouldFail()) {
                reject(`Помилка: Немає вільних кур'єрів для замовлення #${orderId}.`);
            } else {
                logStatus("Доставку призначено на сьогодні.");
                resolve(orderId);
            }
        }, 1000);
    });
}

// Головна функція запуску ланцюжка
function placeOrder() {
    const orderId = Math.floor(Math.random() * 9000) + 1000;
    const btn = document.getElementById('orderBtn');
    
    // Очищення попередніх логів
    document.getElementById('statusLogs').innerHTML = '';
    btn.disabled = true;

    // --- Ланцюжок ---
    checkAvailability(orderId)
        .then(result => reserveItems(result))        // Передаємо об'єкт далі
        .then(result => processPayment(result))      // Обробка оплати
        .then(id => scheduleDelivery(id))           // Планування доставки
        .then(id => {
            logStatus(`ЗАМОВЛЕННЯ #${id} ПОВНІСТЮ ОБРОБЛЕНО!`, false);
        })
        .catch(error => {
            logStatus(`КРИТИЧНА ПОМИЛКА: ${error}`, true);
        })
        .finally(() => {
            logStatus("Процес обробки завершено.");
            btn.disabled = false;
        });
}

document.getElementById('orderBtn').addEventListener('click', placeOrder);