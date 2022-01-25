import {takeLatest, put, call} from 'redux-saga/effects';
import * as API from '../apis/api';

import {
  FETCH_WORKER,
  FETCH_WORKER_SUCCESS,
  FETCH_WORKER_FAIL,
  FETCH_EMPLOYER,
  FETCH_EMPLOYER_SUCCESS,
  FETCH_EMPLOYER_FAIL,
  FETCH_FAV_IDS,
  FETCH_FAV_IDS_SUCCESS,
  FETCH_FAV_IDS_FAIL,
  FETCH_BLOCKING_IDS,
  FETCH_BLOCKING_IDS_SUCCESS,
  FETCH_BLOCKING_IDS_FAIL,
  FETCH_BLOCKED_IDS,
  FETCH_BLOCKED_IDS_SUCCESS,
  FETCH_BLOCKED_IDS_FAIL,
} from '../config/constant';

function* getWorkers(action) {
  try {
    const workers = yield API.get_users(1);
    yield put({
      type: FETCH_WORKER_SUCCESS,
      workers: workers,
    });
  } catch (error) {
    yield put({type: FETCH_WORKER_FAIL});
  }
}
export function* watchWorkers() {
  yield takeLatest(FETCH_WORKER, getWorkers);
}

function* getEmployers(action) {
  try {
    const employers = yield API.get_users(0);
    yield put({
      type: FETCH_EMPLOYER_SUCCESS,
      employers: employers,
    });
  } catch (error) {
    yield put({type: FETCH_EMPLOYER_FAIL});
  }
}
export function* watchEmployers() {
  yield takeLatest(FETCH_EMPLOYER, getEmployers);
}

function* getFavIds(action) {
  try {
    var fav_ids = [];
    if (action.ids) {
      const {ids, id, flag} = action;
      yield API.like_user(id, flag);
      fav_ids = flag ? [...ids, id] : ids.filter((d) => d != id);
    } else {
      fav_ids = yield API.get_following_user_ids();
    }

    yield put({
      type: FETCH_FAV_IDS_SUCCESS,
      fav_ids: fav_ids,
    });
  } catch (error) {
    yield put({type: FETCH_FAV_IDS_FAIL});
  }
}
export function* watchFavIds() {
  yield takeLatest(FETCH_FAV_IDS, getFavIds);
}

function* getBlockingIds(action) {
  try {
    var blocking_ids = [];
    if (action.ids) {
      const {ids, id, flag} = action;
      yield API.block_user(id, flag);
      blocking_ids = flag ? [...ids, id] : ids.filter((d) => d != id);
    } else {
      blocking_ids = yield API.get_blocking_ids();
    }

    yield put({
      type: FETCH_BLOCKING_IDS_SUCCESS,
      blocking_ids: blocking_ids,
    });
  } catch (error) {
    yield put({type: FETCH_BLOCKING_IDS_FAIL});
  }
}
export function* watchBlockingIds() {
  yield takeLatest(FETCH_BLOCKING_IDS, getBlockingIds);
}

function* getBlockedIds(action) {
  try {
    var blocked_ids = [];
    if (action.ids) {
      const {ids, id, flag} = action;
      yield API.block_user(id, flag);
      blocked_ids = flag ? [...ids, id] : ids.filter((d) => d !== id);
    } else {
      blocked_ids = yield API.get_blocked_ids();
    }

    yield put({
      type: FETCH_BLOCKED_IDS_SUCCESS,
      blocked_ids: blocked_ids,
    });
  } catch (error) {
    yield put({type: FETCH_BLOCKED_IDS_FAIL});
    console.log(error);
  }
}
export function* watchBlockedIds() {
  yield takeLatest(FETCH_BLOCKED_IDS, getBlockedIds);
}
