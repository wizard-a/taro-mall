import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'


@connect(({ demo }) => ({
  ...demo
}))
class Index extends Component {

  config = {
    navigationBarTitleText: 'demo'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  add = () => {
    const { dispatch } = this.props;
    dispatch({type: 'demo/add'})
  }
  dec = () => {
    const { dispatch } = this.props;
    dispatch({type: 'demo/dec'})
  }

  asyncAdd = () => {
    const { dispatch } = this.props;
    dispatch({type: 'demo/asyncAdd'})
  }


  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.add}>+</Button>
        <Button className='dec_btn' onClick={this.dec}>-</Button>
        <Button className='dec_btn' onClick={this.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
      </View>
    )
  }
}

export default Index
