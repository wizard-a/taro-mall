

import Taro , { Component } from '@tarojs/taro';
import { Block} from '@tarojs/components';
import My from './my';

 class Layout extends Component {

  state={}

  componentWillMount () {}
  componentDidMount () {}
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  getElement() {
    const {pageConfig, isShowConfig, userInfo, order} = this.props;
    let newPageConfig = pageConfig;
    if (!isShowConfig && pageConfig) {
      newPageConfig = pageConfig.filter(f => f.type !== 'config')
    }
    // console.log('newPageConfig', newPageConfig);
    return newPageConfig.map((item, index) => {
      // console.log('==item', item);
      if (item.type === 'my') {
        return <My key={item.type + index} config={item} userInfo={userInfo} order={order} />
      }
      return <Block key={item.type + index}></Block>;
    })
  }


  render() {
    // console.log('layout-config', pageConfig, this)
    return (
      <Block>
        {this.getElement()}
      </Block>
    );
  }
}

Layout.defaultProps = {
  pageConfig: [],
  isShowConfig: false,
}

export default Layout;
