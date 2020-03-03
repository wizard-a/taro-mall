import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button, Navigator} from '@tarojs/components';
import { orderPrepay } from '../../services/order';
import { showErrorToast } from '../../utils/util';
import './index.less';

class Index extends Component {

   config = {
    "navigationBarTitleText": "付款结果",
    "navigationBarBackgroundColor": "#fafafa"
  }

  state={
    status: false,
    orderId: 0
  }

  componentWillMount () {}
  componentDidMount () {
     const { orderId, status } = this.$router.params;
     this.setState({
      orderId: orderId,
      status: status === '1' ? true : false
    })
  }

  payOrder = () => {
    orderPrepay({
      orderId: this.state.orderId
    }).then(res => {
      const payParam = res;
      console.log("支付过程开始")
      Taro.requestPayment({
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.packageValue,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        'success': function() {
          console.log("支付过程成功")
          this.setState({
            status: true
          });
        },
        'fail': function() {
          console.log("支付过程失败")
          showErrorToast('支付失败');
        },
        'complete': function() {
          console.log("支付过程结束")
        }
      });
    })
  }

  render() {
    const {status} = this.state;
    return (
      <View className='container'>
        <View className='pay-result'>
          {
            status && <View className='success'>
            <View className='msg'>付款成功</View>
            <View className='btns'>
              <Navigator className='btn' url='/pages/ucenter/order/order' openType='redirect'>查看订单</Navigator>
              <Navigator className='btn' url='/pages/index/index' openType='switchTab'>继续逛</Navigator>
            </View>
          </View>
          }
          {
            !status && <View className='error'>
              <View className='msg'>付款失败</View>
              <View className='tips'>
                <View className='p'>请在
                  <Text className='time'>半小时</Text> 内完成付款</View>
                <View className='p'>否则订单将会被系统取消</View>
              </View>
              <View className='btns'>
                <Navigator className='btn' url='/pages/ucenter/order/order' openType='redirect'>查看订单</Navigator>
                <View className='btn' onClick={this.payOrder}>重新付款</View>
              </View>
            </View>
          }
        </View>
      </View>
    );
  }
}
export default Index;
