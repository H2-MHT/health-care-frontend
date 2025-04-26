import { GET_DASHBOARD_FAILURE, GET_DASHBOARD_REQUEST, GET_DASHBOARD_SUCCESS } from '../../actions/doctor/doctorDashboardAction';

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
};

const doctorDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: action.payload,
      };
    case GET_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default doctorDashboardReducer;
