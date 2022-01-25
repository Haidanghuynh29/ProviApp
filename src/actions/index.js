import {
  FETCH_WORKER,
  FETCH_EMPLOYER,
  FETCH_FAV_IDS,
  FETCH_BLOCKING_IDS,
  FETCH_BLOCKED_IDS,
  FETCH_CHAT,
} from '../config/constant';

export function fetchWorker() {
  return {
    type: FETCH_WORKER,
  };
}
export function fetchEmployer() {
  return {
    type: FETCH_EMPLOYER,
  };
}

// when update use chats & chat
export function fetchChat(kind = 0, chats = null, chat = null, flag = 0) {
  return {
    type: FETCH_CHAT,
    kind,
    chats,
    chat,
    flag,
  };
}
export function fetchFavIds(ids = null, id = null, flag = false) {
  return {
    type: FETCH_FAV_IDS,
    ids: ids,
    id: id,
    flag: flag,
  };
}
export function fetchBlockingIds(ids = null, id = null, flag = false) {
  return {
    type: FETCH_BLOCKING_IDS,
    ids: ids,
    id: id,
    flag: flag,
  };
}
export function fetchBlockedIds(ids = null, id = null, flag = false) {
  return {
    type: FETCH_BLOCKED_IDS,
    ids: ids,
    id: id,
    flag: flag,
  };
}
