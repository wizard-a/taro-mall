import delay from '../utils/delay';

export default {
  namespace: 'demo',
  state: {
    list: [],
    counter: {
      num: 0,
    }
  },
  reducers: {
    add: (state, {payload}) => {
      state.counter.num ++;
    },

    dec: (state, {payload}) => {
      state.counter.num --;
    }

  },
  effects: {
    *asyncAdd(_, {all, call, put}) {
      yield call(delay, 2000);//增加延迟测试效果

      yield put({type: 'add'});
    },
  }
};
