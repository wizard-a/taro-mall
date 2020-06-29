import Taro , { Component } from '@tarojs/taro';
import { View, Block} from '@tarojs/components';
import {logOut} from '../../../services/auth';
import {getConfigPageMy} from '../../../services/config';
import { getUserIndex } from '../../../services/user';
import {set as setGlobalData, get as getGlobalData} from '../../../global_data';
import * as images from '../../../static/images/index';
import { TabBar, MallButton } from '../../../components';
import Layout from '../../../components/layout/index';
import './index.less';

class Index extends Component {

   config = {
    'navigationBarTitleText': '个人中心',
    'enablePullDownRefresh': true,
    usingComponents: {}
  }

  state={
    pageConfig: [],
    userInfo: {
      nickName: '昵称',
      avatarUrl: images.avatar
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    hasLogin: false
  }

  componentWillMount() {
    getConfigPageMy().then(res => {
      this.setState({
        pageConfig: res,
      })
    })
  }

  componentDidShow () {
    //获取用户的登录信息
    if (getGlobalData('hasLogin')) {
      let userInfo = Taro.getStorageSync('userInfo');
      this.setState({
        userInfo: userInfo,
        hasLogin: true
      }, () => {
        getUserIndex().then(res => {
          this.setState({
            order: res.order
          });
        });
      });
    }
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
    const { userInfo, order, hasLogin, pageConfig } = this.state;
    return (
      <Block>
        <View className='bar-container container'>
          <Layout pageConfig={pageConfig} userInfo={userInfo} order={order} />
          <View className='footer'>
            {
              hasLogin &&  <MallButton className='logout' onClick={this.exitLogin}>退出登录</MallButton>
            }
          </View>
        </View>
      </Block>

    );
  }
}
export default Index;
