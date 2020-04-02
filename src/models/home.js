import {getIndex} from '../services/index';
import {getShopNav, getShopNav1} from '../services/shop';

export default {
  namespace: 'home',
  state: {
    data: {},
    shop: {
      nav: [],
      currentNav: {},
      currentNavIndex: 0
    }
  },
  reducers: {
    save: (state, {payload}) => {
      state.data = payload;
    },
    saveShopNav: (state, {payload}) => {
      state.shop.nav = payload
    },
    changeShopNav: (state, {payload}) => {
      state.shop.currentNav = payload;
    },
    changeShopNavIndex: (state, {payload}) => {
      state.shop.currentNavIndex = payload
    }

  },
  effects: {
    *init(_, {call, put}) {
      const [nav] = yield [call(getShopNav)];
      console.log('===nav===', nav);
      yield put({type: 'saveShopNav',  payload: nav})

    },
    // *changeNav(_, {call, put}) {
    //   const nav = yield call(getShopNav1);
    //   console.log('===nav===', nav);
    //   yield put({type: 'saveShopNav',  payload: nav})

    // },
    *getIndex(_, {call, put}) {
      const res = yield call(getIndex);
      console.log('--home--', res);
      yield put({type: 'save', payload: res});
    }
  }
};
