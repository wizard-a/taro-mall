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
