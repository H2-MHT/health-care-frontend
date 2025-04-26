// src/redux/store.js

import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage
import doctorDashboardReducer from './reducers/doctor/doctorDashboardReducer';
import getDoctorProfileReducer from "./reducers/doctor/getDoctorProfileReducer"
import documentVerificationReducer from './reducers/doctor/documentVerificationReducer';

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage, // Use localStorage (default storage engine)
  backList: ['auth', 'doctorDashboard','userProfile', "documentVerification"], // You can whitelist parts of your state to persist
};

// Combine reducers (you can add more reducers if needed)
const rootReducer = combineReducers({
    auth: authReducer,
    doctorDashboard: doctorDashboardReducer,
    userProfile: getDoctorProfileReducer,
    documentVerification : documentVerificationReducer,
  });

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Thunk and Redux Persist
const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };

