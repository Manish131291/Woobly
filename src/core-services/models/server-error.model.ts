export class ServerError extends Error {
  bucketCode = '';
  bucketMessage = '';
  displayMessage = '';
  serverMessage = '';
  errCode: '';
  requestId = '';
  availableLimit = '';
  consumedAmount = '';
  errorDetails = {};

  constructor(obj: any) {
    super(obj);
    this.bucketCode = obj.bucketCode;
    this.bucketMessage = obj.bucketMessage;
    this.displayMessage = obj.displayMessage;
    this.serverMessage = obj.serverMessage;
    this.requestId = obj.requestId;
    this.availableLimit = obj.availableLimit;
    this.consumedAmount = obj.consumedAmount;
    this.errCode = obj.errCode;
    this.errorDetails = obj.errorDetails;
  }

  getErrorMessage(): string {
    return this.displayMessage;
  }

  getErrorCode(): string {
    return this.errCode;
  }

  getBucketMessage(): string {
    return this.bucketMessage;
  }

  toString(): string {
    return this.displayMessage;
  }

  getStatusCode(): string {
    return this.bucketCode;
  }

  getServerMessage(): string {
    return this.serverMessage;
  }

  getRequestId(): string {
    return this.requestId;
  }

  getavailableLimit(): string {
    return this.availableLimit;
  }

  getconsumedLimit(): string {
    return this.consumedAmount;
  }

  getErrorDetails(): object {
    return this.errorDetails;
  }
}
