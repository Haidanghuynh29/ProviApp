import React, {createContext, useReducer} from 'react';
import User from '../models/user';

const AppContext = createContext(initialState);
const {Provider} = AppContext;

const initialState = {
  me: new User(),
  introduction: '',
  point: 0,
  // search options
  minAge: null,
  maxAge: null,
  minRate: null,
  maxRate: null,
  minPrice: null,
  maxPrice: null,
  minHopeDays: null,
  maxHopeDays: null,
  prefecture: null,
  minProspectSales: null,
  maxProspectSales: null,
  minProspectDays: null,
  maxProspectDays: null,
  priceType: null,
  // badge
  badgeAdmin: null,
  badgeIds: [],
};

export const SET_PROFILE = 'SET_PROFILE';
export const SET_INTRODUCTION = 'SET_INTRODUCTION';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_POINT = 'SET_POINT';
export const SET_BADGE_ADMIN = 'SET_BADGE_ADMIN';
export const SET_BADGE_CHAT = 'SET_BADGE_CHAT';

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_PROFILE:
        const me = action.me ?? new User();
        return {...state, me: me, point: action.point};
      case SET_INTRODUCTION:
        return {...state, introduction: action.introduction};
      case SET_POINT:
        return {
          ...state,
          point: action.point,
        };
      case SET_SEARCH:
        return {
          ...state,
          minAge: action.minAge,
          maxAge: action.maxAge,
          minRate: action.minRate,
          maxRate: action.maxRate,
          minPrice: action.minPrice,
          maxPrice: action.maxPrice,
          minHopeDays: action.minHopeDays,
          maxHopeDays: action.maxHopeDays,
          prefecture: action.prefecture,
          minProspectSales: action.minProspectSales,
          maxProspectSales: action.maxProspectSales,
          minProspectDays: action.minProspectDays,
          maxProspectDays: action.maxProspectDays,
          priceType: action.priceType,
        };
      case SET_BADGE_ADMIN:
        return {
          ...state,
          badgeAdmin: action.badgeAdmin,
        };
      case SET_BADGE_CHAT:
        return {
          ...state,
          badgeIds: action.badgeIds ?? [],
        };
      default:
        return state;
    }
  }, initialState);

  return <Provider value={{state, dispatch}}>{children}</Provider>;
};

export {AppContext, StateProvider};
