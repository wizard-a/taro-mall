import {getGoodsCount, getGoodsDetail} from '../services/goods';

export default {
  namespace: 'goods',
  state: {
    goodsCount: 0,
    goodsDetail: {},
  },
  reducers: {
    saveCount: (state, {payload}) => {
      state.goodsCount = payload;
    },
  },
  effects: {
    *getGoodsCount(_, {call, put}) {
      const res = yield call(getGoodsCount);
      yield put({type: 'saveCount', payload: res});
    },
    *getGoodsDetail({ payload }, { call, put}) {
      const res = yield call(getGoodsDetail, payload);
      console.log('--goods detail', res);
    }
  }
};
