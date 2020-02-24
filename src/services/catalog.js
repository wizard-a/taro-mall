import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取分类list
 */
export async function getCatalogList() {
  return request.get(Api.CatalogList);
}


/**
 *  获取当前分类
 */
export async function getCurrentCategory(id) {
  return request.get(Api.CatalogCurrent, { id: id});
}
