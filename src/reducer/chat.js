import {
  FETCH_CHAT,
  FETCH_CHAT_SUCCESS,
  FETCH_CHAT_FAIL,
} from '../config/constant';

const initialState = {
  chats: [],
  fetchingChat: false,
  error: false,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CHAT:
      return {
        ...state,
        chats: [],
        fetchingChat: true,
      };
    case FETCH_CHAT_SUCCESS:
      return {
        ...state,
        fetchingChat: false,
        chats: action.chats ?? [],
      };
    case FETCH_CHAT_FAIL:
      return {
        ...state,
        fetchingChat: false,
        error: true,
      };
    default:
      return state;
  }
}
