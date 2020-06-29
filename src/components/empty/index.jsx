import Taro , { Component } from '@tarojs/taro';
import { View} from '@tarojs/components';

import './empty.less';

class Empty extends Component {

  render() {
    const {children} = this.props;
    return (
      <View className='empty'>
        {children}
      </View>
    );
  }
}
export default Empty;
