

import request from '../utils/request';
import Api from '../config/api';

/**
 *  售后列表
 */
export async function getAftersaleListApi(payload) {
  return request.get(Api.AftersaleList, payload);
}


