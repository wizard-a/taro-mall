import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import {getAddressListApi, deleteAddress} from '../../../services/address';

import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '地址管理'
  }

  state={
    addressList: [],
    total: 0
  }

  componentWillMount () {}
  componentDidMount () {}
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {
    // 页面显示
    this.getAddressList();
  }
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}
  getAddressList = () => {
    getAddressListApi().then(res => {
      this.setState({
        addressList: res.list,
        total: res.total
      });
    })
  }


  addressAddOrUpdate(event) {
    console.log(event)

    //返回之前，先取出上一页对象，并设置addressId
    var pages = Taro.getCurrentPages();
    var prevPage = pages[pages.length - 2];

    if (prevPage.route == 'pages/checkout/checkout') {
      try {
        Taro.setStorageSync('addressId', event.currentTarget.dataset.addressId);
      } catch (e) {

      }

      let addressId = event.currentTarget.dataset.addressId;
      if (addressId && addressId != 0) {
        Taro.navigateBack();
      } else {
        Taro.navigateTo({
          url: '/pages/ucenter/addressAdd/addressAdd?id=' + addressId
        })
      }

    } else {
      Taro.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      })
    }
  }

  deleteAddress(event) {
    Taro.showModal({
      title: '',
      content: '确定要删除地址？',
      success: (res) => {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          deleteAddress({
            id: addressId
          }).then(() => {
            this.getAddressList();
            Taro.removeStorage({
              key: 'addressId',
              success: function() {},
            })
          })
          console.log('用户点击确定')
        }
      }
    })
    return false;

  }
  render() {
    const {addressList} = this.state;
    console.log('--addressList---', addressList);
    return (
      <View className='container'>
        {
          addressList.length > 0 && <View className='address-list'>
            {
              addressList.map(item => {
                return <View className='item' key={item.id} onClick={this.addressAddOrUpdate} data-address-id={item.id}>
                  <View className='l'>
                    <View className='name'>{item.name}</View>
                    {
                      item.isDefault && <View className='default'>默认</View>
                    }
                  </View>
                  <View className='c'>
                    <View className='mobile'>{item.tel}</View>
                    <View className='address'>{item.addressDetail}</View>
                  </View>
                  <View className='r'>
                    <View data-address-id={item.id} onClick={this.deleteAddress} className='del'><AtIcon value='delete' /></View>
                  </View>
                </View>
              })
            }
          </View>
        }

        {
          addressList.length <= 0 && <View className='empty-view'>
            <Text className='text'>收货地址还没有~~~</Text>
          </View>
        }

        <View className='add-address' onClick={this.addressAddOrUpdate} data-address-id='0'>新建</View>
      </View>
    );
  }
}
export default Index;
