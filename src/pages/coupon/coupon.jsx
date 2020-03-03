import Taro , { Component } from '@tarojs/taro';
import { View, Text, ScrollView, Image} from '@tarojs/components';
import {get as getGlobalData} from '../../global_data';
import { couponReceive, getCouponListApi } from '../../services/coupon';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '优惠券专区'
  }

  state={
    couponList: [],
    page: 1,
    limit: 10,
    count: 0,
    scrollTop: 0,
    showPage: false
  }

  componentWillMount () {}
  componentDidMount () {
    this.getCouponList();
  }

  getCoupon = (e) => {
    if (!getGlobalData('hasLogin')) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId
    }).then(() => {
      Taro.showToast({
        title: "领取成功"
      })
    })
  }

  prevPage = () => {

    if (this.state.page <= 1) {
      return false;
    }

    this.setState({
      page: this.state.page - 1
    }, () => {
      this.getCouponList();
    });

  }

  nextPage = () => {
    if (this.state.page > this.state.count / this.state.limit) {
      return true;
    }

    this.setState({
      page: this.state.page + 1
    }, () => {
      this.getCouponList();
    });


  }

  getCouponList = () => {
    this.setState({
      scrollTop: 0,
      showPage: false,
      couponList: []
    }, () => {
      // 页面渲染完成
      Taro.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 2000
      });

      getCouponListApi({
        page: this.state.page,
        limit: this.state.limit
      }).then(res => {
        this.setState({
          scrollTop: 0,
          couponList: res.list,
          showPage: true,
          count: res.total
        });
        Taro.hideToast();
      }).catch(() => {
        Taro.hideToast();
      })
    });

  }

  render() {
    const {scrollTop, couponList, page, showPage, count, limit} = this.state;
    return (
      <View className='container'>
        <ScrollView className='coupon-list' scrollY scrollTop={scrollTop}>
          {
            couponList.map(item => {
              return <View className='item' key={item.id} onClick={this.getCoupon} data-index={item.id}>
                <View className='tag'>{item.tag}</View>
                <View className='content'>
                  <View className='left'>
                    <View className='discount'>{item.discount}元</View>
                    <View className='min'> 满{item.min}元使用</View>
                  </View>
                  <View className='right'>
                    <View className='name'>{item.name}</View>
                    {
                      item.days != 0 ? <View className='time'>有效期：{item.days}天</View> : <View className='time'> 有效期：{item.startTime} - {item.endTime}</View>
                    }
                  </View>
                </View>
                <View className='condition'>
                  <Text className='txt'>{item.desc}</Text>
                  <Image src={item.pic} className='icon'></Image>
                </View>
              </View>
            })
          }
          {
            showPage && <View className='page'>
              <View className={`prev ${ page <= 1 ? 'disabled' : ''}`} onClick={this.prevPage}>上一页</View>
              <View className={`next ${ (count / limit) < page ? 'disabled' : ''}`} onClick={this.nextPage}>下一页</View>
            </View>
          }

        </ScrollView>
      </View>
    );
  }
}
export default Index;
