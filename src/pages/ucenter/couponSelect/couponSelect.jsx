import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button, ScrollView, Image} from '@tarojs/components';
import { CouponSelectList } from '../../../services/coupon';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '选择优惠券'
  }

  state={
    couponList: [],
    cartId: 0,
    couponId: 0,
    userCouponId: 0,
    grouponLinkId: 0,
    scrollTop: 0
  }

  componentWillMount () {}
  componentDidMount () {}
  componentWillUnmount () {}
  componentDidShow () {
     // 页面显示
     Taro.showLoading({
      title: '加载中...',
    });

    try {
      let cartId = Taro.getStorageSync('cartId');
      if (!cartId) {
        cartId = 0;
      }

      let couponId = Taro.getStorageSync('couponId');
      if (!couponId) {
        couponId = 0;
      }

      let userCouponId = Taro.getStorageSync('userCouponId');
      if (!userCouponId) {
        userCouponId = 0;
      }

      let grouponRulesId = Taro.getStorageSync('grouponRulesId');
      if (!grouponRulesId) {
        grouponRulesId = 0;
      }

      this.setState({
        cartId: cartId,
        couponId: couponId,
        userCouponId: userCouponId,
        grouponRulesId: grouponRulesId
      }, () => {
        this.getCouponList();
      });

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }

  }

  getCouponList = () => {
    this.setState({
      couponList: []
    }, () => {
      // 页面渲染完成
      Taro.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 2000
      });

      CouponSelectList({
        cartId: this.state.cartId,
        grouponRulesId: this.state.grouponRulesId,
      }).then(res => {
        let list = [];
        for (var i = 0; i < res.list.length; i++) {
          if (res.list[i].available) {
            list.push(res.list[i]);
          }
        }
        this.setState({
          couponList: list
        });
        Taro.hideToast();
      })
    });
  }
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  unselectCoupon = () => {
    // 如果优惠券ID设置-1，则表示订单不使用优惠券
    try {
      Taro.setStorageSync('couponId', -1);
      Taro.setStorageSync('userCouponId', -1);
    } catch (error) {

    }

    Taro.navigateBack();
  }

  selectCoupon = (e) => {
    try {
      Taro.setStorageSync('couponId', e.currentTarget.dataset.cid);
      Taro.setStorageSync('userCouponId', e.currentTarget.dataset.id);
    } catch (error) {

    }

    Taro.navigateBack();
  }

  render() {
    const {couponList, scrollTop } = this.state;
    return (
      <View className='container'>
        <ScrollView className='coupon-list' scrollY scrollTop={scrollTop}>

          <View className='unselect' onClick={this.unselectCoupon}>不选择优惠券</View>
          {
            couponList.map(item => {
              return <View className='item' key={item.id} onClick={this.selectCoupon} data-id={item.id} data-cid={item.cid}>
                <View className='tag'>{item.tag}</View>
                <View className='content'>
                  <View className='left'>
                    <View className='discount'>{item.discount}元</View>
                    <View className='min'> 满{item.min}元使用</View>
                  </View>
                  <View className='right'>
                    <View className='name'>{item.name}</View>
                    <View className='time'> 有效期：{item.startTime} - {item.endTime}</View>
                  </View>
                </View>
                <View className='condition'>
                  <Text className='txt'>{item.desc}</Text>
                  <Image src={item.pic} className='icon'></Image>
                </View>
              </View>
            })
          }
        </ScrollView>
      </View>
    );
  }
}
export default Index;
