// Action Types
export const GET_PROFILE_REQUEST = "GET_PROFILE_REQUEST";
export const GET_PROFILE_SUCCESS = "GET_PROFILE_SUCCESS";
export const GET_PROFILE_FAILURE = "GET_PROFILE_FAILURE";

// Action Creators
export const getDoctorProfileRequest = () => ({
  type: GET_PROFILE_REQUEST,
});

export const getDoctorProfileSuccess = (getData) => ({
  type: GET_PROFILE_SUCCESS,
  payload: getData,
});

export const getDoctorProfileFailure = (error) => ({
  type: GET_PROFILE_FAILURE,
  payload: error,
});
