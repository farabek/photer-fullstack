export const useTimeAgo = (dateTime: string): string => {
  const date = new Date(dateTime);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(secondsAgo / 31536000);
  if (interval >= 1) {
    return interval === 1 ? 'a year ago' : `${interval} years ago`;
  }

  interval = Math.floor(secondsAgo / 2592000);
  if (interval >= 1) {
    return interval === 1 ? 'a month ago' : `${interval} months ago`;
  }

  interval = Math.floor(secondsAgo / 86400);
  if (interval >= 1) {
    return interval === 1 ? 'a day ago' : `${interval} days ago`;
  }

  interval = Math.floor(secondsAgo / 3600);
  if (interval >= 1) {
    return interval === 1 ? 'an hour ago' : `${interval} hours ago`;
  }

  interval = Math.floor(secondsAgo / 60);
  if (interval >= 1) {
    return interval === 1 ? 'a minute ago' : `${interval} minutes ago`;
  }

  return 'just now';
};

export const useCreateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};
