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
export  async function orderPrepay(payload) {
  return request.post(Api.OrderPrepay, payload);
}
