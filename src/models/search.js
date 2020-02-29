import {getSearchHelper, getSearchIndex, clearHistory} from '../services/search';
import {getGoodsList} from '../services/goods';
import { resetStore } from '../utils/app';


const initState = {
  helpKeyword: [],
  goodsList: [],
  filterCategoryList: [],
  /** searchIndex 接口数据 */
  historyKeywordList: [],
  defaultKeyword: {},
  hotKeywordList: []
}

export default {
  namespace: 'search',
  state: {...initState},
  reducers: {
    saveHelpKeyword: (state, {payload}) => {
      state.helpKeyword = payload;
    },
    saveSearchIndex: (state, {payload}) => {
      state.historyKeywordList = payload.historyKeywordList;
      state.defaultKeyword = payload.defaultKeyword;
      state.hotKeywordList = payload.hotKeywordList;
    },
    saveGoodsList: (state, {payload}) => {
      state.goodsList = payload.list;
      state.filterCategoryList = payload.filterCategoryList;
    },
    saveClearHistory: (state) => {
      state.historyKeywordList = [];
    },
    changeFilterCategoryList: (state, {payload}) => {
      state.filterCategoryList = payload;
    },
    REST: (state) => {
      resetStore(state, initState);
    }
  },
  effects: {
    *getSearchHelper({payload}, {call, put}) {
      const res = yield call(getSearchHelper, payload);
      yield put({type: 'saveHelpKeyword', payload: res});
    },
    *getGoodsList({payload}, {call, put}) {
      const res = yield call(getGoodsList, payload);
      yield put({type: 'saveGoodsList', payload: res});
    },
    *getSearchIndex({payload}, {call, put}) {
      const res = yield call(getSearchIndex, payload);
      yield put({type: 'saveSearchIndex', payload: res});
    },
    *clearHistory(_, {call, put}) {
      const res = yield call(clearHistory);
      yield put({type: 'saveClearHistory'})
    },

  }
};
