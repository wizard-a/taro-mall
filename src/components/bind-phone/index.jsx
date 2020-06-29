
import Taro , { PureComponent } from '@tarojs/taro';
import { Button } from '@tarojs/components'
import * as app from '../../utils/app';
import {bindPhone} from '../../services/auth';
import './bindPhone.less';

class Index extends PureComponent {

  bindPhoneNumber = (e) => {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }
    if (app.isLogin()) {
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

  render() {
    const {children} = this.props;
    return <Button className='user_column_item_phone' openType='getPhoneNumber' onGetPhoneNumber={this.bindPhoneNumber}>
        {children}
    </Button>
  }
}

Index.defaultProps = {
}

export default Index;
