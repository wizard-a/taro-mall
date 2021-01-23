

import request from '../utils/request';
import Api from '../config/api';

/**
 *  微信登录
 */
export async function loginByWeXin(payload) {
  return request.post(Api.AuthLoginByWeixin, payload);
}

/**
 *  用户登录
 */
export async function loginByAccount(payload) {
  return request.post(Api.AuthLoginByAccount, payload);
}

/**
 *  用户注册验证码
 */
export async function regCaptcha(payload) {
  return request.post(Api.AuthRegisterCaptcha, payload);
}

/**
 *  用户注册
 */
export async function reg(payload) {
  return request.post(Api.AuthRegister, payload);
}

/**
 *  绑定手机号
 */
export async function bindPhone(payload) {
  return request.post(Api.AuthBindPhone, payload);
}

/**
 *  退出登录
 */
export async function logOut() {
  return request.post(Api.AuthLogout);
}


/**
 * 重置密码
 * @param {*} payload
 */
export async function resetPass(payload) {
  return request.post(Api.AuthReset, payload);
}
