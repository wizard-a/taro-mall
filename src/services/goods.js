import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取商品总数量
 */
export async function getGoodsCount() {
  return request.get(Api.GoodsCount);
}
