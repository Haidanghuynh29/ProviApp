import {combineReducers} from 'redux';
import userReducer from './user';
import chatReducer from './chat';

const rootReducer = combineReducers({
  userReducer,
  chatReducer,
});

export default rootReducer;
