import {getGoodsCount} from '../services/goods';

export default {
  namespace: 'goods',
  state: {
    goodsCount: 0,
  },
  reducers: {
    saveCount: (state, {payload}) => {
      state.goodsCount = payload;
    },
  },
  effects: {
    *getGoodsCount(_, {call, put}) {
      const res = yield call(getGoodsCount);
      console.log('---count----', res);
      yield put({type: 'saveCount', payload: res});
    }
  }
};
