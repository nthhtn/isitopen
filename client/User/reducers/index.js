import { combineReducers } from 'redux';

import restaurant from './Restaurant';
import collection from './Collection';
import user from './User';

export default combineReducers({ restaurant, collection, user });
