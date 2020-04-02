
import Taro from '@tarojs/taro';
import store from '../dva';
import {SHOP_CONFIG_TYPE} from './enum';

/**
 *
 * @param {*} state
 * @param {*} initState
 */
export const resetStore = (state, initState) => {
  Object.keys(initState).forEach(key => {
    state[key] = initState[key];
  })
}

/**
 * 更新店铺配置
 */
export const updateShopConfig = () => {
  const dispatch = store.getDispatch()
  dispatch({type: 'home/init'})
}


/**
 * TabBar 跳转地址
 * @param {*} tab
 */
export const tabBarSwitchTab = (tab) => {
  let url = '/pages/index/index'
  switch (tab.ref_type) {
    case SHOP_CONFIG_TYPE.home:
      url = '/pages/index/index';
      break;
    case SHOP_CONFIG_TYPE.category:
      url = '/pages/catalog/catalog'
      break;
    case SHOP_CONFIG_TYPE.cart:
      url = '/pages/cart/cart'
      break;
    case SHOP_CONFIG_TYPE.my:
      url = '/pages/ucenter/index/index'
      break;
    case SHOP_CONFIG_TYPE.custom:
      url = `/pages/custom/page/page`
      break;
  }
  console.log('===url==', url);
  Taro.switchTab({
    url
  })

}
