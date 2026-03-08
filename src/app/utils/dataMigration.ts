// Data Migration Utility
// Helps migrate data from localStorage to Firebase

import { createDocument } from '../services/databaseService';
import { mockEvents, mockRegistrations } from '../data/mockData';
import { mockQuizzes } from '../data/quizData';
import { blogPosts } from '../data/blogData';

/**
 * Migrate localStorage data to Firebase
 * This should be run once by an admin after Firebase is set up
 */
export const migrateLocalStorageToFirebase = async () => {
  const migrations: {
    name: string;
    migrate: () => Promise<void>;
  }[] = [];

  // Migration functions
  const migrateEvents = async () => {
    console.log('Migrating events...');
    for (const event of mockEvents) {
      try {
        await createDocument('events', {
          title: event.title,
          description: event.description,
          date: event.date,
          venue: event.venue,
          price: event.price || 0,
          isPaid: event.isPaid,
          maxParticipants: event.maxParticipants,
          registrationDeadline: event.registrationDeadline,
          imageUrl: event.image,
          status: event.status,
        }, event.id);
      } catch (error) {
        console.error(`Failed to migrate event ${event.id}:`, error);
      }
    }
    console.log(`Migrated ${mockEvents.length} events`);
  };

  const migrateRegistrations = async () => {
    console.log('Migrating registrations...');
    for (const reg of mockRegistrations) {
      try {
        await createDocument('registrations', {
          userId: reg.studentId || reg.id,
          eventId: reg.eventId,
          userName: reg.studentName,
          userEmail: reg.studentEmail,
          status: reg.approvalStatus,
          paymentStatus: reg.paymentStatus,
        }, reg.id);
      } catch (error) {
        console.error(`Failed to migrate registration ${reg.id}:`, error);
      }
    }
    console.log(`Migrated ${mockRegistrations.length} registrations`);
  };

  const migrateTests = async () => {
    console.log('Migrating MCQ tests...');
    for (const quiz of mockQuizzes) {
      try {
        await createDocument('quizzes', {
          subject: quiz.subject,
          title: quiz.title,
          description: quiz.description,
          duration: quiz.timeLimit,
          totalQuestions: quiz.questions.length,
          passingScore: quiz.passingScore,
          questions: quiz.questions,
        }, quiz.id);
      } catch (error) {
        console.error(`Failed to migrate quiz ${quiz.id}:`, error);
      }
    }
    console.log(`Migrated ${mockQuizzes.length} quizzes`);
  };

  const migrateBlogs = async () => {
    console.log('Migrating blogs...');
    for (const blog of blogPosts) {
      try {
        await createDocument('blogs', {
          title: blog.title,
          authorId: 'system',
          authorName: blog.author,
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          tags: blog.tags || [],
          status: blog.status,
          imageUrl: blog.image,
          likes: blog.likes || 0,
          views: blog.views || 0,
        }, blog.id);
      } catch (error) {
        console.error(`Failed to migrate blog ${blog.id}:`, error);
      }
    }
    console.log(`Migrated ${blogPosts.length} blogs`);
  };

  const migrateClubApplications = async () => {
    console.log('Migrating club applications...');
    const applications = localStorage.getItem('aeroClubApplications');
    if (applications) {
      const parsedApplications = JSON.parse(applications);
      for (const app of parsedApplications) {
        try {
          await createDocument('clubApplications', app, app.id);
        } catch (error) {
          console.error(`Failed to migrate application ${app.id}:`, error);
        }
      }
      console.log(`Migrated ${parsedApplications.length} club applications`);
    }
  };

  const migrateTestAttempts = async () => {
    console.log('Migrating test attempts...');
    const attempts = localStorage.getItem('testAttempts');
    if (attempts) {
      const parsedAttempts = JSON.parse(attempts);
      for (const attempt of parsedAttempts) {
        try {
          await createDocument('testResults', {
            userId: 'system',
            userName: 'Student',
            testId: attempt.quizId,
            testTitle: attempt.quizTitle || 'Unknown',
            score: attempt.score,
            totalQuestions: attempt.totalQuestions || 0,
            correctAnswers: attempt.correctAnswers || 0,
            incorrectAnswers: attempt.incorrectAnswers || 0,
          }, attempt.id);
        } catch (error) {
          console.error(`Failed to migrate test attempt ${attempt.id}:`, error);
        }
      }
      console.log(`Migrated ${parsedAttempts.length} test attempts`);
    }
  };

  // Add all migrations
  migrations.push(
    { name: 'Events', migrate: migrateEvents },
    { name: 'Registrations', migrate: migrateRegistrations },
    { name: 'MCQ Tests', migrate: migrateTests },
    { name: 'Blogs', migrate: migrateBlogs },
    { name: 'Club Applications', migrate: migrateClubApplications },
    { name: 'Test Attempts', migrate: migrateTestAttempts }
  );

  // Run all migrations
  console.log('Starting data migration to Firebase...');
  const results = [];

  for (const migration of migrations) {
    try {
      await migration.migrate();
      results.push({ name: migration.name, success: true });
    } catch (error) {
      console.error(`Migration failed for ${migration.name}:`, error);
      results.push({ name: migration.name, success: false, error });
    }
  }

  console.log('Migration complete!');
  console.table(results);

  return results;
};

/**
 * Check if migration is needed
 */
export const checkMigrationNeeded = (): boolean => {
  const hasLocalData = 
    localStorage.getItem('aeroClubApplications') ||
    localStorage.getItem('testAttempts');
  
  return !!hasLocalData;
};

/**
 * Clear localStorage after successful migration
 * Use with caution!
 */
export const clearLocalStorageAfterMigration = (confirm: boolean = false) => {
  if (!confirm) {
    console.warn('Please confirm before clearing localStorage');
    return false;
  }

  const keysToRemove = [
    'aeroClubApplications',
    'testAttempts',
    'user', // Old user session
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('localStorage cleared!');
  return true;
};

/**
 * Backup localStorage to JSON file before migration
 */
export const backupLocalStorage = () => {
  const backup: Record<string, any> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        backup[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch {
        backup[key] = localStorage.getItem(key);
      }
    }
  }

  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `localStorage_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);

  console.log('localStorage backup downloaded!');
};