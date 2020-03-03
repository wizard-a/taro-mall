import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getOrderListApi(payload) {
  return request.get(Api.OrderList, payload);
}
