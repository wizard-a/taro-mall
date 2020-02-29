

import request from '../utils/request';
import Api from '../config/api';

/**
 *  微信登录
 */
export async function loginByWeXin(payload) {
  return request.post(Api.AuthLoginByWeixin, payload);
}
