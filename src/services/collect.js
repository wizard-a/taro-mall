import request from '../utils/request';
import Api from '../config/api';

/**
 *  收藏添加和删除
 */
export async function collectAddOrDelete(payload) {
  return request.post(Api.CollectAddOrDelete, payload);
}


/**
 * 获取 collect list
 * @param {*} payload
 */
export async function getCollectListApi(payload) {
  return request.get(Api.CollectList, payload)
}
