import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Add middleware to createStore
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import dialReducer from './reducers/dial';

// Combine Reducers
var reducers = combineReducers({
    'dialReducer': dialReducer
    // more...
});

// Create Store
var store = createStoreWithMiddleware(reducers);

export default store;
