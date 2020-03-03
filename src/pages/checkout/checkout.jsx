import Taro , { Component } from '@tarojs/taro';
import { View, Text , Image, Input} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { cartCheckout, orderSubmit, orderPrepay } from '../../services/cart';
import {showErrorToast} from '../../utils/util';

import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '填写订单'
  }

  state={
    checkedGoodsList: [],
    checkedAddress: {},
    availableCouponLength: 0, // 可用的优惠券数量
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    grouponPrice: 0.00, //团购优惠价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    cartId: 0,
    addressId: 0,
    couponId: 0,
    userCouponId: 0,
    message: '',
    grouponLinkId: 0, //参与的团购
    grouponRulesId: 0 //团购规则ID
  }

  componentWillMount () {}
  componentDidMount () {}
  componentWillReceiveProps (nextProps,nextConText) {}
  componentWillUnmount () {}
  componentDidShow () {
     // 页面显示
     Taro.showLoading({
      title: '加载中...',
    });
    try {
      var cartId = Taro.getStorageSync('cartId');
      if (cartId === "") {
        cartId = 0;
      }
      var addressId = Taro.getStorageSync('addressId');
      if (addressId === "") {
        addressId = 0;
      }
      var couponId = Taro.getStorageSync('couponId');
      if (couponId === "") {
        couponId = 0;
      }
      var userCouponId = Taro.getStorageSync('userCouponId');
      if (userCouponId === "") {
        userCouponId = 0;
      }
      var grouponRulesId = Taro.getStorageSync('grouponRulesId');
      if (grouponRulesId === "") {
        grouponRulesId = 0;
      }
      var grouponLinkId = Taro.getStorageSync('grouponLinkId');
      if (grouponLinkId === "") {
        grouponLinkId = 0;
      }
      this.setState({
        cartId: cartId,
        addressId: addressId,
        couponId: couponId,
        userCouponId: userCouponId,
        grouponRulesId: grouponRulesId,
        grouponLinkId: grouponLinkId
      }, () => {
        this.getCheckoutInfo();
      });

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }


  }

  getCheckoutInfo = () => {
    cartCheckout({
      cartId: this.state.cartId,
      addressId: this.state.addressId,
      couponId: this.state.couponId,
      userCouponId: this.state.userCouponId,
      grouponRulesId: this.state.grouponRulesId
    }).then(res => {
      this.setState({
        checkedGoodsList: res.checkedGoodsList,
        checkedAddress: res.checkedAddress,
        availableCouponLength: res.availableCouponLength,
        actualPrice: res.actualPrice,
        couponPrice: res.couponPrice,
        grouponPrice: res.grouponPrice,
        freightPrice: res.freightPrice,
        goodsTotalPrice: res.goodsTotalPrice,
        orderTotalPrice: res.orderTotalPrice,
        addressId: res.addressId,
        couponId: res.couponId,
        userCouponId: res.userCouponId,
        grouponRulesId: res.grouponRulesId,
      });
      Taro.hideLoading();
    }).then(() => {
      Taro.hideLoading();
    } )
  }
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  selectAddress = () => {
    Taro.navigateTo({
      url: '/pages/ucenter/address/address',
    })
  }

  selectCoupon = () => {
    Taro.navigateTo({
      url: '/pages/ucenter/couponSelect/couponSelect',
    })
  }

  bindMessageInput = (e) => {
    this.setState({
      message: e.detail.value
    });
  }

  submitOrder = () => {
    if (this.state.addressId <= 0) {
      showErrorToast('请选择收货地址');
      return false;
    }
    orderSubmit({
      cartId: this.state.cartId,
      addressId: this.state.addressId,
      couponId: this.state.couponId,
      userCouponId: this.state.userCouponId,
      message: this.state.message,
      grouponRulesId: this.state.grouponRulesId,
      grouponLinkId: this.state.grouponLinkId
    }).then(res => {
      // 下单成功，重置couponId
      try {
        Taro.setStorageSync('couponId', 0);
      } catch (error) {

      }

      const orderId = res.orderId;
        const grouponLinkId = res.grouponLinkId;
        orderPrepay({
          orderId: orderId
        }).then(res => {
          const payParam = res;
          console.log("支付过程开始");
          Taro.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.packageValue,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function(res) {
              console.log("支付过程成功");
              if (grouponLinkId) {
                setTimeout(() => {
                  Taro.redirectTo({
                    url: '/pages/groupon/grouponDetail/grouponDetail?id=' + grouponLinkId
                  })
                }, 1000);
              } else {
                Taro.redirectTo({
                  url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                });
              }
            },
            'fail': function(res) {
              console.log("支付过程失败");
              Taro.redirectTo({
                url: '/pages/payResult/payResult?status=0&orderId=' + orderId
              });
            },
            'complete': function(res) {
              console.log("支付过程结束")
            }
          });
        }).catch(() => {
          Taro.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        })
    })
  }

  render() {
    const {checkedAddress, couponId, checkedGoodsList, availableCouponLength, couponPrice, message, goodsTotalPrice, freightPrice, actualPrice} = this.state;
    return (
      <View className='container'>
        <View className='address-box'>
          {
            checkedAddress.id > 0 ? <View className='address-item' onClick={this.selectAddress}>
              <View className='l'>
                <Text className='name'>{checkedAddress.name}</Text>
                {checkedAddress.isDefault && <Text className='default'>默认</Text>}
              </View>
              <View className='m'>
                <Text className='mobile'>{checkedAddress.tel}</Text>
                <Text className='address'>{checkedAddress.addressDetail}</Text>
              </View>
              <View className='r'>
                <AtIcon size='14' color='#666' value='chevron-right' />
              </View>
            </View> : <View className='address-item address-empty' onClick={this.selectAddress}>
              <View className='m'>
                还没有收货地址，去添加
              </View>
              <View className='r'>
                <AtIcon size='14' color='#666' value='chevron-right' />
              </View>
            </View>
          }
        </View>

        <View className='coupon-box'>
          <View className='coupon-item' onClick={this.selectCoupon}>
            {
              couponId == 0 && <View className='l'>
                <Text className='name'>没有可用的优惠券</Text>
                <Text className='txt'>0张</Text>
              </View>
            }
           {
              couponId == -1 && <View className='l'>
                <Text className='name'>优惠券</Text>
                <Text className='txt'>{availableCouponLength}张</Text>
              </View>
           }
            {
              couponId != -1 && couponId != 0 && <View className='l'>
              <Text className='name'>优惠券</Text>
              <Text className='txt'>-￥{couponPrice}元</Text>
            </View>
            }
            <View className='r'>
              <AtIcon size='14' color='#666' value='chevron-right' />
            </View>
          </View>
        </View>

        <View className='message-box'>
          <Input className='message-item' onInput={this.bindMessageInput} placeholder='如需要，请输入留言' value={message} />
        </View>

        <View className='order-box'>
          <View className='order-item'>
            <View className='l'>
              <Text className='name'>商品合计</Text>
            </View>
            <View className='r'>
              <Text className='txt'>￥{goodsTotalPrice}元</Text>
            </View>
          </View>
          <View className='order-item'>
            <View className='l'>
              <Text className='name'>运费</Text>
            </View>
            <View className='r'>
              <Text className='txt'>￥{freightPrice}元</Text>
            </View>
          </View>
          <View className='order-item no-border'>
            <View className='l'>
              <Text className='name'>优惠券</Text>
            </View>
            <View className='r'>
              <Text className='txt'>-￥{couponPrice}元</Text>
            </View>
          </View>
        </View>

        <View className='goods-items'>
          {
            checkedGoodsList.map(item => {
              return <View className='item' key={item.id}>
                <View className='img'>
                  <Image src={item.picUrl}></Image>
                </View>
                <View className='info'>
                  <View className='t'>
                    <Text className='name'>{item.goodsName}</Text>
                    <Text className='number'>x{item.number}</Text>
                  </View>
                  <View className='m'>{item.specifications}</View>
                  <View className='b'>￥{item.price}</View>
                </View>
              </View>
            })
          }
        </View>

        <View className='order-total'>
          <View className='l'>实付：￥{actualPrice}</View>
          <View className='r' onClick={this.submitOrder}>去付款</View>
        </View>
      </View>
    );
  }
}
export default Index;
