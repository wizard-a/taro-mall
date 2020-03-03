import Taro , { Component } from '@tarojs/taro';
import { View, Text , Button, Image} from '@tarojs/components';
import { getFootprintListApi, footprintDelete } from '../../../services/footprint';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '我的足迹'
  }

  state={
    footprintList: [],
    page: 1,
    limit: 10,
    totalPages: 1
  }

  componentWillMount () {}
  componentDidMount () {
    this.getFootprintList();
  }
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  onReachBottom() {
    if (this.state.totalPages > this.state.page) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.getFootprintList();
      });
    } else {
      Taro.showToast({
        title: '没有更多用户足迹了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  getFootprintList = () => {
    Taro.showLoading({
      title: '加载中...',
    });
    getFootprintListApi({
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      let f1 = this.state.footprintList;
      let f2 = res.list;
      for (let i = 0; i < f2.length; i++) {
        f2[i].addDate = f2[i].addTime.substring(0, 10)
        let last = f1.length - 1;
        if (last >= 0 && f1[last][0].addDate === f2[i].addDate) {
          f1[last].push(f2[i]);
        } else {
          let tmp = [];
          tmp.push(f2[i])
          f1.push(tmp);
        }
      }

      this.setState({
        footprintList: f1,
        totalPages: res.pages
      });

      Taro.hideLoading();
    }).catch(() => {
      Taro.hideLoading();
    })
  }

  deleteItem = (event) => {
    let index = event.currentTarget.dataset.index;
    let iindex = event.currentTarget.dataset.iindex;
    let footprintId = this.state.footprintList[index][iindex].id;
    let goodsId = this.state.footprintList[index][iindex].goodsId;
    var touchTime = this.state.touchEnd - this.state.touchStart;
    console.log(touchTime);
    //如果按下时间大于350为长按
    if (touchTime > 350) {
      Taro.showModal({
        title: '',
        content: '要删除所选足迹？',
        success: function(res) {
          if (res.confirm) {
            footprintDelete({
              id: footprintId
            }).then(res => {
              Taro.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              this.state.footprintList[index].splice(iindex, 1)
              if (this.state.footprintList[index].length == 0) {
                this.state.footprintList.splice(index, 1)
              }
              this.setState({
                footprintList: this.state.footprintList
              });
            })
          }
        }
      });
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
    const {footprintList} = this.state;
    return (
      <View className='container'>
        {
          footprintList.length <= 0 && <View className='no-footprint'>
              <View className='c'>
                <text>没有浏览足迹</text>
              </View>
            </View>
        }
        {
          footprintList.length > 0 && <View className='footprint'>
          {
            footprintList.map((item, index) => {
              return <View className='day-item' key={index}>
                {
                  item.length > 0 && <View className='day-hd'>{item[0].addDate}</View>
                }
                {
                  item.length > 0 && <View className='day-list'>
                    {
                      item.map((iitem, iindex) => {
                        return <View className='item' data-index={index} data-iindex={iindex} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} onClick={this.deleteItem} key={iitem.id}>
                          <Image className='img' src={iitem.picUrl}></Image>
                          <View className='info'>
                            <View className='name'>{iitem.name}</View>
                            <View className='subtitle'>{iitem.brief}</View>
                            <View className='price'>￥{iitem.retailPrice}</View>
                          </View>
                        </View>
                      })
                    }
                  </View>
                }
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
