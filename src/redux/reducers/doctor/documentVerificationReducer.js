import { GET_DOCUMENT_FAILURE, GET_DOCUMENT_REQUEST, GET_DOCUMENT_SUCCESS } from "../../actions/doctor/documentVerificationAction";


const initialState = {
  documentVerification: null,
  loading: false,
  error: null,
};

const documentVerificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        documentVerification: action.payload,
      };
    case GET_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default documentVerificationReducer;
