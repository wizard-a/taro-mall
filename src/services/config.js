
// bgGradient // 背景渐变  normal white
// headPosition // 头像位置 left center right
// memberLevel // 会员等级是否显示 block none
// pageStyle // 页面风格 normal  sudoku(九宫格)
// powerList: [{type: ''}]  coupon(优惠券) collect(收藏) footprint(足迹) group(拼团) address(地址) bindPhone(绑定手机) customer(联系客服) about(关于我们)


const myConfigData = [
  { type: 'config', title: '个人中心1', color: ''},
  { type: 'my', bgGradient: 'white', headPosition: 'center', memberLevel: 'block', pageStyle: 'normal', powerList: [
    {type: 'coupon'},
    {type: 'collect'},
    {type: 'footprint'},
    {type: 'group'},
    {type: 'split'},
    {type: 'address'},
    {type: 'bindPhone'},
    {type: 'customer'},
    {type: 'about'}
  ]}
]

/**
 *  获取个人中心页面的配置
 */
export async function getConfigPageMy() {
  // return request.get(Api.SearchHelper, {keyword});
  return new Promise((resolve => {
    setTimeout(() => {
      resolve(myConfigData);
    }, 300);

  }))
}
