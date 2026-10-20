import axios from 'axios';

// Central error message extractor for all API calls
// Backend can return errors in two formats:
// 1. ApiResponse wrapper: { error: { message: "..." }, data: null }
// 2. Spring default: { message: "...", status: 500 }
// 3. Plain string messages from AuthenticationException
export function extractErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    const response = err.response;
    if (!response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    const data: unknown = response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const payload = data as {
        error?: { message?: unknown };
        message?: unknown;
        detail?: unknown;
      };
      const message = payload.error?.message ?? payload.message ?? payload.detail;
      if (typeof message === 'string' && message.trim()) {
        if (
          response.status === 401 &&
          /bad credentials|unauthorized|full authentication is required/i.test(message)
        ) {
          return 'Email or password is incorrect. Please try again.';
        }
        return message;
      }
    }

    if (response.status === 401) return 'Please sign in again to continue.';
    if (response.status === 403) return 'You do not have permission to perform this action.';
    if (response.status >= 500) return 'The server encountered an error. Please try again shortly.';
    return fallback;
  }

  if (err instanceof Error && err.message) return err.message;

  return fallback;
}
