import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text , Image, Navigator} from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import {getOrderListApi} from '../../../services/order';

import './index.less';

class Index extends Component {

  state={
    orderList: [],
    showType: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  }

  componentDidMount () {
     // 页面初始化 options为页面跳转所带来的参数
     try {
       var tab = Taro.getStorageSync('tab');

       this.setState({
         showType: tab
       });
     } catch (e) {}
  }

  componentDidShow() {
    this.getOrderList();
  }

  getOrderList = () => {
    getOrderListApi({
      showType: this.state.showType,
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      console.log('order-list', res);
      this.setState({
        orderList: this.state.orderList.concat(res.list),
        totalPages: res.pages
      });
    })
  }

  onReachBottom = () => {
    if (this.state.totalPages > this.state.page) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.getOrderList();
      });
    } else {
      Taro.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  switchTab = (tab) => {
    // let showType = event.currentTarget.dataset.index;
    this.setState({
      orderList: [],
      showType: tab,
      page: 1,
      limit: 10,
      totalPages: 1
    }, () => {

      this.getOrderList();
    });
  }


  render() {
    const tabList = [
      { title: '全部' },
      { title: '待付款' },
      { title: '待发货' },
      { title: '待收货' },
      { title: '待评价' }
    ]
    const { orderList, showType} = this.state;
    return (
      <View className='container'>
        <AtTabs current={showType} tabList={tabList} onClick={this.switchTab}>

          {tabList.map((tab, index) => {
            return <AtTabsPane key={tab.title} current={showType} index={index} >
              {
                orderList.length <= 0 && <View className='no-order'>
                  <View className='c'>
                    <Text>还没有任何订单呢</Text>
                  </View>
                </View>
              }
              <View className='orders'>
                {
                  Array.isArray(orderList) && orderList.map(item => {
                    return <Navigator url={`../orderDetail/orderDetail?id=${item.id}`} className='order' openType='redirect' key={item.id}>
                      <View className='h'>
                        <View className='l'>订单编号：{item.orderSn}</View>
                        <View className='r'>{item.orderStatusText}</View>
                      </View>
                      {
                        item.goodsList.map(gitem => {
                          return <View className='goods' key={gitem.id}>
                            <View className='img'>
                              <Image src={gitem.picUrl}></Image>
                            </View>
                            <View className='info'>
                              <Text className='name'>{gitem.goodsName}</Text>
                              <Text className='number'>共{gitem.number}件商品</Text>
                            </View>
                            <View className='status'></View>
                          </View>
                        })
                      }
                      <View className='b'>
                        <View className='l'>实付：￥{item.actualPrice}</View>
                      </View>
                    </Navigator>
                  })
                }
              </View>
            </AtTabsPane>
          })}

        </AtTabs>
      </View>
    );
  }
}
export default Index;
