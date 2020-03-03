

import request from '../utils/request';
import Api from '../config/api';

/**
 *  地址列表
 */
export async function getAddressListApi(payload) {
  return request.get(Api.AddressList, payload);
}





/**
 *  删除地址
 */
export async function deleteAddress(payload) {
  return request.post(Api.AddressDelete, payload);
}


/**
 *  报错地址
 */
export async function saveAddress(payload) {
  return request.post(Api.AddressSave, payload);
}
