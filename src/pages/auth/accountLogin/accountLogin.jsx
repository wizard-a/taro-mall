import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button, Input, Navigator, Image} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import {set as setGlobalData} from '../../../global_data';
import { loginByAccount } from '../../../services/auth';
// import { showErrorToast } from '../../../utils/util';
import './index.less';

class AccountLogin extends Component {

   config = {
       navigationBarTitleText: '账号登录'
  }

  state={
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0
  }

  componentWillMount () {}
  componentDidMount () {}

  bindUsernameInput = (e) => {
    this.setState({
      username: e.target.value
    });
  }

  bindPasswordInput = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  accountLogin = () => {
    const {username, password} = this.state;
    if (password.length < 1 || username.length < 1) {
      Taro.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    loginByAccount({
      username: username,
      password: password
    }).then(res => {
      this.setState({
        loginErrorCount: 0
      });
      setGlobalData('hasLogin', true);
      Taro.setStorageSync('userInfo', res.userInfo);
      Taro.setStorage({
        key: "token",
        data: res.token,
        success: function() {
          Taro.switchTab({
            url: '/pages/ucenter/index/index'
          });
        }
      });
    }).catch(() => {

      this.setState({
        loginErrorCount: this.state.loginErrorCount + 1
      })

      setGlobalData('hasLogin', false);
    })
  }

  clearInput = (key) => {
    switch (key) {
      case 'clear-username':
        this.setState({
          username: ''
        });
        break;
      case 'clear-password':
        this.setState({
          password: ''
        });
        break;
      case 'clear-code':
        this.setState({
          code: ''
        });
        break;
    }
  }

  render() {
    const { username, password } = this.state;
    return (
      <View className='container'>
        <View className='form-box'>

          <View className='form-item'>
            <Input className='username' value={username} onInput={this.bindUsernameInput} placeholder='账号' />
            { username && username.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-username')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='password' value={password} password onInput={this.bindPasswordInput} placeholder='密码' />
            { password && password.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-password')} /></View>}
          </View>

        {/* <View className='form-item-code' wx-if={loginErrorCount >= 3}>
          <View className='form-item code-item'>
            <Input className='code' value={code} bindInput='bindCodeInput' placeholder='验证码'/>
            <van-icon className='clear' id='clear-code' wx:if={ code.length > 0 } name='close' catchtap='clearInput'/>
          </View>
          <Image className='code-img' src='captcha.png'></Image>
        </View> */}

        <Button type='primary' className='login-btn' onClick={this.accountLogin}>账号登录</Button>

        <View className='form-item-text'>
          <Navigator url='/pages/auth/register/register' className='register'>注册账号</Navigator>
          <Navigator url='/pages/auth/reset/reset' className='reset'>忘记密码</Navigator>
        </View>
        </View>
      </View>
    );
  }
}
export default AccountLogin;
