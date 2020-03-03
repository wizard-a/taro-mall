import Taro , { Component } from '@tarojs/taro';
import { View, Text , Image, Navigator} from '@tarojs/components';
import { getAftersaleListApi } from '../../../services/aftersale';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '我的售后'
  }

  state={
    aftersaleList: [],
    showType: 1,
    page: 1,
    limit: 10,
    totalPages: 1
  }

  componentDidShow () {
    // 页面显示
    this.getAftersaleList();
  }

  getAftersaleList = () => {
    getAftersaleListApi({
      status: this.state.showType,
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      this.setState({
        aftersaleList: this.state.aftersaleList.concat(res.list),
        totalPages: res.pages
      });
    })
  }

  onReachBottom() {
    if (this.state.totalPages > this.state.page) {
      this.setState({
        page: this.data.page + 1
      }, () => {
        this.getAftersaleList();
      });

    } else {
      Taro.showToast({
        title: '没有更多售后了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  switchTab = (event) => {
    let showType = event.currentTarget.dataset.index;
    this.setState({
      aftersaleList: [],
      showType: showType,
      page: 1,
      limit: 10,
      totalPages: 1
    }, () => {
      this.getAftersaleList();
    });

  }

  render() {
    const {aftersaleList, showType} = this.state;
    return (
      <View className='container'>
        <View className='aftersales-switch'>
          <View className={`item ${ showType == 1 ? 'active' : ''}`} onClick={this.switchTab} data-index='1'>
            <View className='txt'>申请中</View>
          </View>
          <View className={`item ${ showType == 2 ? 'active' : ''}`} onClick={this.switchTab} data-index='2'>
            <View className='txt'>处理中</View>
          </View>
          <View className={`item ${ showType == 3 ? 'active' : ''}`} onClick={this.switchTab} data-index='3'>
            <View className='txt'>已完成</View>
          </View>
          <View className={`item ${ showType == 4 ? 'active' : ''}`} onClick={this.switchTab} data-index='4'>
            <View className='txt'>已拒绝</View>
          </View>
        </View>
        {
          aftersaleList.length <= 0 && <View className='no-aftersale'>
            <View className='c'>
              <Text>还没有呢</Text>
            </View>
          </View>
        }

        <View className='aftersales'>
          {
            aftersaleList && aftersaleList.map(item => {
              return <Navigator url={`../aftersaleDetail/aftersaleDetail?id=${item.aftersale.orderId}`} className='aftersale' openType='redirect' key={item.id}>
                <View className='h'>
                  <View className='l'>售后编号：{item.aftersale.aftersaleSn}</View>
                </View>
                {
                  item.goodsList.map(gitem => {
                    return <View className='goods' key={gitem.id}>
                      <View className='img'>
                        <Image src={gitem.picUrl}></Image>
                      </View>
                      <View className='info'>
                        <Text className='name'>{gitem.goodsName}</Text>
                        <Text className='number'>{gitem.number}件商品</Text>
                      </View>
                      <View className='status'></View>
                    </View>
                  })
                }
                <View className='b'>
                  <View className='l'>申请退款金额：￥{item.aftersale.amount}元</View>
                </View>
              </Navigator>
            })
          }
        </View>
      </View>
    );
  }
}
export default Index;
