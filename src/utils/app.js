
import Taro from '@tarojs/taro';
import store from '../dva';
import {SHOP_CONFIG_TYPE} from './enum';
import {set as setGlobalData, get as getGlobalData} from '../global_data';

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

/**
 * 跳转先check(没登录跳转登录页面)
 * @param {*} url
 */
export const navigateToCheck = (url) => {
  if (getGlobalData('hasLogin')) {
    Taro.navigateTo({
      url,
      success: function() {},
      fail: function() {},
      complete: function() {},
    })
  } else {
    Taro.navigateTo({
      url: "/pages/auth/login/login"
    });
  }
}

export const isLogin = () => {
  return getGlobalData('hasLogin');
}
