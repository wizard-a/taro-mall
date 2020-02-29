import Taro from '@tarojs/taro';

export function showErrorToast(msg) {
  Taro.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}
