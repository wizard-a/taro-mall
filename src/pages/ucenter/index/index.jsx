import Taro , { Component, clearStorage } from '@tarojs/taro';
import { View, Text , Button, Image} from '@tarojs/components';
import {bindPhone, logOut} from '../../../services/auth';
import { getUserIndex } from '../../../services/user';
import {set as setGlobalData, get as getGlobalData} from '../../../global_data';
import * as images from '../../../static/images/index';
import './index.less';

class Index extends Component {

   config = {
    'backgroundColor': '#f4f4f4',
    'navigationBarTitleText': '个人中心',
    'enablePullDownRefresh': false
  }

  state={
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/static/images/my.png'
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    hasLogin: false
  }



  componentDidShow () {
    //获取用户的登录信息
    if (getGlobalData('hasLogin')) {
      let userInfo = Taro.getStorageSync('userInfo');
      this.setState({
        userInfo: userInfo,
        hasLogin: true
      });

      getUserIndex().then(res => {
        this.setState({
          order: res.order
        });
      });
    }
  }

  goLogin = () => {
    if (!this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  }

  goOrder = () => {
    if (this.state.hasLogin) {
      try {
        Taro.setStorageSync('tab', 0);
      } catch (e) {

      }
      Taro.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  }

  goOrderIndex = (e) => {
    // TODO 需处理
    if (this.state.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        Taro.setStorageSync('tab', tab);
      } catch (e) {

      }
      Taro.navigateTo({
        url: route,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goAfterSale = () => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/aftersaleList/aftersaleList"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goCoupon = () => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/couponList/couponList"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goGroupon = () =>{
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/groupon/myGroupon/myGroupon"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goCollect = () => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/collect/collect"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goFeedback =() => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/feedback/feedback"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goFootprint = () => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  goAddress = () => {
    if (this.state.hasLogin) {
      Taro.navigateTo({
        url: "/pages/ucenter/address/address"
      });
    } else {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }

  bindPhoneNumber = (e) => {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      Taro.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    bindPhone({
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }).then(() => {
      Taro.showToast({
        title: '绑定手机号码成功',
        icon: 'success',
        duration: 2000
      });
    })
  }

  goHelp = () => {
    Taro.navigateTo({
      url: '/pages/help/help'
    });
  }

  aboutUs = () => {
    Taro.navigateTo({
      url: '/pages/about/about'
    });
  }
  exitLogin = () => {
    Taro.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }
        logOut().then(() => {
          setGlobalData('hasLogin', false)
          Taro.removeStorageSync('token');
          Taro.removeStorageSync('userInfo');
          Taro.reLaunch({
            url: '/pages/index/index'
          });
        })

      }
    })
  }
  render() {
    const { userInfo, order, hasLogin } = this.state;
    return (
      <View className='container'>
        <View className='profile-info' onClick={this.goLogin}>
          <Image className='avatar' src={userInfo.avatarUrl}></Image>
          <View className='info'>
            <Text className='name'>{userInfo.nickName}</Text>
          </View>
        </View>

        <View className='separate'></View>

        <View className='user_area'>
          <View className='user_row' onClick={this.goOrder}>
            <View className='user_row_left'>我的订单</View>
            <van-icon className='user_row_right' name='arrow' />
          </View>
          <View className='user_column'>
            <View className='user_column_item' onClick={this.goOrderIndex} data-index='1' data-route='/pages/ucenter/order/order'>
              {order.unpaid != 0 && <Text className='user_column_item_badge'>{order.unpaid}</Text>}

              <Image className='user_column_item_image' src={images.pendpay}>
              </Image>
              <View className='user_column_item_text'>待付款</View>
            </View>
            <View className='user_column_item' onClick={this.goOrderIndex} data-index='2' data-route='/pages/ucenter/order/order'>
              {order.unship != 0 && <Text className='user_column_item_badge'>{order.unship}</Text>}
              <Image className='user_column_item_image' src={images.send}></Image>
              <View className='user_column_item_text'>待发货</View>
            </View>
            <View className='user_column_item' onClick={this.goOrderIndex} data-index='3' data-route='/pages/ucenter/order/order'>
              {order.unrecv != 0 && <Text className='user_column_item_badge'>{order.unrecv}</Text>}

              <Image className='user_column_item_image' src={images.receive}></Image>
              <View className='user_column_item_text'>待收货</View>
            </View>
            <View className='user_column_item' onClick={this.goOrderIndex} data-index='4' data-route='/pages/ucenter/order/order'>
              {order.uncomment != 0 && <Text className='user_column_item_badge'>{order.uncomment}</Text>}
              <Image className='user_column_item_image' src={images.comment}></Image>
              <View className='user_column_item_text'>待评价</View>
            </View>
            <View className='user_column_item' onClick={this.goAfterSale}>
              <Image className='user_column_item_image' src={images.aftersale}></Image>
              <View className='user_column_item_text'>售后</View>
            </View>
          </View>
        </View>

        <View className='separate'></View>

        <View className='user_row'>
          <View className='user_row_left'>核心服务</View>
        </View>
        <View className='user_column'>

          <View className='user_column_item' onClick={this.goCoupon}>
            <Image className='user_column_item_image' src={images.coupon}></Image>
            <View className='user_column_item_text'>优惠卷</View>
          </View>
          <View className='user_column_item' onClick={this.goCollect}>
            <Image className='user_column_item_image' src={images.collect}></Image>
            <View className='user_column_item_text'>商品收藏</View>
          </View>
          <View className='user_column_item' onClick={this.goFootprint}>
            <Image className='user_column_item_image' src={images.footprint}></Image>
            <View className='user_column_item_text'>浏览足迹</View>
          </View>
          <View className='user_column_item' onClick={this.goGroupon}>
            <Image className='user_column_item_image' src={images.group}></Image>
            <View className='user_column_item_text'>我的拼团</View>
          </View>

          <View className='user_column_item' onClick={this.goAddress}>
            <Image className='user_column_item_image' src={images.address}></Image>
            <View className='user_column_item_text'>地址管理</View>
          </View>
        </View>
        <View className='separate'></View>

        <View className='user_row'>
          <View className='user_row_left'>必备工具</View>
        </View>
        <View className='user_column'>

          <Button className='user_column_item_phone' openType='getPhoneNumber' onGetPhoneNumber={this.bindPhoneNumber}>
            <Image className='user_column_item_image' src={images.mobile}></Image>
            <View className='user_column_item_text'>绑定手机</View>
          </Button>
          <View className='user_column_item' onClick={this.goHelp}>
            <Image className='user_column_item_image' src={images.help}></Image>
            <View className='user_column_item_text'>帮助中心</View>
          </View>
          <View className='user_column_item' onClick={this.goFeedback}>
            <Image className='user_column_item_image' src={images.feedback}></Image>
            <View className='user_column_item_text'>意见反馈</View>
          </View>
          <View className='user_column_item'>
            <contact-button style='opacity:0;position:absolute;' type='default-dark' session-from='weapp' size='27'>
            </contact-button>
            <Image className='user_column_item_image' src={images.customer}></Image>
            <View className='user_column_item_text'>联系客服</View>
          </View>
          <View className='user_column_item' onClick={this.aboutUs}>
            <Image className='user_column_item_image' src={images.about}></Image>
            <View className='user_column_item_text'>关于我们</View>
          </View>
        </View>
        <View className='separate'></View>
        {
          hasLogin &&  <View className='logout' onClick={this.exitLogin}>退出登录</View>
        }

      </View>
    );
  }
}
export default Index;
