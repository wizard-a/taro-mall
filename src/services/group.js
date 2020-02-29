import request from '../utils/request';
import Api from '../config/api';

/**
 *  团购API-详情
 */
export async function groupOnJoin(payload) {
  return request.post(Api.GroupOnJoin, payload);
}


