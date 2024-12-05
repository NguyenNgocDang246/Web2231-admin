module.exports = class CError extends Error {
  constructor(statusCode, message, desc = "") {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.desc = desc;
  }
};
