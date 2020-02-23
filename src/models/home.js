import {getIndex} from '../services/index';

export default {
  namespace: 'home',
  state: {
    data: {},
  },
  reducers: {
    save: (state, {payload}) => {
      state.data = payload;
    },
  },
  effects: {
    *getIndex(_, {call, put}) {
      const res = yield call(getIndex);
      console.log('--home--', res);
      yield put({type: 'save', payload: res});
    }
  }
};
