// Action Types
export const GET_DASHBOARD_REQUEST = "GET_DASHBOARD_REQUEST";
export const GET_DASHBOARD_SUCCESS = "GET_DASHBOARD_SUCCESS";
export const GET_DASHBOARD_FAILURE = "GET_DASHBOARD_FAILURE";

// Action Creators
export const getDoctorDasboardRequest = () => ({
  type: GET_DASHBOARD_REQUEST,
});

export const getDoctorDasboardSuccess = (userData) => ({
  type: GET_DASHBOARD_SUCCESS,
  payload: userData,
});

export const getDoctorDasboardFailure = (error) => ({
  type: GET_DASHBOARD_FAILURE,
  payload: error,
});
