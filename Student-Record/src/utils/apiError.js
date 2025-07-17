class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.errors = errors;
  }
}

export default ApiError;
