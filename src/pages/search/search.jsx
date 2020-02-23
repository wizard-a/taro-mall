import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';

class Search extends Component {

   config = {
       navigationBarTitleText: ''
  }

  state={}

  componentWillMount () {}
  componentDidMount () {}
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}
  render() {
    return (
      <View>
        Serach
      </View>
    );
  }
}
export default Search;
