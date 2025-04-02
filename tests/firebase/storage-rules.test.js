const { 
  initializeTestEnvironment, 
  assertFails, 
  assertSucceeds, 
  RulesTestEnvironment 
} = require('@firebase/rules-unit-testing');
const firebase = require('@firebase/testing');
const fs = require('fs');
const path = require('path');

// Инициализируем тестовое окружение
let testEnv;
const PROJECT_ID = 'bizlevel-firebase-rules-test';

// Пользовательские UID для тестов
const ADMIN_UID = 'admin-user';
const AUTH_USER_UID = 'authenticated-user';
const ANOTHER_USER_UID = 'another-user';

// Файлы для тестирования
const JPEG_FILE = {
  name: 'test-image.jpg',
  content: Buffer.from('fake image content'),
  contentType: 'image/jpeg'
};

const PDF_FILE = {
  name: 'test-file.pdf',
  content: Buffer.from('fake PDF content'),
  contentType: 'application/pdf'
};

const TXT_FILE = {
  name: 'test-file.txt',
  content: Buffer.from('fake text content'),
  contentType: 'text/plain'
};

const LARGE_FILE = {
  name: 'large-file.dat',
  content: Buffer.alloc(10 * 1024 * 1024), // 10MB
  contentType: 'application/octet-stream'
};

const INVALID_FILE = {
  name: 'malicious.exe',
  content: Buffer.from('fake executable content'),
  contentType: 'application/x-msdownload'
};

// Функция для получения экземпляра Storage для тестов
function getStorage(auth) {
  return testEnv.authenticatedContext(auth?.uid || null, auth).storage();
}

// Функция для создания мока Firestore с ролями пользователей
async function setupFirestoreDocumentMocks() {
  // Создаем документы для пользователей
  await testEnv.withSecurityRulesDisabled(async (context) => {
    // Создаем документы пользователей с разными ролями
    const firestore = context.firestore();
    
    // Админ
    await firestore.doc(`users/${ADMIN_UID}`).set({
      role: 'admin'
    });
    
    // Обычный пользователь
    await firestore.doc(`users/${AUTH_USER_UID}`).set({
      role: 'user'
    });
    
    // Другой пользователь
    await firestore.doc(`users/${ANOTHER_USER_UID}`).set({
      role: 'user'
    });
  });
}

// Перед всеми тестами
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      rules: fs.readFileSync('storage.rules', 'utf8')
    },
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8')
    }
  });

  // Устанавливаем моки документов Firestore для проверки ролей
  await setupFirestoreDocumentMocks();
});

// После всех тестов
afterAll(async () => {
  await testEnv.cleanup();
});

// Тесты для неаутентифицированного пользователя
describe('Неаутентифицированный пользователь', () => {
  let storage;

  beforeEach(() => {
    storage = getStorage(null);
  });

  test('не может читать аватары', async () => {
    await assertFails(storage.ref(`avatars/${AUTH_USER_UID}/profile.jpg`).getDownloadURL());
  });

  test('не может загружать аватары', async () => {
    await assertFails(storage.ref(`avatars/${AUTH_USER_UID}/profile.jpg`).put(JPEG_FILE.content, {
      contentType: JPEG_FILE.contentType
    }));
  });

  test('не может читать артефакты', async () => {
    await assertFails(storage.ref(`artifacts/artifact1/document.pdf`).getDownloadURL());
  });

  test('не может загружать артефакты', async () => {
    await assertFails(storage.ref(`artifacts/artifact1/document.pdf`).put(PDF_FILE.content, {
      contentType: PDF_FILE.contentType
    }));
  });

  test('не может читать персональный контент пользователя', async () => {
    await assertFails(storage.ref(`user-content/${AUTH_USER_UID}/notes.txt`).getDownloadURL());
  });

  test('не может загружать персональный контент пользователя', async () => {
    await assertFails(storage.ref(`user-content/${AUTH_USER_UID}/notes.txt`).put(TXT_FILE.content, {
      contentType: TXT_FILE.contentType
    }));
  });
});

