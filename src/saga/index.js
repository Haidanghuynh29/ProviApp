import {all, fork} from 'redux-saga/effects';

import {
  watchWorkers,
  watchEmployers,
  watchFavIds,
  watchBlockingIds,
  watchBlockedIds,
} from './user';
import {watchChats} from './chat';

export default function* rootSaga() {
  yield all([
    fork(watchWorkers),
    fork(watchEmployers),
    fork(watchFavIds),
    fork(watchBlockingIds),
    fork(watchBlockedIds),
    fork(watchChats),
  ]);
}
