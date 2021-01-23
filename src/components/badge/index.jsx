import React, { PureComponent} from 'react';
import Taro from '@tarojs/taro';
import  { AtBadge } from 'taro-ui';
import { Block } from '@tarojs/components'

class Index extends PureComponent {

  render() {
    const {children, hidden, dot, value, maxValue} = this.props;
    if (hidden) {
      return <Block>{children}</Block>
    }
    return <Block>
        <AtBadge dot={dot} value={value} maxValue={maxValue}>
          {children}
        </AtBadge>
    </Block>
  }
}

Index.defaultProps = {
  hidden: true
}

export default Index;
