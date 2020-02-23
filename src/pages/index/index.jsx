import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

@connect(({ home }) => ({
  ...home
}))
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  add = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/add'})
  }
  dec = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/dec'})
  }

  asyncAdd = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/asyncAdd'})
  }

  link = () => {
    Taro.navigateTo({
      url: '/packages/pages/demo/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.add}>+</Button>
        <Button className='dec_btn' onClick={this.dec}>-</Button>
        <Button className='dec_btn' onClick={this.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>

        <Button className='dec_btn' onClick={this.link}>跳转</Button>
      </View>
    )
  }
}

export default Index
