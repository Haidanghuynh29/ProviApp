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

const initialState = {
  workers: [],
  employers: [],
  fav_ids: [],
  blocking_ids: [],
  blocked_ids: [],

  fetchingWorkers: false,
  fetchingEmployers: false,
  fetchingFavIds: false,
  fetchingBlockIds: false,
  fetchingBlockedIds: false,

  error: false,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WORKER:
      return {
        ...state,
        workers: [],
        fetchingWorkers: true,
      };
    case FETCH_WORKER_SUCCESS:
      return {
        ...state,
        fetchingWorkers: false,
        workers: action.workers ?? [],
      };
    case FETCH_WORKER_FAIL:
      return {
        ...state,
        fetchingWorkers: false,
        error: true,
      };

    case FETCH_EMPLOYER:
      return {
        ...state,
        employers: [],
        fetchingEmployers: true,
      };
    case FETCH_EMPLOYER_SUCCESS:
      return {
        ...state,
        fetchingEmployers: false,
        employers: action.employers ?? [],
      };
    case FETCH_EMPLOYER_FAIL:
      return {
        ...state,
        fetchingEmployers: false,
        error: true,
      };

    case FETCH_FAV_IDS:
      return {
        ...state,
        fav_ids: [],
        fetchingFavIds: true,
      };
    case FETCH_FAV_IDS_SUCCESS:
      return {
        ...state,
        fetchingFavIds: false,
        fav_ids: action.fav_ids ?? [],
      };
    case FETCH_FAV_IDS_FAIL:
      return {
        ...state,
        fetchingFavIds: false,
        error: true,
      };

    case FETCH_BLOCKING_IDS:
      return {
        ...state,
        blocking_ids: [],
        fetchingBlockIds: true,
      };
    case FETCH_BLOCKING_IDS_SUCCESS:
      return {
        ...state,
        fetchingBlockIds: false,
        blocking_ids: action.blocking_ids ?? [],
      };
    case FETCH_BLOCKING_IDS_FAIL:
      return {
        ...state,
        fetchingBlockIds: false,
        error: true,
      };

    case FETCH_BLOCKED_IDS:
      return {
        ...state,
        blocked_ids: [],
        fetchingBlockedIds: true,
      };
    case FETCH_BLOCKED_IDS_SUCCESS:
      return {
        ...state,
        fetchingBlockedIds: false,
        blocked_ids: action.blocked_ids ?? [],
      };
    case FETCH_BLOCKED_IDS_FAIL:
      return {
        ...state,
        fetchingBlockedIds: false,
        error: true,
      };
    default:
      return state;
  }
}
