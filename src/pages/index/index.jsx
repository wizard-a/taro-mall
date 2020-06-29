import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtIcon, AtTag} from 'taro-ui';
import { TabBar } from '../../components';
import { get as getGlobalData} from '../../global_data';
import { couponReceive } from '../../services/coupon';

import './index.less'

@connect(({ home, goods, config }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
  theme: config.theme
}))
class Index extends PureComponent {

  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    usingComponents: {}
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/getIndex'})
    dispatch({type: 'goods/getGoodsCount'})
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getData();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  componentWillMount() {
    // 页面初始化 options为页面跳转所带来的参数
    let {scene, grouponId, goodId, orderId} =  this.$router.params;
    if (scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      scene = decodeURIComponent(scene);
      console.log("scene:" + scene);

      let info_arr = [];
      info_arr = scene.split(',');
      let _type = info_arr[0];
      let id = info_arr[1];

      if (_type == 'goods') {
        Taro.navigateTo({
          url: '../goods/goods?id=' + id
        });
      } else if (_type == 'groupon') {
        Taro.navigateTo({
          url: '../goods/goods?grouponId=' + id
        });
      } else {
        Taro.navigateTo({
          url: '../index/index'
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?grouponId=' + grouponId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?id=' + goodId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../ucenter/orderDetail/orderDetail?id=' + orderId
      });
    }

    this.getData();

  }

  onShareAppMessage () {
    return {
      title: 'Taro mall小程序商场',
      desc: 'Taro 开源微信小程序商城',
      path: '/pages/index/index'
    }
  }

  getCoupon = (e) => {
    if (!getGlobalData('hasLogin')) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId
    }).then(() => {
      Taro.showToast({
        title: "领取成功"
      })
    })
  }

  render () {
    const {goodsCount, data, theme} = this.props;
    return (
      <Block>
        <View className='bar-container container'>
          <View className='search'>
            <Navigator url='/pages/search/search' className='input'>
              <AtIcon className='icon' size='18' color='#666' value='search' />
              <Text className='txt'>商品搜索, 共{goodsCount}款好物</Text>
            </Navigator>
          </View>
          <Swiper className='banner' indicatorDots autoplay interval='3000' duration='100'>
            {
              data.banner && data.banner.map(item => {
                return <SwiperItem key={item.id}>
                  {
                    item.link > 0 ? <Navigator url={`/pages/goods/goods?id=${item.link}`}>
                      <Image className='img' src={item.url} />
                    </Navigator> : <Image className='img' src={item.url} />
                  }
                </SwiperItem>
              })
            }
          </Swiper>
          <View className='m-menu'>
            {
              data.channel && data.channel.map(item => {
                return <Navigator key={item.id} className='item' url={`/pages/category/category?id=${item.id}`}>
                  <Image className='img' src={item.iconUrl} />
                  <Text className='txt'>{item.name}</Text>
                </Navigator>
              })
            }
          </View>

          {
            data.couponList && data.couponList.length > 0 && <View className='a-section a-coupon'>
              <View className='h'>
                <View className='title'>
                  <View>
                    <Navigator url='/pages/coupon/coupon'>
                      <Text className='txt'>优惠券</Text>
                    </Navigator>
                  </View>
                </View>
              </View>
              <View className='b'>
                {
                  data.couponList.map(item => {
                    return <View onClick={this.getCoupon} data-index={item.id} className='item' key={item.id}>
                      <View className='tag'>{item.tag}</View>
                      <View className='content'>
                        <View className='left'>
                          <View className='discount'>{item.discount}元</View>
                          <View className='min'> 满{item.min}元使用</View>
                        </View>
                        <View className='right'>
                          <View className='name'>{item.name}</View>
                          <View className='desc'>{item.desc}</View>
                          {
                            item.days != 0 ? <View className='time' >有效期：{item.days}天</View> : <View className='time'> 有效期：{item.startTime} - {item.endTime}</View>
                          }
                        </View>
                      </View>
                    </View>
                  })
                }
              </View>
            </View>
          }

          {
            data.grouponList && data.grouponList.length > 0 && <View className='a-section a-groupon'>
              <View className='h'>
                <View className='title'>
                  <View>
                    <Navigator url='/pages/groupon/grouponList/grouponList'>
                      <Text className='txt'>团购专区</Text>
                    </Navigator>
                  </View>
                </View>
              </View>
                <View className='b'>
                {
                  data.grouponList.map(item => {
                    return <View className='item' key={item.id}>
                        <Navigator url={`/pages/goods/goods?id=${item.id}`}>
                        <Image className='img' src={item.picUrl}></Image>
                        <View className='right'>
                          <View className='Text'>
                            <View className='header'>
                              <Text className='name'>{item.name}</Text>
                              <AtTag customStyle={{background: theme.primary}} classNam='tag' size='small' active type='primary'>{item.grouponMember}人成团</AtTag>
                            </View>
                            <View className='expire'>
                              <AtTag className='expireTag' size='small' circle>有效期 {item.expireTime}</AtTag>
                            </View>
                            <Text className='desc'>{item.brief}</Text>
                            <View className='price'>
                              <View className='counterPrice'>现价：￥{item.retailPrice}</View>
                              <View className='retailPrice'>团购价：￥{item.grouponPrice}</View>
                            </View>
                          </View>
                        </View>
                      </Navigator>
                    </View>
                  })
                }
              </View>
            </View>
          }

          {
            data.newGoodsList && data.newGoodsList.length > 0 && <View className='a-section a-new'>
                <View className='h'>
                  <View>
                    <Navigator url='../newGoods/newGoods'>
                      <Text className='txt'>周一周四 · 新品首发</Text>
                    </Navigator>
                  </View>
                </View>
                <View className='b'>
                  {data.newGoodsList.map(item => {
                    return <View className='item' key={item.id}>
                      <Navigator url={`../goods/goods?id=${item.id}`}>
                        <Image className='img' src={item.picUrl}></Image>
                        <Text className='name'>{item.name}</Text>
                        <Text className='price'>￥{item.retailPrice}</Text>
                      </Navigator>
                    </View>
                  })}

                </View>
            </View>
          }

          {
            data.brandList && data.brandList.length > 0 && <View className='a-section a-brand'>
              <View className='h'>
                <Navigator url='../brand/brand'>
                  <Text className='txt'>品牌制造商直供</Text>
                </Navigator>
              </View>
              <View className='b'>
                {
                  data.brandList.map(item => {
                    return <View className='item item-1' key={item.id}>
                      <Navigator url={`/pages/brandDetail/brandDetail?id=${item.id}`}>
                        <View className='wrap'>
                          <Image className='img' src={item.picUrl} mode='aspectFill'></Image>
                          <View className='mt'>
                            <Text className='brand'>{item.name}</Text>
                            <Text className='price'>{item.floorPrice}</Text>
                            <Text className='unit'>元起</Text>
                          </View>
                        </View>
                      </Navigator>
                    </View>
                  })
                }
              </View>
            </View>
          }

          {
            data.hotGoodsList && data.hotGoodsList.length > 0 && <View className='a-section a-popular'>
              <View className='h'>
                <View>
                  <Navigator url='../hotGoods/hotGoods'>
                    <Text className='txt'>人气推荐</Text>
                  </Navigator>
                </View>
              </View>
              <View className='b'>
                {
                  data.hotGoodsList.map(item => {
                    return <View className='item' key={item.id}>
                      <Navigator url={`/pages/goods/goods?id=${item.id}`}>
                        <Image className='img' src={item.picUrl}></Image>
                        <View className='right'>
                          <View className='Text'>
                            <Text className='name'>{item.name}</Text>
                            <Text className='desc'>{item.brief}</Text>
                            <Text className='price'>￥{item.retailPrice}</Text>
                          </View>
                        </View>
                      </Navigator>
                    </View>
                  })
                }
              </View>
            </View>
          }

          {
            data.topicList && data.topicList.length > 0 &&  <View className='a-section a-topic'>
              <View className='h'>
                <View>
                  <Navigator url='/pages/topic/topic'>
                    <Text className='txt'>专题精选</Text>
                  </Navigator>
                </View>
              </View>
              <View className='b'>
                <ScrollView scrollX className='list'>
                  {
                    data.topicList.map(item => {
                      return  <View className='item' key={item.id}>
                        <Navigator url={`../topicDetail/topicDetail?id=${item.id}`}>
                          <Image className='img' src={item.picUrl}></Image>
                          <View className='np'>
                            <Text className='name'>{item.title}</Text>
                            <Text className='price'>￥{item.price}元起</Text>
                          </View>
                          <Text className='desc'>{item.subtitle}</Text>
                        </Navigator>
                      </View>
                    })
                  }
                </ScrollView>
              </View>
            </View>
          }


          {
            data.floorGoodsList && data.floorGoodsList.length > 0 && data.floorGoodsList.map(item => {
              return <View className='good-grid' key={item.id}>
                <View className='h'>
                  <Text>{item.name}</Text>
                </View>
                <View className='b'>
                  {
                    item.goodsList && item.goodsList.map((good, index) => {
                      return  <Block key={good.id}>
                        <View className={`item ${index % 2 == 0 ? '' : 'item-b'}`}>
                          <Navigator url={`../goods/goods?id=${good.id}`} className='a'>
                            <Image className='img' src={good.picUrl}></Image>
                            <Text className='name'>{good.name}</Text>
                            <Text className='price'>￥{good.retailPrice}</Text>
                          </Navigator>
                        </View>
                      </Block>
                    })
                  }
                </View>
                <Navigator url={`/pages/category/category?id=${item.id}`} className='t'>
                  <View className='txt'>{'更多'+item.name+'好物 >'}</View>
                </Navigator>
              </View>
            })
          }
        </View>
      </Block>
    )
  }
}

export default Index
