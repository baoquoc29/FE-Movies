import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import {thunk} from 'redux-thunk';
import { UserReducer } from './reducers/UserReducer';
import { LoadingReducer } from './reducers/LoadingReducer';

const rootReducer = combineReducers({
    UserReducer,
    LoadingReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;
