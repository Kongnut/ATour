import { combineReducers } from 'redux';
import { ON_CHANGE, ON_SEARCH_TOUR } from '../action/SearchAction';

const initialState = {
  term: ''
};

function searchName(state = initialState.term, action) {
  switch (action.type) {
    case ON_CHANGE:
      console.log('on change', action.payload);
      return action.payload;
    case ON_SEARCH_TOUR:
      console.log('on Search', state);
      return state;
    default:
      return state;
  }
}

export default searchName;