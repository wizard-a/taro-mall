import Taro from '@tarojs/taro';
import {getCatalogList, getCurrentCategory} from '../services/catalog';

export default {
  namespace: 'catalog',
  state: {
    categoryList: [],
    currentCategory: {},
    currentSubCategory: [],
  },
  reducers: {
    saveCatalog: (state, {payload}) => {
      state.categoryList = payload.categoryList;
      state.currentCategory = payload.currentCategory;
      state.currentSubCategory = payload.currentSubCategory;
    },
    saveCurrentCategory: (state, {payload}) => {
      state.currentCategory = payload.currentCategory;
      state.currentSubCategory = payload.currentSubCategory;
    },
  },
  effects: {
    *getCatalogList(_, {call, put}) {
      Taro.showLoading({
        title: '加载中...',
      })
      const res = yield call(getCatalogList);
      yield put({type: 'saveCatalog', payload: res});
      Taro.hideLoading();
    },
    *getCurrentCategory({payload}, {call, put}) {
      const res = yield call(getCurrentCategory, payload);
      yield put({type: 'saveCurrentCategory', payload: res});
    }
  }
};
