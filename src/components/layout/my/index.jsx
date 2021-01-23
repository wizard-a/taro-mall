import React, { PureComponent} from 'react';
import Taro from '@tarojs/taro';
import { View, Image} from '@tarojs/components';
import { AtIcon, AtList, AtGrid, AtListItem, AtBadge } from 'taro-ui';
import Badge from '../../badge/index';
import BindPhone from '../../bind-phone/index';
import Contact from '../../contact/index';
import * as app from '../../../utils/app';
import * as images from '../../../static/images/index';

import './my.less';


const POWER_LIST_CONFIG = {
  coupon: {
    image: images.coupon,
    value: '优惠券',
    url: '/pages/ucenter/couponList/couponList'
  },
  collect: {
    image: images.collect,
    value: '收藏',
    url: '/pages/ucenter/collect/collect'
  },
  footprint: {
    image: images.footprint,
    value: '足迹',
    url: '/pages/ucenter/footprint/footprint'
  },
  group: {
    image: images.group,
    value: '拼团',
    url: '/pages/groupon/myGroupon/myGroupon'
  },
  address: {
    image: images.address,
    value: '地址',
    url: '/pages/ucenter/address/address'
  },
  bindPhone: {
    image: images.mobile,
    value: '绑定手机',
    url: ''
  },
  customer: {
    image: images.customer,
    value: '联系客服',
    url: ''
  },
  about: {
    image: images.about,
    value: '关于我们',
    url: '/pages/about/about'
  }

}
class My extends PureComponent {

  state={
    orderData: [
      {
        image: images.pendpay,
        value: '待付款',
        type: 'pendPay',
        oderType: 'unpaid',

      }, {
        image: images.send,
        value: '待发货',
        type: 'send',
        oderType: 'unship',
      }, {
        image: images.receive,
        value: '待收货',
        type: 'receive',
        oderType: 'unrecv',
      }, {
        image: images.comment,
        value: '待评价',
        type: 'comment',
        oderType: 'uncomment',
      }, {
        image: images.aftersale,
        value: '售后',
        type: 'aftersale',
        oderType: 'none',
      }
    ]
  }

  handleVip = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  handleOrder = (tab) => {
    try {
      Taro.setStorageSync('tab', tab);
    } catch (e) {
    }
    app.navigateToCheck('/pages/ucenter/order/order')
  }

  handlePowerClick = (child) => {
    if (child.url && child.type !== 'about') {
      app.navigateToCheck(child.url)
    } else {
      Taro.navigateTo({url: child.url})
    }
  }

  convertPowerListSudoku = () => {
    const {config} = this.props;
    let powerList = [];

    powerList = config.powerList.filter(f => f.type !== 'split')

    return powerList.map(item => {
      return {
        ...POWER_LIST_CONFIG[item.type],
        type: item.type
      }
    })
  }

  convertPowerListNormal() {
    const {config} = this.props;
    let powerListRes = [];
    let currPowerList = [];
    for (let i = 0; i < config.powerList.length; i++) {
      const item = config.powerList[i];
      if (item.type === 'split') {
        powerListRes.push([...currPowerList]);
        currPowerList = [];
      } else {
        currPowerList.push({
          ...POWER_LIST_CONFIG[item.type],
          type: item.type
        })
      }
    }
    if (currPowerList.length > 0) {
      powerListRes.push(currPowerList)
    }
    // console.log('===powerListRes', powerListRes, config.powerList);
    return powerListRes.map((item) => {
      return <AtList hasBorder={false} key={item}>
        {
          item.map((child, index) => {
            return child.type === 'bindPhone' ?
            <BindPhone>
              {
                <AtListItem
                  key={child.type}
                  thumb={child.image}
                  hasBorder={index !== item.length-1}
                  title={child.value}
                  arrow='right'
                />
              }
            </BindPhone> : child.type === 'customer' ?
            <Contact>
              <AtListItem
                key={child.type}
                thumb={child.image}
                hasBorder={index !== item.length-1}
                title={child.value}
                arrow='right'
              />
            </Contact> : <AtListItem
              key={child.type}
              thumb={child.image}
              hasBorder={index !== item.length-1}
              title={child.value}
              arrow='right'
              onClick={() => this.handlePowerClick(child)}
            />
          })
        }
    </AtList>
    })

  }

  render() {
    const { config, userInfo, order } = this.props;
    const {orderData} = this.state;
    console.log('config', config, userInfo, order);
    return (
      <View className='layout-my'>
        <View
          style={{backgroundImage: config.bgGradient === 'white' ? `linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255)), url(${images.headerBg})` : `url(${images.headerBg})`}}
          className={`header ${config.headPosition}`}
        >
            <Image className='avatar' src={userInfo.avatarUrl}></Image>
            <View className='info'>
              {userInfo.nickName}
            </View>
            <View className='vip' onClick={this.handleVip}>
              <View>微商城</View>
              <AtIcon value='chevron-right' size='15' color='#fff'></AtIcon>
            </View>
        </View>
        <View className='split-line'></View>
        <View className='container'>
          <View className='box-item'>
            <View className='box-item-header'>
              <View className='title'>我的订单</View>
              <View className='all-order' onClick={() => this.handleOrder(0)}>
                <View>查看全部订单</View>
                <AtIcon value='chevron-right' size='18' color='#969799'></AtIcon>
              </View>
            </View>
            <View className='box-item-content'>
              {
                orderData.map((item, index) => {
                  return <Badge key={item.type} hidden={order[item.oderType] == 0} value={order[item.oderType]} maxValue={99}>
                      <View className='item' onClick={() => this.handleOrder(index + 1)}>
                        <Image className='img' src={item.image} />
                        <View className='name'>{item.value}</View>
                    </View>
                  </Badge>
                })
              }
            </View>
          </View>
        </View>
        <View className='container power-list'>
          {
            config.pageStyle === 'sudoku' &&  <AtGrid columnNum={5} hasBorder={false} data={this.convertPowerListSudoku()} />
          }
          {
            config.pageStyle === 'normal' && this.convertPowerListNormal()
          }
        </View>
        <View className='split-line'></View>
      </View>
    );
  }
}

My.defaultProps = {
  config: {},
  userInfo: {},
  order:{}
}
export default My;
