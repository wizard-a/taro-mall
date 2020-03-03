import request from '../utils/request';
import Api from '../config/api';

/**
 *  添加购物车
 */
export async function addCart(payload) {
  return request.post(Api.CartAdd, payload);
}



/**
 *  立即购买
 */
export async function cartFastAdd(payload) {
  return request.post(Api.CartFastAdd, payload);
}

/**
 *  立即购买
 */
export async function getCartGoodsCount(payload) {
  return request.post(Api.CartGoodsCount, payload);
}


export async function cartCheckout(payload) {
  return request.get(Api.CartCheckout, payload)
}

/**
 *  提交订单
 */
export async function orderSubmit(payload) {
  return request.post(Api.OrderSubmit, payload);
}

/**
 *  订单重新支付
 */
export async function orderPrepay(payload) {
  return request.post(Api.OrderPrepay, payload);
}


