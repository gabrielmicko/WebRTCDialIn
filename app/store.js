import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Add middleware to createStore
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import socketReducer from './reducers/socket';
import callReducer from './reducers/call';
import webrtcReducer from './reducers/webrtc';

// Combine Reducers
var reducers = combineReducers({
    'socketReducer': socketReducer,
    'callReducer': callReducer,
    'webrtcReducer': webrtcReducer
    // more...
});

// Create Store
var store = createStoreWithMiddleware(reducers);

export default store;
