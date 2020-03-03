import Taro , { Component, closeBLEConnection } from '@tarojs/taro';
import { View, Text , Navigator, ScrollView, Image} from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.less';

@connect(({catalog, goods}) => ({
  ...catalog,
  goodsCount: goods.goodsCount,
}))
class Index extends Component {

   config = {
    navigationBarTitleText: '分类',
    enablePullDownRefresh: true
  }

  state={}

  componentDidMount () {
    this.getData();
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getData(() => {
      Taro.hideNavigationBarLoading() //完成停止加载
      Taro.stopPullDownRefresh() //停止下拉刷新
    });
  }

  getData = (cbk) => {
    const { dispatch } = this.props;
    dispatch({type: 'catalog/getCatalogList'}).then(() => {
      cbk && cbk()
    })
    dispatch({type: 'goods/getGoodsCount'})
  }

  switchCate = (data) => {
    const {currentCategory, dispatch} = this.props;
    if (currentCategory.id == data.id) {
      return false;
    }
    dispatch({type: 'catalog/getCurrentCategory', payload: data.id})

    // this.getCurrentCategory(event.currentTarget.dataset.id);
  }

  render() {
    const {categoryList, currentCategory, currentSubCategory, goodsCount} = this.props;
    return (
      <View className='container'>
        <View className='search'>
          <Navigator url='/pages/search/search' className='input'>
            <van-icon name='search' />
            <Text className='txt'>商品搜索, 共{goodsCount}款好物</Text>
          </Navigator>
        </View>
        <View className='catalog'>
          <ScrollView className='nav' scrollY>
            {
              Array.isArray(categoryList) && categoryList.map(item => {
                return  <View
                  className={`item ${ currentCategory.id == item.id ? 'active' : ''}`}
                  key='id'
                  onClick={() => this.switchCate(item)}
                >
                    {item.name}
                </View>
              })
            }
          </ScrollView>
          <ScrollView className='cate' scrollY>
            <Navigator url='url' className='banner'>
              <Image className='image' src={currentCategory.picUrl}></Image>
              <View className='txt'>{currentCategory.frontName}</View>
            </Navigator>
            <View className='hd'>
              <Text className='line'></Text>
              <Text className='txt'>{currentCategory.name}分类</Text>
              <Text className='line'></Text>
            </View>
            <View className='bd'>
              {
                Array.isArray(currentSubCategory) && currentSubCategory.map((item, index) => {
                  return <Navigator url={`/pages/category/category?id=${item.id}`} className={`item ${(index+1) % 3 == 0 ? 'last' : ''}`} key={item.id}>
                    <Image className='icon' src={item.picUrl}></Image>
                    <Text className='txt'>{item.name}</Text>
                  </Navigator>
                })
              }
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Index;
