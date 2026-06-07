export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${formatDate(date)} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function calculateDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateShiftDuration(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diffHours = (now - start) / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getOccupancyColor(rate: number): string {
  if (rate >= 80) return '#D62828';
  if (rate >= 60) return '#F77F00';
  return '#00A86B';
}

export function getMaintenanceColor(days: number): string {
  if (days <= 0) return '#D62828';
  if (days <= 7) return '#F77F00';
  return '#00A86B';
}

export function getStockColor(stock: number, threshold: number): string {
  if (stock <= threshold * 0.3) return '#D62828';
  if (stock <= threshold) return '#F77F00';
  return '#00A86B';
}
