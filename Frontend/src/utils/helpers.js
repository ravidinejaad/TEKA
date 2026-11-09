import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(dateString, pattern = 'dd MMM yyyy, HH:mm') {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, pattern, { locale: id });
  } catch (error) {
    return dateString;
  }
}

export function formatTimeLeft(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function calculateScorePercentage(score, total) {
  if (!total || total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function getBadgeColorByScore(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

