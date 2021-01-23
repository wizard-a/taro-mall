import request from '../utils/request';
import Api from '../config/api';

/**
 *  团购API-详情
 */
export async function groupOnJoin(payload) {
  return request.post(Api.GroupOnJoin, payload);
}

/**
 * 我的优惠券
 * @param {*} payload
 */
export async function groupOnMy(payload) {
  return request.get(Api.GroupOnMy, payload);
}
