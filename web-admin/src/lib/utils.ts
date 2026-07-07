import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(d);
}

export function stripHtmlAndTruncate(html: string, wordCount: number = 20) {
  if (!html) return '';
  // Remove HTML tags
  let text = html.replace(/<[^>]*>?/gm, ' ');
  
  // Replace common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Split into words and truncate
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text.trim();
  return words.slice(0, wordCount).join(' ') + '...';
}