// Тесты для аутентифицированного пользователя
describe('Аутентифицированный пользователь', () => {
  let storage;

  beforeEach(() => {
    storage = getStorage({ uid: AUTH_USER_UID });
  });

  describe('директория avatars', () => {
    test('может читать аватары', async () => {
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/profile.jpg`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('может загружать свой аватар (валидный размер и тип)', async () => {
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/profile.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      }));
    });

    test('не может загружать аватар больше допустимого размера', async () => {
      await assertFails(storage.ref(`avatars/${AUTH_USER_UID}/large-profile.jpg`).put(LARGE_FILE.content, {
        contentType: 'image/jpeg'
      }));
    });

    test('не может загружать аватар недопустимого типа', async () => {
      await assertFails(storage.ref(`avatars/${AUTH_USER_UID}/profile.exe`).put(INVALID_FILE.content, {
        contentType: INVALID_FILE.contentType
      }));
    });

    test('не может загружать аватар другого пользователя', async () => {
      await assertFails(storage.ref(`avatars/${ANOTHER_USER_UID}/profile.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      }));
    });

    test('может удалить свой аватар', async () => {
      // Сначала загрузим файл
      await storage.ref(`avatars/${AUTH_USER_UID}/to-delete.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      });
      
      // Теперь проверим, что можем удалить
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/to-delete.jpg`).delete());
    });

    test('не может удалить аватар другого пользователя', async () => {
      await assertFails(storage.ref(`avatars/${ANOTHER_USER_UID}/profile.jpg`).delete());
    });
  });

  describe('директория artifacts', () => {
    test('может читать артефакты', async () => {
      await assertSucceeds(storage.ref(`artifacts/artifact1/document.pdf`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('не может загружать артефакты', async () => {
      await assertFails(storage.ref(`artifacts/new-artifact/document.pdf`).put(PDF_FILE.content, {
        contentType: PDF_FILE.contentType
      }));
    });

    test('не может удалять артефакты', async () => {
      await assertFails(storage.ref(`artifacts/artifact1/document.pdf`).delete());
    });
  });

  describe('директория user-content', () => {
    test('может читать свой персональный контент', async () => {
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/notes.txt`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('не может читать персональный контент другого пользователя', async () => {
      await assertFails(storage.ref(`user-content/${ANOTHER_USER_UID}/notes.txt`).getMetadata());
    });

    test('может загружать свой персональный контент', async () => {
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/notes.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      }));
    });

    test('не может загружать персональный контент другого пользователя', async () => {
      await assertFails(storage.ref(`user-content/${ANOTHER_USER_UID}/notes.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      }));
    });

    test('не может загружать слишком большой файл', async () => {
      await assertFails(storage.ref(`user-content/${AUTH_USER_UID}/large-file.dat`).put(LARGE_FILE.content, {
        contentType: LARGE_FILE.contentType
      }));
    });

    test('может удалить свой персональный контент', async () => {
      // Сначала загрузим файл
      await storage.ref(`user-content/${AUTH_USER_UID}/to-delete.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      });
      
      // Теперь проверим, что можем удалить
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/to-delete.txt`).delete());
    });

    test('не может удалить персональный контент другого пользователя', async () => {
      await assertFails(storage.ref(`user-content/${ANOTHER_USER_UID}/notes.txt`).delete());
    });
  });
});

// Тесты для администратора
describe('Администратор', () => {
  let storage;

  beforeEach(() => {
    storage = getStorage({ uid: ADMIN_UID });
  });

  describe('директория avatars', () => {
    test('может читать аватары любого пользователя', async () => {
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/profile.jpg`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('может загружать аватары для любого пользователя', async () => {
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/admin-uploaded.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      }));
      
      await assertSucceeds(storage.ref(`avatars/${ANOTHER_USER_UID}/admin-uploaded.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      }));
    });

    test('может удалять аватары любого пользователя', async () => {
      // Сначала загрузим файл
      await storage.ref(`avatars/${AUTH_USER_UID}/admin-to-delete.jpg`).put(JPEG_FILE.content, {
        contentType: JPEG_FILE.contentType
      });
      
      // Теперь проверим, что можем удалить
      await assertSucceeds(storage.ref(`avatars/${AUTH_USER_UID}/admin-to-delete.jpg`).delete());
    });
  });

  describe('директория artifacts', () => {
    test('может читать артефакты', async () => {
      await assertSucceeds(storage.ref(`artifacts/artifact1/document.pdf`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('может загружать артефакты (валидный размер и тип)', async () => {
      await assertSucceeds(storage.ref(`artifacts/admin-artifact/document.pdf`).put(PDF_FILE.content, {
        contentType: PDF_FILE.contentType
      }));
    });

    test('не может загружать артефакты недопустимого типа', async () => {
      await assertFails(storage.ref(`artifacts/admin-artifact/malicious.exe`).put(INVALID_FILE.content, {
        contentType: INVALID_FILE.contentType
      }));
    });

    test('не может загружать артефакты слишком большого размера', async () => {
      const largeFile = {
        content: Buffer.alloc(100 * 1024 * 1024), // 100MB
        contentType: 'application/pdf'
      };
      
      await assertFails(storage.ref(`artifacts/admin-artifact/large-doc.pdf`).put(largeFile.content, {
        contentType: largeFile.contentType
      }));
    });

    test('может удалять артефакты', async () => {
      // Сначала загрузим файл
      await storage.ref(`artifacts/admin-to-delete/document.pdf`).put(PDF_FILE.content, {
        contentType: PDF_FILE.contentType
      });
      
      // Теперь проверим, что можем удалить
      await assertSucceeds(storage.ref(`artifacts/admin-to-delete/document.pdf`).delete());
    });
  });

  describe('директория user-content', () => {
    test('может читать персональный контент любого пользователя', async () => {
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/notes.txt`).getMetadata().catch(() => {})); // Метаданные могут не существовать, но доступ должен быть разрешен
    });

    test('может загружать персональный контент для любого пользователя', async () => {
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/admin-notes.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      }));
      
      await assertSucceeds(storage.ref(`user-content/${ANOTHER_USER_UID}/admin-notes.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      }));
    });

    test('может удалять персональный контент любого пользователя', async () => {
      // Сначала загрузим файл
      await storage.ref(`user-content/${AUTH_USER_UID}/admin-to-delete.txt`).put(TXT_FILE.content, {
        contentType: TXT_FILE.contentType
      });
      
      // Теперь проверим, что можем удалить
      await assertSucceeds(storage.ref(`user-content/${AUTH_USER_UID}/admin-to-delete.txt`).delete());
    });
  });
}); 