const { 
  initializeTestEnvironment, 
  assertFails, 
  assertSucceeds, 
  RulesTestEnvironment 
} = require('@firebase/rules-unit-testing');
const { getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Инициализируем тестовое окружение
let testEnv;
const PROJECT_ID = 'bizlevel-firebase-rules-test';

// Пользовательские UID для тестов
const ADMIN_UID = 'admin-user';
const AUTH_USER_UID = 'authenticated-user';
const ANOTHER_USER_UID = 'another-user';

// Функция для получения экземпляра Firestore для тестов
function getFirestore(auth) {
  return testEnv.authenticatedContext(auth?.uid || null, auth).firestore();
}

// Функция для настройки тестовых данных
async function setupTestData() {
  // Создаем администратора
  const adminDb = getFirestore({ uid: ADMIN_UID });
  await setDoc(adminDb.collection('users').doc(ADMIN_UID), {
    email: 'admin@example.com',
    displayName: 'Admin User',
    photoURL: null,
    createdAt: new Date(),
    role: 'admin',
    settings: { theme: 'dark', notificationsEnabled: true }
  });

  // Создаем обычного пользователя
  const userDb = getFirestore({ uid: AUTH_USER_UID });
  await setDoc(userDb.collection('users').doc(AUTH_USER_UID), {
    email: 'user@example.com',
    displayName: 'Regular User',
    photoURL: null,
    createdAt: new Date(),
    role: 'user',
    settings: { theme: 'light', notificationsEnabled: true }
  });

  // Создаем другого пользователя
  await setDoc(adminDb.collection('users').doc(ANOTHER_USER_UID), {
    email: 'another@example.com',
    displayName: 'Another User',
    photoURL: null,
    createdAt: new Date(),
    role: 'user',
    settings: { theme: 'system', notificationsEnabled: false }
  });

  // Создаем тестовый прогресс для пользователя
  await setDoc(userDb.collection('userProgress').doc(AUTH_USER_UID), {
    userId: AUTH_USER_UID,
    currentLevelId: 'level1',
    completedLevelIds: [],
    watchedVideoIds: [],
    completedTestIds: [],
    downloadedArtifactIds: []
  });

  // Создаем тестовый уровень
  await setDoc(adminDb.collection('levels').doc('level1'), {
    title: 'Level 1',
    description: 'Test Level',
    order: 1,
    videoContent: [],
    tests: [],
    relatedArtifactIds: []
  });

  // Создаем тестовый артефакт
  await setDoc(adminDb.collection('artifacts').doc('artifact1'), {
    title: 'Test Artifact',
    description: 'Test Artifact Description',
    fileURL: 'https://example.com/file.pdf',
    fileName: 'file.pdf',
    fileType: 'application/pdf',
    levelId: 'level1',
    downloadCount: 0
  });

  // Создаем тестовый FAQ
  await setDoc(adminDb.collection('faq').doc('faq1'), {
    question: 'Test Question',
    answer: 'Test Answer',
    category: 'General',
    order: 1
  });

  // Создаем тестовые сообщения чата
  await setDoc(userDb.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'), {
    role: 'user',
    content: 'Test message',
    timestamp: new Date()
  });
}

// Перед всеми тестами
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8')
    }
  });

  // Устанавливаем начальные данные
  await setupTestData();
});

// После всех тестов
afterAll(async () => {
  await testEnv.cleanup();
});

// Тесты для неаутентифицированного пользователя
describe('Неаутентифицированный пользователь', () => {
  let db;

  beforeEach(() => {
    db = getFirestore(null);
  });

  test('не может читать профили пользователей', async () => {
    await assertFails(getDoc(db.collection('users').doc(AUTH_USER_UID)));
  });

  test('не может создавать профили пользователей', async () => {
    await assertFails(setDoc(db.collection('users').doc('new-user'), {
      email: 'new@example.com',
      displayName: 'New User',
      photoURL: null,
      createdAt: new Date(),
      role: 'user',
      settings: { theme: 'light', notificationsEnabled: true }
    }));
  });

  test('не может читать данные прогресса пользователей', async () => {
    await assertFails(getDoc(db.collection('userProgress').doc(AUTH_USER_UID)));
  });

  test('не может читать уровни', async () => {
    await assertFails(getDoc(db.collection('levels').doc('level1')));
  });

  test('не может читать артефакты', async () => {
    await assertFails(getDoc(db.collection('artifacts').doc('artifact1')));
  });

  test('может читать FAQ', async () => {
    await assertSucceeds(getDoc(db.collection('faq').doc('faq1')));
  });

  test('не может читать сообщения чата', async () => {
    await assertFails(
      getDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'))
    );
  });
});

