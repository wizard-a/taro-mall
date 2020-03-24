import Taro , { Component } from '@tarojs/taro';
import { View, Button, Input} from '@tarojs/components';
import { regCaptcha, resetPass } from '../../../services/auth';
import { AtIcon } from 'taro-ui';
import * as check from '../../../utils/check';
import './reset.less';

class Reset extends Component {

   config = {
       navigationBarTitleText: '密码重置'
  }

  state={
    mobile: '',
    code: '',
    password: '',
    confirmPassword: ''
  }

  bindMobileInput = (e) => {
    console.log('e', e.detail.value)
    this.setState({
      mobile: e.detail.value
    });
  }

  bindCodeInput = (e) => {
    this.setState({
      code: e.detail.value
    });
  }

  bindPasswordInput = (e) => {
    this.setState({
      password: e.detail.value
    });
  }

  bindConfirmPasswordInput = (e) => {
    this.setState({
      confirmPassword: e.detail.value
    });
  }

  sendCode = () => {
    regCaptcha({
      mobile: this.state.mobile
    }).then(res => {
      Taro.showModal({
        title: '发送成功',
        content: '验证码已发送',
        showCancel: false
      });

      // Taro.showModal({
      //   title: '错误信息',
      //   content: res.data.errmsg,
      //   showCancel: false
      // });
    })
  }

  startReset = () => {

    if (this.state.mobile.length == 0 || this.state.code.length == 0) {
      Taro.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        showCancel: false
      });
      return false;
    }

    if (!check.isValidPhone(this.state.mobile)) {
      Taro.showModal({
        title: '错误信息',
        content: '手机号输入不正确',
        showCancel: false
      });
      return false;
    }

    if (this.state.password.length < 3) {
      Taro.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于3位',
        showCancel: false
      });
      return false;
    }

    if (this.state.password != this.state.confirmPassword) {
      Taro.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    resetPass({
      mobile: this.state.mobile,
      code: this.state.code,
      password: this.state.password
    }).then(res => {
      Taro.navigateBack();
      // wx.showModal({
      //   title: '密码重置失败',
      //   content: res.data.errmsg,
      //   showCancel: false
      // });
    })
  }

  clearInput = (key) => {
    switch (key) {
      case 'clear-password':
        this.setState({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setState({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setState({
          mobile: ''
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
    const {mobile, code, password, confirmPassword} = this.state;
    return (
      <View className='container'>
        <View className='form-box'>

          <View className='form-item'>
            <Input className='mobile' value={mobile} onInput={this.bindMobileInput} placeholder='手机号' />
            { mobile && mobile.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-mobile')} /></View>}
          </View>

          <View className='form-item-code'>
            <View className='form-item code-item'>
              <Input className='code' value={code} onInput={this.bindCodeInput} placeholder='验证码' />
              { code && code.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-code')} /></View>}
            </View>
            <View className='code-btn' onClick={this.sendCode}>获取验证码</View>
          </View>

          <View className='form-item'>
            <Input className='password' value={password} password onInput={this.bindPasswordInput} placeholder='密码' />
            { password && password.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-password')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='password' value={confirmPassword} password onInput={this.bindConfirmPasswordInput} placeholder='确认密码' />
            { confirmPassword && confirmPassword.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-confirm-password')} /></View>}
          </View>

          <Button type='default' className='reset-btn' onClick={this.startReset}>密码重置</Button>

        </View>
      </View>
    );
  }
}
export default Reset;
