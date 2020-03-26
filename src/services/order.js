import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getOrderListApi(payload) {
  return request.get(Api.OrderList, payload);
}

/**
 * 订单重新支付
 * @param {*} payload
 */
export async function orderPrepay(payload) {
  return request.post(Api.OrderPrepay, payload);
}



/**
 * 订单重新支付
 * @param {*} payload
 */
export async function orderDetail(payload) {
  return request.get(Api.OrderDetail, payload);
}

/**
 * 取消订单
 * @param {*} payload
 */
export async function orderCancel(payload) {
  return request.post(Api.OrderCancel, payload);
}

/**
 * 订单确认
 * @param {*} payload
 */
export async function orderConfirm(payload) {
  return request.post(Api.OrderConfirm, payload);
}

/**
 * 订单删除
 * @param {*} payload
 */
export async function orderDelete(payload) {
  return request.post(Api.OrderDelete, payload);
}


/**
 * 订单
 * @param {*} payload
 */
export async function orderRefund(payload) {
  return request.post(Api.OrderRefund, payload);
}



