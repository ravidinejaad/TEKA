export const APP_NAME = 'TEKA';
export const APP_DESCRIPTION = 'Platform Kuis & Pembelajaran Interaktif';

export const STORAGE_KEYS = {
  TOKEN: 'teka_auth_token',
  REFRESH_TOKEN: 'teka_refresh_token',
  USER: 'teka_user_profile',
  THEME: 'teka_theme_mode',
  QUIZ_STATE: 'teka_active_quiz',
};

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
};

export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  TIMEOUT: 'timeout',
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'pilihan_ganda',
  ESSAY: 'esai',
  TRUE_FALSE: 'benar_salah',
};

export const NAV_LINKS = [
  { name: 'Beranda', path: '/' },
  { name: 'Katalog Kuis', path: '/quizzes' },
];

