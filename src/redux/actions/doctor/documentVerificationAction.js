// Action Types
export const GET_DOCUMENT_REQUEST = "GET_DOCUMENT_REQUEST";
export const GET_DOCUMENT_SUCCESS = "GET_DOCUMENT_SUCCESS";
export const GET_DOCUMENT_FAILURE = "GET_DOCUMENT_FAILURE";

// Action Creators
export const getDocumentVerificationRequest = () => ({
  type: GET_DOCUMENT_REQUEST,
});

export const getDocumentVerificationSuccess = (userData) => ({
  type: GET_DOCUMENT_SUCCESS,
  payload: userData,
});

export const getDocumentVerificationFailure = (error) => ({
  type: GET_DOCUMENT_FAILURE,
  payload: error,
});