// Тесты для авторизованного пользователя
describe('Авторизованный пользователь', () => {
  let db;

  beforeEach(() => {
    db = getFirestore({ uid: AUTH_USER_UID });
  });

  // Тесты для коллекции users
  describe('коллекция users', () => {
    test('может читать свой профиль', async () => {
      await assertSucceeds(getDoc(db.collection('users').doc(AUTH_USER_UID)));
    });

    test('не может читать профили других пользователей', async () => {
      await assertFails(getDoc(db.collection('users').doc(ANOTHER_USER_UID)));
    });

    test('может обновлять свой профиль', async () => {
      await assertSucceeds(updateDoc(db.collection('users').doc(AUTH_USER_UID), {
        displayName: 'Updated Name'
      }));
    });

    test('не может менять свою роль', async () => {
      await assertFails(updateDoc(db.collection('users').doc(AUTH_USER_UID), {
        role: 'admin'
      }));
    });

    test('не может обновлять профили других пользователей', async () => {
      await assertFails(updateDoc(db.collection('users').doc(ANOTHER_USER_UID), {
        displayName: 'Hacked Name'
      }));
    });

    test('не может удалять профили пользователей', async () => {
      await assertFails(deleteDoc(db.collection('users').doc(ANOTHER_USER_UID)));
    });
  });

  // Тесты для коллекции userProgress
  describe('коллекция userProgress', () => {
    test('может читать свой прогресс', async () => {
      await assertSucceeds(getDoc(db.collection('userProgress').doc(AUTH_USER_UID)));
    });

    test('не может читать прогресс других пользователей', async () => {
      await assertFails(getDoc(db.collection('userProgress').doc(ANOTHER_USER_UID)));
    });

    test('может обновлять свой прогресс', async () => {
      await assertSucceeds(updateDoc(db.collection('userProgress').doc(AUTH_USER_UID), {
        completedLevelIds: ['level1']
      }));
    });

    test('не может обновлять прогресс других пользователей', async () => {
      await assertFails(updateDoc(db.collection('userProgress').doc(ANOTHER_USER_UID), {
        completedLevelIds: ['level1']
      }));
    });
  });

  // Тесты для коллекции levels
  describe('коллекция levels', () => {
    test('может читать уровни', async () => {
      await assertSucceeds(getDoc(db.collection('levels').doc('level1')));
    });

    test('не может создавать, обновлять или удалять уровни', async () => {
      await assertFails(setDoc(db.collection('levels').doc('new-level'), {
        title: 'New Level',
        description: 'Test Level',
        order: 2
      }));

      await assertFails(updateDoc(db.collection('levels').doc('level1'), {
        title: 'Updated Level'
      }));

      await assertFails(deleteDoc(db.collection('levels').doc('level1')));
    });
  });

  // Тесты для коллекции artifacts
  describe('коллекция artifacts', () => {
    test('может читать артефакты', async () => {
      await assertSucceeds(getDoc(db.collection('artifacts').doc('artifact1')));
    });

    test('не может создавать, обновлять или удалять артефакты', async () => {
      await assertFails(setDoc(db.collection('artifacts').doc('new-artifact'), {
        title: 'New Artifact',
        description: 'Description',
        fileURL: 'https://example.com/file.pdf',
        fileName: 'file.pdf',
        fileType: 'application/pdf',
        levelId: 'level1',
        downloadCount: 0
      }));

      await assertFails(updateDoc(db.collection('artifacts').doc('artifact1'), {
        title: 'Updated Artifact'
      }));

      await assertFails(deleteDoc(db.collection('artifacts').doc('artifact1')));
    });

    test('может инкрементировать downloadCount', async () => {
      await assertSucceeds(updateDoc(db.collection('artifacts').doc('artifact1'), {
        downloadCount: 1 // Увеличиваем с 0 до 1
      }));
    });

    test('не может изменять другие поля при инкременте downloadCount', async () => {
      await assertFails(updateDoc(db.collection('artifacts').doc('artifact1'), {
        downloadCount: 2,
        title: 'Sneaky Update'
      }));
    });

    test('не может устанавливать произвольное значение downloadCount', async () => {
      await assertFails(updateDoc(db.collection('artifacts').doc('artifact1'), {
        downloadCount: 100
      }));
    });
  });

  // Тесты для коллекции faq
  describe('коллекция faq', () => {
    test('может читать FAQ', async () => {
      await assertSucceeds(getDoc(db.collection('faq').doc('faq1')));
    });

    test('не может создавать, обновлять или удалять FAQ', async () => {
      await assertFails(setDoc(db.collection('faq').doc('new-faq'), {
        question: 'New Question',
        answer: 'New Answer',
        category: 'General',
        order: 2
      }));

      await assertFails(updateDoc(db.collection('faq').doc('faq1'), {
        answer: 'Updated Answer'
      }));

      await assertFails(deleteDoc(db.collection('faq').doc('faq1')));
    });
  });

  // Тесты для коллекции chats
  describe('коллекция chats', () => {
    test('может читать свои сообщения', async () => {
      await assertSucceeds(
        getDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'))
      );
    });

    test('не может читать чужие сообщения', async () => {
      await assertFails(
        getDoc(db.collection('chats').doc(ANOTHER_USER_UID).collection('messages').doc('message1'))
      );
    });

    test('может создавать свои сообщения', async () => {
      await assertSucceeds(
        setDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('new-message'), {
          role: 'user',
          content: 'New message',
          timestamp: new Date()
        })
      );
    });

    test('не может создавать сообщения для других пользователей', async () => {
      await assertFails(
        setDoc(db.collection('chats').doc(ANOTHER_USER_UID).collection('messages').doc('new-message'), {
          role: 'user',
          content: 'New message',
          timestamp: new Date()
        })
      );
    });

    test('не может создавать сообщения с недопустимой ролью', async () => {
      await assertFails(
        setDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('new-message'), {
          role: 'invalid',
          content: 'New message',
          timestamp: new Date()
        })
      );
    });

    test('не может обновлять свои сообщения', async () => {
      await assertFails(
        updateDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'), {
          content: 'Updated message'
        })
      );
    });
  });
});

