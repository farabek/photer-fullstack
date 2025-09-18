import { toast } from 'react-toastify';

// This interface represents the typical error structure from RTK Query.
interface CustomErrorResponse {
  status?: number;
  data?: {
    message?: string;
    errorsMessages?: { message: string; field?: string }[];
  };
  error?: string;
  message?: string;
}

export const errorHandler = (err: unknown): void => {
  const error = err as CustomErrorResponse;
  let errorMessage = 'An unexpected error occurred.';

  if (error && typeof error === 'object') {
    // Prioritize specific messages from the backend if available
    const serverMessage =
      error.data?.message || error.data?.errorsMessages?.[0]?.message;
    if (serverMessage) {
      errorMessage = serverMessage;
    } else if (error.status) {
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        default:
          errorMessage =
            error.error || `An error occurred with status: ${error.status}`;
          break;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
  } else if (typeof err === 'string') {
    errorMessage = err;
  }

  toast.error(errorMessage);
};
