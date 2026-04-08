import { createUserManager } from './UserManager.js';

// 1. Ініціалізуємо менеджер
const manager = createUserManager();

console.log('Створення користувачів');

// 2. Створюємо адміна
const admin = manager.createUser({
    name: 'Adm',
    email: 'admin@test.com',
    role: 'admin'
});
console.log('Додано адміна:', admin.getInfo());

// 3. Створюємо звичайного користувача
const user = manager.createUser({
    name: 'Test',
    email: 'Test@test.com',
    role: 'user'
});
console.log('Додано юзера:', user.getInfo());

console.log('\nПеревірка незмінності');

// 4. Спроба змінити ID (яка не повинна спрацювати для оригіналу в базі)
console.log('Спробуємо змінити ID для Test через updateProfile...');
const hackedUser = user.updateProfile({ id: '999', name: 'Test Update' });

console.log('Об’єкт, який повернув метод (ID не змінився):', hackedUser.id); 
// Завдяки логіці { ...newData, id: this.id } у User.js

const userInDb = manager.getUser(user.id);
console.log('Перевірка в базі (ID все ще):', userInDb.id);

console.log('\nПеревірка валідації email');
try{
const userValidEmail = manager.createUser({
	name: 'Bad',
	email: 'bad.test.com',
	role: 'user'
});;
} catch(e){
    console.log('Валідація email:', e.message);
}

console.log('\nФільтрація та пошук');

// 5. Отримуємо тільки адмінів
const admins = manager.getUsersByRole('admin');
console.log(`Знайдено адмінів (${admins.length}):`, admins.map(a => a.name));

// 6. Список усіх через Object.values
const allUsers = manager.getAllUsers();
console.log('Всі користувачі в системі:');
allUsers.forEach(u => {
    console.log(`- ${u.name} [ID: ${u.id}]`);
});

console.log('\nВидалення користувача');

const deleteUser = manager.deleteUser(2);
console.log('Видалення користувача (ID: 2):', deleteUser); 

// 7. Список усіх після видалення одного
const allUsers2 = manager.getAllUsers();
console.log('Всі користувачі після видалення одного:');
allUsers2.forEach(u => {
    console.log(`- ${u.name} [ID: ${u.id}]`);
});