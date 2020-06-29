
import Taro , { PureComponent } from '@tarojs/taro';
import { Button } from '@tarojs/components'
import './contact.less';

class Index extends PureComponent {

  render() {
    const {children} = this.props;

    return <Button className='user_column_item_phone' openType='contact'>
      {children}
  </Button>
  }
}

Index.defaultProps = {
}

export default Index;
