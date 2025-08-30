import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

export function generateThumbnail(
  file: File,
  maxSize: number = 200
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      let newWidth, newHeight;

      if (width > height) {
        newWidth = maxSize;
        newHeight = (height / width) * maxSize;
      } else {
        newHeight = maxSize;
        newWidth = (width / height) * maxSize;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 50MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only image files are allowed' };
  }

  return { isValid: true };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
