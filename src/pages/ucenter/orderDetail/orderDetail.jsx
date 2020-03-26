import Taro , { Component } from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { View, Text , Image, Navigator} from '@tarojs/components';
import * as ApiOrder from '../../../services/order';
import * as util from '../../../utils/util';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '我的订单'
  }

  state={
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    flag: false,
    handleOption: {}
  }

  componentWillMount () {}
  componentDidMount () {
    console.log('this.$router', this.$router);
    const { id } = this.$router.params;
    this.setState({
      orderId: id
    }, () => {
      this.getOrderDetail();
    });
  }

  getOrderDetail = () => {
    Taro.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      Taro.hideLoading()
    }, 2000);

    let that = this;
    ApiOrder.orderDetail({
      orderId: this.state.orderId
    }).then(res => {
      console.log(res);
        that.setState({
          orderInfo: res.orderInfo,
          orderGoods: res.orderGoods,
          handleOption: res.orderInfo.handleOption,
          expressInfo: res.expressInfo
        });

      Taro.hideLoading();
    }).catch(() => {
      Taro.hideLoading();
    })
  }

  cancelOrder = () => {
    let orderInfo = this.state.orderInfo;
    Taro.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function(res) {
        if (res.confirm) {
          ApiOrder.orderCancel({
            orderId: orderInfo.id
          }).then(res => {
            Taro.showToast({
              title: '取消订单成功'
            });
            util.redirect('/pages/ucenter/order/order');
          })
        }
      }
    });
  }

  payOrder = () => {
    ApiOrder.orderPrepay({
      orderId: this.state.orderId
    }).then(res => {
      const payParam = res;
      Taro.requestPayment({
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.packageValue,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        'success': function() {
          console.log("支付过程成功");
          util.redirect('/pages/ucenter/order/order');
        },
        'fail': function() {
          console.log("支付过程失败");
          util.showErrorToast('支付失败');
        },
        'complete': function() {
          console.log("支付过程结束")
        }
      });
      console.log("支付过程开始");
    })
  }

  confirmOrder = () => {
    let orderInfo = this.state.orderInfo;

    Taro.showModal({
      title: '',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          ApiOrder.orderConfirm({
            orderId: orderInfo.id
          }).then(res => {
            Taro.showToast({
              title: '确认收货成功！'
            });
            util.redirect('/pages/ucenter/order/order');
          })
        }
      }
    });
  }

  deleteOrder = () => {
    let orderInfo = this.state.orderInfo;

    Taro.showModal({
      title: '',
      content: '确定要删除此订单？',
      success: function(res) {
        if (res.confirm) {
          ApiOrder.orderDelete({
            orderId: orderInfo.id
          }).then(() => {
            Taro.showToast({
              title: '删除订单成功'
            });
            util.redirect('/pages/ucenter/order/order');
          })
        }
      }
    });
  }

  refundOrder = () => {
    let orderInfo = this.state.orderInfo;
    Taro.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function(res) {
        if (res.confirm) {
          ApiOrder.orderRefund({
            orderId: orderInfo.id
          }).then(() => {
            Taro.showToast({
              title: '取消订单成功'
            });
            util.redirect('/pages/ucenter/order/order');
          })
        }
      }
    });
  }
  aftersaleOrder = () => {
    if(this.state.orderInfo.aftersaleStatus === 0){
      util.redirect('/pages/ucenter/aftersale/aftersale?id=' + this.state.orderId );
    }
    else{
      util.redirect('/pages/ucenter/aftersaleDetail/aftersaleDetail?id=' + this.state.orderId);
    }
  }

  expandDetail = () => {
    this.setState({
      flag: !this.state.flag
    })
  }

  componentWillReceiveProps (nextProps,nextConText) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}
  render() {
    const {orderInfo, handleOption, orderGoods, expressInfo, flag} = this.state;
    return (
      <View className='container'>
        <View className='order-info'>
          <View className='item'>下单时间：{orderInfo.addTime}</View>
          <View className='item'>订单编号：{orderInfo.orderSn}</View>
          <View className='item'>订单留言：{orderInfo.message}</View>
          <View className='item-c'>
            <View className='l'>实付：
              <Text className='cost'>￥{orderInfo.actualPrice}</Text>
            </View>
            <View className='r'>
              {
                handleOption.cancel && <View className='btn active' onClick={this.cancelOrder}>取消订单</View>
              }
              {
                handleOption.pay && <View className='btn active' onClick={this.payOrder}>去付款</View>
              }
              {
                 handleOption.confirm && <View className='btn active' onClick={this.confirmOrder}>确认收货</View>
              }
              {
                 handleOption.delete && <View className='btn active' onClick={this.deleteOrder}>删除订单</View>
              }
              {
                 handleOption.refund && <View className='btn active' onClick={this.refundOrder}>申请退款</View>
              }
              {
                 handleOption.aftersale && <View className='btn active' onClick={this.aftersaleOrder}>申请售后</View>
              }
            </View>
          </View>
        </View>

        <View className='order-goods'>
          <View className='h'>
            <View className='label'>商品信息</View>
            <View className='status'>{orderInfo.orderStatusText}</View>
          </View>
          <View className='goods'>
            {
              orderGoods && orderGoods.map(item => {
                return <View className='item' key={item.id}>
                  <View className='img'>
                    <Image className='ig' src={item.picUrl}></Image>
                  </View>
                  <View className='info'>
                    <View className='t'>
                      <Text className='name'>{item.goodsName}</Text>
                      <Text className='number'>x{item.number}</Text>
                    </View>
                    <View className='attr'>{item.specifications}</View>
                    <View className='price'>￥{item.price}</View>
                    {
                      handleOption.comment && (item.comment == 0) && <View className='btn active'>
                        <Navigator url={`../../commentPost/commentPost?orderId=${item.orderId}&&valueId=${item.goodsId}&type=0`}>去评价</Navigator>
                      </View>
                    }
                    {
                      handleOption.rebuy && <View className='btn active'>
                        <Navigator url={`../../goods/goods?id=${item.goodsId}`}>再次购买</Navigator>
                      </View>
                    }
                  </View>
                </View>
              })
            }
          </View>

          <View className='order-bottom'>
            <View className='address'>
              <View className='t'>
                <Text className='name'>{orderInfo.consignee}</Text>
                <Text className='mobile'>{orderInfo.mobile}</Text>
              </View>
              <View className='b'>{orderInfo.address}</View>
            </View>
            <View className='total'>
              <View className='t'>
                <Text className='label'>商品合计：</Text>
                <Text className='txt'>￥{orderInfo.goodsPrice}</Text>
              </View>
              <View className='t'>
                <Text className='label'>运费：</Text>
                <Text className='txt'>￥{orderInfo.freightPrice}</Text>
              </View>
              <View className='t'>
                <Text className='label'>优惠：</Text>
                <Text className='txt'>￥-{orderInfo.couponPrice}</Text>
              </View>
            </View>
            <View className='pay-fee'>
              <Text className='label'>实付：</Text>
              <Text className='txt'>￥{orderInfo.actualPrice}</Text>
            </View>
          </View>
        </View>
        {
          orderInfo.expNo && <View className='order-express' onClick={this.expandDetail}>
            <View className='order-express'>
              <View className='title'>
                <View className='t'>快递公司：{orderInfo.expName}</View>
                <View className='b'>物流单号：{orderInfo.expNo}</View>
              </View>
              <AtIcon value='close-circle' size='14' color='#666' />
            </View>
            {
              flag && expressInfo.Traces && expressInfo.Traces.map(item => {
                return <View className='traces' key={item}>
                  <View className='trace'>
                    <View className='acceptStation'>{item.AcceptStation}</View>
                    <View className='acceptTime'>{item.AcceptTime}</View>
                  </View>
                </View>
              })
            }
          </View>
        }

      </View>
    );
  }
}
export default Index;