// Тесты для администратора
describe('Администратор', () => {
  let db;

  beforeEach(() => {
    db = getFirestore({ uid: ADMIN_UID });
  });

  // Тесты для коллекции users
  describe('коллекция users', () => {
    test('может читать любые профили', async () => {
      await assertSucceeds(getDoc(db.collection('users').doc(AUTH_USER_UID)));
      await assertSucceeds(getDoc(db.collection('users').doc(ANOTHER_USER_UID)));
    });

    test('может обновлять любые профили', async () => {
      await assertSucceeds(updateDoc(db.collection('users').doc(AUTH_USER_UID), {
        displayName: 'Admin Updated'
      }));
    });

    test('может менять роли пользователей', async () => {
      await assertSucceeds(updateDoc(db.collection('users').doc(AUTH_USER_UID), {
        role: 'admin'
      }));
    });

    test('может удалять профили пользователей', async () => {
      await assertSucceeds(deleteDoc(db.collection('users').doc(ANOTHER_USER_UID)));
    });
  });

  // Тесты для коллекции userProgress
  describe('коллекция userProgress', () => {
    test('может читать любой прогресс', async () => {
      await assertSucceeds(getDoc(db.collection('userProgress').doc(AUTH_USER_UID)));
    });

    test('может обновлять любой прогресс', async () => {
      await assertSucceeds(updateDoc(db.collection('userProgress').doc(AUTH_USER_UID), {
        completedLevelIds: ['level1', 'level2']
      }));
    });

    test('может удалять прогресс пользователей', async () => {
      await assertSucceeds(deleteDoc(db.collection('userProgress').doc(AUTH_USER_UID)));
    });
  });

  // Тесты для коллекции levels
  describe('коллекция levels', () => {
    test('может читать уровни', async () => {
      await assertSucceeds(getDoc(db.collection('levels').doc('level1')));
    });

    test('может создавать, обновлять и удалять уровни', async () => {
      await assertSucceeds(setDoc(db.collection('levels').doc('admin-level'), {
        title: 'Admin Level',
        description: 'Created by admin',
        order: 3
      }));

      await assertSucceeds(updateDoc(db.collection('levels').doc('level1'), {
        title: 'Admin Updated Level'
      }));

      await assertSucceeds(deleteDoc(db.collection('levels').doc('admin-level')));
    });
  });

  // Тесты для коллекции artifacts
  describe('коллекция artifacts', () => {
    test('может читать артефакты', async () => {
      await assertSucceeds(getDoc(db.collection('artifacts').doc('artifact1')));
    });

    test('может создавать, обновлять и удалять артефакты', async () => {
      await assertSucceeds(setDoc(db.collection('artifacts').doc('admin-artifact'), {
        title: 'Admin Artifact',
        description: 'Created by admin',
        fileURL: 'https://example.com/admin.pdf',
        fileName: 'admin.pdf',
        fileType: 'application/pdf',
        levelId: 'level1',
        downloadCount: 0
      }));

      await assertSucceeds(updateDoc(db.collection('artifacts').doc('artifact1'), {
        title: 'Admin Updated Artifact',
        downloadCount: 100 // Админ может устанавливать любое значение
      }));

      await assertSucceeds(deleteDoc(db.collection('artifacts').doc('admin-artifact')));
    });
  });

  // Тесты для коллекции chats
  describe('коллекция chats', () => {
    test('может читать любые сообщения', async () => {
      await assertSucceeds(
        getDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'))
      );
    });

    test('может создавать сообщения для любого пользователя', async () => {
      await assertSucceeds(
        setDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('admin-message'), {
          role: 'assistant',
          content: 'Admin message',
          timestamp: new Date()
        })
      );
    });

    test('может обновлять любые сообщения', async () => {
      await assertSucceeds(
        updateDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'), {
          content: 'Admin updated message'
        })
      );
    });

    test('может удалять любые сообщения', async () => {
      await assertSucceeds(
        deleteDoc(db.collection('chats').doc(AUTH_USER_UID).collection('messages').doc('message1'))
      );
    });
  });
}); 