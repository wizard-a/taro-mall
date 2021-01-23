
import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取足迹list
 */
export async function getFootprintListApi(payload) {
  return request.get(Api.FootprintList, payload);
}

export async function footprintDelete(payload) {
  return request.post(Api.FootprintDelete, payload)
}
