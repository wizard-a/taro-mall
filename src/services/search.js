import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getSearchHelper(keyword) {
  return request.get(Api.SearchHelper, {keyword});
}

export async function getSearchIndex() {
  return request.get(Api.SearchIndex);
}

/** 清楚历史记录 */
export async function clearHistory() {
  return request.post(Api.SearchClearHistory);
}
