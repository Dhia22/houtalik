import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import counterReducer from './slices/counterSlice';
import authenticationReducer from './slices/authenticationSlice';

const persistConfig = {
    key: "root",
    version: 1,
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    counter: counterReducer,
    authentication: authenticationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});
