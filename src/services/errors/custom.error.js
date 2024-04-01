class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const msg = typeof message === "object" ? JSON.stringify(message) : message;
    const error = new Error(msg);
    (error.name = name),
      (error.code = code),
      (error.cause = cause ? new Error(cause) : null);
    throw error;
  }
}

module.exports = CustomError;
