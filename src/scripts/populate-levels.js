/**
 * Script for populating Firestore with test levels data for BizLevel
 * 
 * This script adds test levels with video content, tests, and artifacts to Firestore
 * It uses Firebase Admin SDK to connect to Firestore
 * 
 * Usage:
 * 1. Create a service account key from Firebase console
 * 2. Save the key as serviceAccountKey.json in the src/scripts directory
 * 3. Run the script: node src/scripts/populate-levels.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Skills used in the application (matching the SkillType enum in types/index.ts)
const SkillType = {
  Marketing: 'Marketing',
  Finance: 'Finance',
  Management: 'Management',
  Leadership: 'Leadership',
  Communication: 'Communication',
  Sales: 'Sales'
};

// Path to service account key
let serviceAccount;
try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  serviceAccount = require(serviceAccountPath);
  console.log('✅ Service account key loaded successfully.');
} catch (error) {
  console.error('❌ Error loading service account key:');
  console.error('Make sure you have a valid serviceAccountKey.json file in the src/scripts directory.');
  console.error('You can get this file from Firebase Console > Project Settings > Service accounts > Generate new private key');
  console.error(error);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully.');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();
console.log('✅ Firestore connection established.');

// Helper function to generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Function to create test data
async function createTestData() {
  try {
    console.log('🚀 Starting to populate Firestore with test data...');
    
    // Create test levels
    const levels = [
      {
        id: 'level-1',
        title: 'Основы бизнес-мышления',
        description: 'Введение в основные концепции бизнес-мышления и развитие предпринимательского мышления.',
        order: 1,
        videoContent: [
          {
            id: generateId('video'),
            title: 'Что такое бизнес-мышление',
            url: 'https://www.youtube.com/embed/jNWBHw-QGTk',
            duration: 195 // 3:15 minutes
          },
          {
            id: generateId('video'),
            title: 'Ключевые элементы предпринимательского мышления',
            url: 'https://www.youtube.com/embed/2QjHcXlY7gY',
            duration: 240 // 4:00 minutes
          },
          {
            id: generateId('video'),
            title: 'Выявление бизнес-возможностей',
            url: 'https://www.youtube.com/embed/n4MbHPBh2Hg',
            duration: 180 // 3:00 minutes
          }
        ],
        tests: [
          {
            id: generateId('test'),
            title: 'Основы бизнес-мышления',
            questions: [
              {
                id: generateId('question'),
                text: 'Что из перечисленного является ключевым элементом бизнес-мышления?',
                type: 'single-choice',
                options: [
                  'Следование только проверенным идеям',
                  'Стремление избегать любых рисков',
                  'Способность видеть возможности там, где другие видят проблемы',
                  'Ориентация только на краткосрочную прибыль'
                ],
                correctAnswer: 'Способность видеть возможности там, где другие видят проблемы'
              },
              {
                id: generateId('question'),
                text: 'Выберите все характеристики предпринимательского мышления:',
                type: 'multiple-choice',
                options: [
                  'Инновационность',
                  'Избегание рисков любой ценой',
                  'Гибкость и адаптивность',
                  'Строгое следование традициям',
                  'Проактивность'
                ],
                correctAnswer: ['Инновационность', 'Гибкость и адаптивность', 'Проактивность']
              }
            ]
          }
        ],
        relatedArtifactIds: [
          'artifact-level1-checklist',
          'artifact-level1-template'
        ],
        completionCriteria: {
          videosRequired: 2,
          testsRequired: 1
        },
        skillFocus: [SkillType.Leadership, SkillType.Management]
      },
      
      {
        id: 'level-2',
        title: 'Финансовая грамотность',
        description: 'Изучение основ финансовой грамотности для эффективного управления бизнесом.',
        order: 2,
        videoContent: [
          {
            id: generateId('video'),
            title: 'Основы финансового планирования',
            url: 'https://www.youtube.com/embed/krjCBFJiutE',
            duration: 210 // 3:30 minutes
          },
          {
            id: generateId('video'),
            title: 'Как читать финансовые отчеты',
            url: 'https://www.youtube.com/embed/IM1XKxNJj3U',
            duration: 255 // 4:15 minutes
          },
          {
            id: generateId('video'),
            title: 'Управление денежными потоками',
            url: 'https://www.youtube.com/embed/HarOOcCX_Qk',
            duration: 195 // 3:15 minutes
          }
        ],
        tests: [
          {
            id: generateId('test'),
            title: 'Финансовое планирование',
            questions: [
              {
                id: generateId('question'),
                text: 'Какой из следующих финансовых отчетов показывает финансовое положение компании в определенный момент времени?',
                type: 'single-choice',
                options: [
                  'Отчет о прибылях и убытках',
                  'Баланс',
                  'Отчет о движении денежных средств',
                  'Отчет об изменениях капитала'
                ],
                correctAnswer: 'Баланс'
              },
              {
                id: generateId('question'),
                text: 'Какие из следующих пунктов относятся к положительному денежному потоку?',
                type: 'multiple-choice',
                options: [
                  'Выплата заработной платы сотрудникам',
                  'Получение оплаты от клиентов',
                  'Оплата налогов',
                  'Продажа активов',
                  'Выплата дивидендов акционерам'
                ],
                correctAnswer: ['Получение оплаты от клиентов', 'Продажа активов']
              }
            ]
          },
          {
            id: generateId('test'),
            title: 'Анализ финансовых показателей',
            questions: [
              {
                id: generateId('question'),
                text: 'Какой показатель отражает способность компании погашать краткосрочные обязательства?',
                type: 'single-choice',
                options: [
                  'Рентабельность активов (ROA)',
                  'Коэффициент текущей ликвидности',
                  'Чистая прибыль',
                  'Коэффициент долга к собственному капиталу'
                ],
                correctAnswer: 'Коэффициент текущей ликвидности'
              }
            ]
          }
        ],
        relatedArtifactIds: [
          'artifact-level2-spreadsheet',
          'artifact-level2-guide'
        ],
        completionCriteria: {
          videosRequired: 2,
          testsRequired: 1
        },
        skillFocus: [SkillType.Finance, SkillType.Management]
      },
      
      {
        id: 'level-3',
        title: 'Маркетинг и продажи',
        description: 'Изучение современных методов маркетинга и эффективных техник продаж.',
        order: 3,
        videoContent: [
          {
            id: generateId('video'),
            title: 'Основы цифрового маркетинга',
            url: 'https://www.youtube.com/embed/kfJnJM28wu8',
            duration: 225 // 3:45 minutes
          },
          {
            id: generateId('video'),
            title: 'Стратегии целевого маркетинга',
            url: 'https://www.youtube.com/embed/3tvmCTma7I4',
            duration: 210 // 3:30 minutes
          },
          {
            id: generateId('video'),
            title: 'Психология продаж',
            url: 'https://www.youtube.com/embed/WVFSXVoQdkA',
            duration: 195 // 3:15 minutes
          },
          {
            id: generateId('video'),
            title: 'Построение воронки продаж',
            url: 'https://www.youtube.com/embed/GG99PeXJJoY',
            duration: 240 // 4:00 minutes
          }
        ],
        tests: [
          {
            id: generateId('test'),
            title: 'Основы маркетинга',
            questions: [
              {
                id: generateId('question'),
                text: 'Какой из следующих каналов относится к цифровому маркетингу?',
                type: 'multiple-choice',
                options: [
                  'Телевизионная реклама',
                  'Печатная реклама в газетах',
                  'Email-маркетинг',
                  'Билборды на улицах',
                  'Контекстная реклама'
                ],
                correctAnswer: ['Email-маркетинг', 'Контекстная реклама']
              },
              {
                id: generateId('question'),
                text: 'Что такое воронка продаж?',
                type: 'single-choice',
                options: [
                  'Инструмент для наливания жидкостей',
                  'Модель, описывающая путь клиента от первого контакта до совершения покупки',
                  'Стратегия снижения цен для увеличения продаж',
                  'Техника продаж с использованием скидок'
                ],
                correctAnswer: 'Модель, описывающая путь клиента от первого контакта до совершения покупки'
              }
            ]
          }
        ],
        relatedArtifactIds: [
          'artifact-level3-marketing-plan',
          'artifact-level3-sales-script'
        ],
        completionCriteria: {
          videosRequired: 3,
          testsRequired: 1
        },
        skillFocus: [SkillType.Marketing, SkillType.Sales, SkillType.Communication]
      },
      
      {
        id: 'level-4',
        title: 'Лидерство и командная работа',
        description: 'Развитие лидерских качеств и эффективного управления командой.',
        order: 4,
        videoContent: [
          {
            id: generateId('video'),
            title: 'Принципы эффективного лидерства',
            url: 'https://www.youtube.com/embed/8GGU8a9i1U8',
            duration: 240 // 4:00 minutes
          },
          {
            id: generateId('video'),
            title: 'Формирование сильной команды',
            url: 'https://www.youtube.com/embed/oKXu3lHQpV0',
            duration: 210 // 3:30 minutes
          },
          {
            id: generateId('video'),
            title: 'Разрешение конфликтов в команде',
            url: 'https://www.youtube.com/embed/Mjm_w3vPaQ8',
            duration: 195 // 3:15 minutes
          }
        ],
        tests: [
          {
            id: generateId('test'),
            title: 'Лидерство и управление командой',
            questions: [
              {
                id: generateId('question'),
                text: 'Какие качества характеризуют эффективного лидера?',
                type: 'multiple-choice',
                options: [
                  'Авторитарность и жесткость',
                  'Эмпатия и эмоциональный интеллект',
                  'Четкая коммуникация',
                  'Избегание любой обратной связи',
                  'Способность вдохновлять команду'
                ],
                correctAnswer: ['Эмпатия и эмоциональный интеллект', 'Четкая коммуникация', 'Способность вдохновлять команду']
              },
              {
                id: generateId('question'),
                text: 'Какой подход наиболее эффективен при разрешении конфликта в команде?',
                type: 'single-choice',
                options: [
                  'Игнорировать конфликт, чтобы он разрешился сам собой',
                  'Принимать сторону сильнейшего участника конфликта',
                  'Выявить причины конфликта и найти решение, учитывающее интересы всех сторон',
                  'Немедленно уволить конфликтующих сотрудников'
                ],
                correctAnswer: 'Выявить причины конфликта и найти решение, учитывающее интересы всех сторон'
              }
            ]
          }
        ],
        relatedArtifactIds: [
          'artifact-level4-leadership-assessment',
          'artifact-level4-team-building-guide'
        ],
        completionCriteria: {
          videosRequired: 2,
          testsRequired: 1
        },
        skillFocus: [SkillType.Leadership, SkillType.Management, SkillType.Communication]
      },
      
      {
        id: 'level-5',
        title: 'Стратегическое планирование',
        description: 'Разработка эффективных бизнес-стратегий и долгосрочного планирования.',
        order: 5,
        videoContent: [
          {
            id: generateId('video'),
            title: 'Основы стратегического мышления',
            url: 'https://www.youtube.com/embed/wnLCBqnoT6c',
            duration: 240 // 4:00 minutes
          },
          {
            id: generateId('video'),
            title: 'Анализ рынка и конкурентов',
            url: 'https://www.youtube.com/embed/ItPtm1GBgbA',
            duration: 225 // 3:45 minutes
          },
          {
            id: generateId('video'),
            title: 'Разработка бизнес-стратегии',
            url: 'https://www.youtube.com/embed/4vQ2BeRbv5o',
            duration: 255 // 4:15 minutes
          }
        ],
        tests: [
          {
            id: generateId('test'),
            title: 'Стратегическое планирование',
            questions: [
              {
                id: generateId('question'),
                text: 'Какой анализ используется для оценки сильных и слабых сторон компании, а также возможностей и угроз?',
                type: 'single-choice',
                options: [
                  'PEST-анализ',
                  'SWOT-анализ',
                  'Анализ 5 сил Портера',
                  'BCG-матрица'
                ],
                correctAnswer: 'SWOT-анализ'
              },
              {
                id: generateId('question'),
                text: 'Выберите все элементы, которые должны быть включены в стратегический план:',
                type: 'multiple-choice',
                options: [
                  'Миссия и видение компании',
                  'Детальное расписание обеденных перерывов сотрудников',
                  'Стратегические цели',
                  'Ключевые показатели эффективности (KPI)',
                  'Список всех сотрудников с их днями рождения'
                ],
                correctAnswer: ['Миссия и видение компании', 'Стратегические цели', 'Ключевые показатели эффективности (KPI)']
              }
            ]
          }
        ],
        relatedArtifactIds: [
          'artifact-level5-strategic-plan-template',
          'artifact-level5-swot-analysis'
        ],
        completionCriteria: {
          videosRequired: 2,
          testsRequired: 1
        },
        skillFocus: [SkillType.Management, SkillType.Leadership]
      }
    ];

    // Artifacts data
    const artifacts = [
      {
        id: 'artifact-level1-checklist',
        title: 'Чек-лист для развития бизнес-мышления',
        description: 'Полезный чек-лист с практическими упражнениями для развития бизнес-мышления и предпринимательских навыков.',
        fileURL: 'https://example.com/files/business-mindset-checklist.pdf', // Placeholder
        fileName: 'business-mindset-checklist.pdf',
        fileType: 'pdf',
        levelId: 'level-1',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level1-template',
        title: 'Шаблон бизнес-идеи',
        description: 'Шаблон для структурирования и оценки новых бизнес-идей.',
        fileURL: 'https://example.com/files/business-idea-template.docx', // Placeholder
        fileName: 'business-idea-template.docx',
        fileType: 'docx',
        levelId: 'level-1',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level2-spreadsheet',
        title: 'Финансовая модель стартапа',
        description: 'Готовая Excel таблица для создания финансовой модели стартапа с прогнозированием на 3 года.',
        fileURL: 'https://example.com/files/startup-financial-model.xlsx', // Placeholder
        fileName: 'startup-financial-model.xlsx',
        fileType: 'xlsx',
        levelId: 'level-2',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level2-guide',
        title: 'Руководство по финансовому планированию',
        description: 'Подробное руководство по основам финансового планирования для малого бизнеса.',
        fileURL: 'https://example.com/files/financial-planning-guide.pdf', // Placeholder
        fileName: 'financial-planning-guide.pdf',
        fileType: 'pdf',
        levelId: 'level-2',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level3-marketing-plan',
        title: 'Шаблон маркетингового плана',
        description: 'Готовый шаблон для создания комплексного маркетингового плана.',
        fileURL: 'https://example.com/files/marketing-plan-template.pptx', // Placeholder
        fileName: 'marketing-plan-template.pptx',
        fileType: 'pptx',
        levelId: 'level-3',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level3-sales-script',
        title: 'Скрипт продаж для B2B',
        description: 'Эффективный скрипт продаж для работы с корпоративными клиентами.',
        fileURL: 'https://example.com/files/b2b-sales-script.pdf', // Placeholder
        fileName: 'b2b-sales-script.pdf',
        fileType: 'pdf',
        levelId: 'level-3',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level4-leadership-assessment',
        title: 'Оценка лидерских качеств',
        description: 'Инструмент для самооценки и развития лидерских навыков.',
        fileURL: 'https://example.com/files/leadership-assessment.pdf', // Placeholder
        fileName: 'leadership-assessment.pdf',
        fileType: 'pdf',
        levelId: 'level-4',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level4-team-building-guide',
        title: 'Руководство по построению команды',
        description: 'Практическое руководство с упражнениями для развития командного духа и эффективного взаимодействия.',
        fileURL: 'https://example.com/files/team-building-guide.pdf', // Placeholder
        fileName: 'team-building-guide.pdf',
        fileType: 'pdf',
        levelId: 'level-4',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level5-strategic-plan-template',
        title: 'Шаблон стратегического плана',
        description: 'Профессиональный шаблон для разработки стратегического плана компании.',
        fileURL: 'https://example.com/files/strategic-plan-template.docx', // Placeholder
        fileName: 'strategic-plan-template.docx',
        fileType: 'docx',
        levelId: 'level-5',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'artifact-level5-swot-analysis',
        title: 'Шаблон SWOT-анализа',
        description: 'Структурированный шаблон для проведения SWOT-анализа компании.',
        fileURL: 'https://example.com/files/swot-analysis-template.xlsx', // Placeholder
        fileName: 'swot-analysis-template.xlsx',
        fileType: 'xlsx',
        levelId: 'level-5',
        downloadCount: 0,
        uploadedAt: admin.firestore.Timestamp.now()
      }
    ];

    // Upload levels to Firestore
    console.log('📝 Uploading 5 levels to Firestore...');
    const batch = db.batch();
    
    levels.forEach(level => {
      const levelRef = db.collection('levels').doc(level.id);
      batch.set(levelRef, level);
    });

    // Upload artifacts to Firestore
    console.log('📝 Uploading 10 artifacts to Firestore...');
    artifacts.forEach(artifact => {
      const artifactRef = db.collection('artifacts').doc(artifact.id);
      batch.set(artifactRef, artifact);
    });

    // Commit all changes
    await batch.commit();
    console.log('✅ Successfully uploaded all test data to Firestore!');
    console.log(`  - ${levels.length} levels created`);
    console.log(`  - ${artifacts.length} artifacts created`);
    
    // Provide instructions for testing
    console.log('\n📋 Next steps:');
    console.log('1. Navigate to your Firebase console to verify the data was uploaded correctly');
    console.log('2. Test the application to ensure it can fetch and display the level data');
    console.log('3. Update the status.md file to mark task 5.14 as completed');

    return { success: true, levels: levels.length, artifacts: artifacts.length };
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    return { success: false, error };
  }
}

// Run the data creation function
createTestData()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Data population completed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Data population failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }); 