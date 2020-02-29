import Taro from '@tarojs/taro';

import {ImgError} from '../static/images/index';

export function showErrorToast(msg) {
  Taro.showToast({
    title: msg,
    image: '../static/images/icon_error.png'
  })
}
