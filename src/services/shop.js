import request from '../utils/request';
import Api from '../config/api';
import {Home, HomeSelected, Category, CartSelected, Cart, CategorySelected, My, MySelected} from '../static/images';

const navData = [
  { title: '首页', image: Home, selectedImage: HomeSelected, ref_type: 1 },
  { title: '分类', image: Category, selectedImage: CategorySelected, ref_type: 2 },
  { title: '购物车', image: Cart, selectedImage: CartSelected, ref_type: 3 },
  // { title: '资讯', image: Cart, selectedImage: CartSelected, ref_type: 5, ref_id: 12 },
  { title: '个人', image: My, selectedImage: MySelected, ref_type: 4 }

];


const navData1 = [
  { title: '首页', image: Home, selectedImage: HomeSelected },
  { title: '分类', image: Category, selectedImage: CategorySelected },
  { title: '购物车', image: Cart, selectedImage: CartSelected }
];

/**
 *  获取搜索关键字
 */
export async function getShopNav() {
  // return request.get(Api.SearchHelper, {keyword});
  return new Promise((resolve => {
    setTimeout(() => {
      resolve(navData);
    }, 1000);

  }))
}
/**
 *  获取搜索关键字
 */
export async function getShopNav1() {
  // return request.get(Api.SearchHelper, {keyword});
  return new Promise((resolve => {
    setTimeout(() => {
      resolve(navData1);
    }, 1000);

  }))
}

