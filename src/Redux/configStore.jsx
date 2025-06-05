import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import {thunk} from 'redux-thunk';
import { UserReducer } from './reducers/UserReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
import {MessageReducer} from "./reducers/MessageReducer";

const rootReducer = combineReducers({
    UserReducer,
    MessageReducer,
    LoadingReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;
