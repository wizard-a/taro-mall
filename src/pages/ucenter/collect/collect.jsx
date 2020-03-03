import Taro , { Component } from '@tarojs/taro';
import { View , Image} from '@tarojs/components';
import { collectAddOrDelete, getCollectListApi } from '../../../services/collect';

import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '我的收藏'
  }

  state={
    type: 0,
    collectList: [],
    page: 1,
    limit: 10,
    totalPages: 1
  }

  componentDidMount () {
    this.getCollectList();
  }

  getCollectList = () => {
    Taro.showLoading({
      title: '加载中...',
    });
    getCollectListApi({
      type: this.state.type,
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      this.setState({
        collectList: this.state.collectList.concat(res.list),
        totalPages: res.pages
      });
      Taro.hideLoading();
    })

  }

  onReachBottom() {
    if (this.state.totalPages > this.state.page) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.getCollectList();
      });

    } else {
      Taro.showToast({
        title: '没有更多用户收藏了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  openGoods = (event) => {
    let index = event.currentTarget.dataset.index;
    let goodsId = this.state.collectList[index].valueId;

    //触摸时间距离页面打开的毫秒数
    var touchTime = this.state.touchEnd - this.state.touchStart;
    console.log(touchTime);
    //如果按下时间大于350为长按
    if (touchTime > 350) {
      Taro.showModal({
        title: '',
        content: '确定删除吗？',
        success: (res) => {
          if (res.confirm) {
            collectAddOrDelete({
              type: this.state.type,
              valueId: goodsId
            }).then(res => {
              Taro.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              this.state.collectList.splice(index, 1)
              this.setState({
                collectList: this.state.collectList
              });
            })
          }
        }
      })
    } else {

      Taro.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }
  }

  touchStart = (e) => {
    this.setState({
      touchStart: e.timeStamp
    })
  }

  touchEnd = (e) => {
    this.setState({
      touchEnd: e.timeStamp
    })
  }

  render() {
    const {collectList} = this.state;
    return (
      <View className='container'>
        {
          collectList.length <= 0 ? <View className='no-collect'>
            <View className='c'>
              <text>还没有收藏</text>
            </View>
          </View> : <View className='collect-list'>
            {
              collectList && collectList.map((item, index) => {
                return <View className='item' onClick={this.openGoods} data-index={index} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} key={item.id}>
                  <Image className='img' src={item.picUrl}></Image>
                  <View className='info'>
                    <View className='name'>{item.name}</View>
                    <View className='subtitle'>{item.brief}</View>
                    <View className='price'>￥{item.retailPrice}</View>
                  </View>
                </View>
              })
            }

          </View>
        }

      </View>
    );
  }
}
export default Index;
