
import Taro , { PureComponent } from '@tarojs/taro';
import { connect } from '@tarojs/redux'
import { Button } from '@tarojs/components'

// import {AtButton} from 'taro-ui';
import './button.less';


@connect(({config}) =>({
  theme: config.theme
}))
class Index extends PureComponent {

  render() {
    const {children, onClick, theme} = this.props;
    return <Button style={{background: theme.primary}} className='my-button' onClick={onClick}>
      {children}
  </Button>
  }
}

Index.defaultProps = {
  onClick: () => {}
}

export default Index;
