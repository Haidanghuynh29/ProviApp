import {takeLatest, put, call} from 'redux-saga/effects';
import * as API from '../apis/api';

import {
  FETCH_CHAT,
  FETCH_CHAT_SUCCESS,
  FETCH_CHAT_FAIL,
} from '../config/constant';

function* getChats(action) {
  try {
    let values = [];

    if (action.chats) {
      const {chats, chat, flag} = action; // 0: update, 1: create, 2: delete
      switch (flag) {
        case 0:
          const index = chats.findIndex((d) => d.key == chat.key);
          if (index > -1) {
            chats[index].status = chat.status;
            yield API.update_chat_state(chat.key, chat.status);
          }
          values = chats.slice();
          break;
        case 1:
          const temp = yield API.create_chat(chat);
          values = [...chats, temp];
          break;
        case 2:
          yield API.delete_chat(chat.key);
          values = chats.filter((c) => c.key !== chat.key);
          break;
      }
    } else {
      values = yield API.get_chats(action.kind);
    }

    yield put({
      type: FETCH_CHAT_SUCCESS,
      chats: values,
    });
  } catch (error) {
    yield put({type: FETCH_CHAT_FAIL});
  }
}
export function* watchChats() {
  yield takeLatest(FETCH_CHAT, getChats);
}
