const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Проверка наличия сервисного аккаунта
const serviceAccountPath = path.join(__dirname, '../../service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Ошибка: Файл service-account.json не найден');
  console.error('Создайте файл service-account.json в корне проекта с данными сервисного аккаунта Firebase');
  process.exit(1);
}

// Инициализация Firebase Admin
const serviceAccount = require(serviceAccountPath);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

/**
 * Устанавливает роль 'admin' для пользователя по email
 * @param {string} email Email пользователя
 */
async function setAdminRole(email) {
  try {
    // Находим пользователя по email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`Пользователь с email ${email} не найден в базе данных`);
      process.exit(1);
    }

    // Получаем документ пользователя
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Обновляем роль пользователя
    await db.collection('users').doc(userDoc.id).update({
      role: 'admin'
    });

    console.log(`✅ Пользователю ${userData.displayName || email} (${email}) успешно установлена роль 'admin'`);
    console.log(`ID пользователя: ${userDoc.id}`);
  } catch (error) {
    console.error('Ошибка при установке роли admin:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Получаем email из аргументов командной строки
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Ошибка: Не указан email пользователя');
  console.error('Использование: node set-admin-role.js user@example.com');
  process.exit(1);
}

const email = args[0];

// Запуск функции
setAdminRole(email); 