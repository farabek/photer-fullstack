type ErrorMessage = {
  message: string;
  field: string;
};

export type ApiError = {
  error: {
    data: {
      errorsMessages: ErrorMessage[];
      status: number;
    };
    isUnhandledError: boolean;
    meta: unknown;
  };
};
