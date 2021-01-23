import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取我的优惠券
 */
export async function getCouponMyList(payload) {
  return request.get(Api.CouponMyList, payload);
}


/**
 *  优惠券 change
 */
export async function couponExchange(payload) {
  return request.post(Api.CouponExchange, payload);
}


/**
 *  优惠券 change
 */
export async function couponSelectList(payload) {
  return request.post(Api.CouponSelectList, payload);
}

/**
 *  领取 优惠券
 */
export async function couponReceive(payload) {
  return request.post(Api.CouponReceive, payload);
}


export async function getCouponListApi(payload) {
  return request.get(Api.CouponList, payload);
}
