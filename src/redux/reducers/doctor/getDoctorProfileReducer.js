import {
  GET_PROFILE_FAILURE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_REQUEST,
} from "../../actions/doctor/getDoctorProfileAction";

const initialState = {
  userProfile: null,
  loading: false,
  error: null,
};

const doctorProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userProfile: action.payload,
      };
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default doctorProfileReducer;
