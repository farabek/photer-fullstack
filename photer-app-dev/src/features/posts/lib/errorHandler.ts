import { toast } from 'react-toastify';
import { ErrorResponse } from './post.types';

export const errorHandler = (e: unknown): void => {
  const error = (e as ErrorResponse).error;
  let errorsMessage = '';
  switch (error.status) {
    case 400:
      errorsMessage = error.errorsMessage[0].message;
      break;
    case 401:
      errorsMessage = 'Unauthorized';
      break;
    case 403:
      errorsMessage = 'Not owner post';
      break;
    case 404:
      errorsMessage = 'Not found';
      break;
    case 500:
      errorsMessage = error.data.message;
      break;
    default:
      errorsMessage = 'Unknown error: ' + JSON.stringify(error);
  }
  toast(errorsMessage, { type: 'error' });
};
