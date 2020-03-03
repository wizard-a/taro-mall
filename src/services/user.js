import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getUserIndex() {
  return request.get(Api.UserIndex);
}
