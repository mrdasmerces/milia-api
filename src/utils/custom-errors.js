const { messages } = require('./messages');

class SecretError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.secretsError);
    this.name = 'SecretError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class DbConnectionError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.dbError);
    this.name = 'DbConnectionError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class ItemNotFoundError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.itemNotFoundError);
    this.name = 'ItemNotFoundError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class GenericError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.genericError);
    this.name = 'GenericError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class BusinessRuleError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.businessRuleError);
    this.name = 'BusinessRuleError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class ResourceNotAvailableError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.resourceNotAvailableError);
    this.name = 'ResourceNotAvailable';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class UserTokenError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.userTokenError);
    this.name = 'UserTokenError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class MissingParamsError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.missingParamsError);
    this.name = 'MissingParamsError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class EventError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.eventError);
    this.name = 'EventError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class PermissionError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.permissionError);
    this.name = 'PermissionError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class TokenRefreshError extends Error {
  constructor(message, options = {}) {
    super(message || messages.defaultErrors.tokenRefreshError);
    this.name = 'TokenRefreshError';
    this.options = options;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = {
  SecretError,
  DbConnectionError,
  ItemNotFoundError,
  GenericError,
  BusinessRuleError,
  ResourceNotAvailableError,
  UserTokenError,
  MissingParamsError,
  EventError,
  PermissionError,
  TokenRefreshError,
}
