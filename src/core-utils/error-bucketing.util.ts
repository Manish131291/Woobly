interface Message {
  bucketCode: string;
  bucketMessage: string;
  displayMessage: string;
  serverMessage?: string;
  errCode?: string;
}
export interface ClientError {
  status: number;
}
export interface ServerError {
  error: {
    errorCode?: string;
    error_code?: string;
  };
}
const { REACT_APP_LOG_ANALYTICS, REACT_APP_FIREBASE_IDENTIFIER } = process.env;
const logInAnalytics = REACT_APP_LOG_ANALYTICS;

export const handleError = (error: any): Message => {
  let errorObj;
  const errorCode = error.error?.errorCode as string;
  const status = error?.status;
  if (errorCode) {
    errorObj = error.error.errorCode;
    errorObj.serverMessage = error.error?.message as string;
    errorObj.consumedAmount = error.error?.consumedAmount;
  } else if (status) {
    errorObj = status.toString();
  }
  if (error.error?.requestId) {
    errorObj.requestId = error.error?.requestId;
  }
  if (error.error?.availableLimit) {
    errorObj.availableLimit = error.error?.availableLimit;
  }
  if (error.error?.errorDetails) {
    errorObj.errorDetails = error.error?.errorDetails;
  }

  return errorObj;
};
