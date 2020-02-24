import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取商品总数量
 */
export async function getGoodsCount() {
  return request.get(Api.GoodsCount);
}


/**
 *  分页获取商品信息
 */
export async function getGoodsList({keyword, page, limit, sort, order, categoryId}) {
  return request.get(Api.GoodsList, {keyword, page, limit, sort, order, categoryId});
}
