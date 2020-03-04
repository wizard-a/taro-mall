import Taro , { Component } from '@tarojs/taro';
import { View, Text, ScrollView, Navigator, Image} from '@tarojs/components';
import {getGoodsCategory, getGoodsList1} from '../../services/goods';
import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: ''
  }

  state={
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    limit: 10
  }

  componentWillMount () {}
  componentDidMount () {
    // 页面初始化 options为页面跳转所带来的参数
    const { id } = this.$router.params;
    if (id) {
      this.setState({
        id: parseInt(id)
      }, () => {
        Taro.getSystemInfo({
          success: (res) => {
            this.setState({
              scrollHeight: res.windowHeight
            });
          }
        });

        this.getCategoryInfo();
      });
    }


  }
  componentWillReceiveProps (nextProps,nextConText) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}
  switchCate = (event) => {
    if (this.state.id == event.currentTarget.dataset.id) {
      return false;
    }
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      this.setState({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      this.setState({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setState({
      id: event.currentTarget.dataset.id
    }, () => {
      this.getCategoryInfo();
    });
  }

  getCategoryInfo = () => {
    getGoodsCategory({
      id: this.state.id
    }).then(res => {
      this.setState({
        navList: res.brotherCategory,
        currentCategory: res.currentCategory
      }, () => {
        Taro.setNavigationBarTitle({
          title: res.parentCategory.name
        })

        // 当id是L1分类id时，这里需要重新设置成L1分类的一个子分类的id
        if (res.parentCategory.id == this.state.id) {
          this.setState({
            id: res.currentCategory.id
          }, () => {
            //nav位置
            let currentIndex = 0;
            let navListCount = this.state.navList.length;
            for (let i = 0; i < navListCount; i++) {
              currentIndex += 1;
              if (this.state.navList[i].id == this.state.id) {
                break;
              }
            }
            if (currentIndex > navListCount / 2 && navListCount > 5) {
              this.setState({
                scrollLeft: currentIndex * 60
              });
            }
            this.getGoodsList();

            return;
          });
        }

        //nav位置
        let currentIndex = 0;
        let navListCount = this.state.navList.length;
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (this.state.navList[i].id == this.state.id) {
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          this.setState({
            scrollLeft: currentIndex * 60
          });
        }
        this.getGoodsList();
      });


    })

  }

  getGoodsList = () => {
    getGoodsList1({
      categoryId: this.state.id,
      page: this.state.page,
      limit: this.state.limit
    }).then(res => {
      this.setState({
        goodsList: res.list,
      });
    })
  }

  render() {
    const {navList, scrollTop, scrollHeight, scrollLeft, currentCategory, goodsList, id} = this.state;
    return (
      <View className='container'>
        <View className='cate-nav'>
          <ScrollView scroll-x='true' className='cate-nav-body' style='width: 750rpx;' scrollLeft={scrollLeft}>
            {
              navList.map((item, index) => {
                return <View className={`item ${ id == item.id ? 'active' : ''}`} key={item.id} data-id={item.id} data-index={index} onClick={this.switchCate}>
                  <View className='name'>{item.name}</View>
                </View>
              })
            }

          </ScrollView>
        </View>
        <ScrollView scrollY scrollTop={scrollTop} style={{height: scrollHeight}}>

          <View className='cate-item'>
            <View className='h'>
              <Text className='name'>{currentCategory.name}</Text>
              <Text className='desc'>{currentCategory.desc}</Text>
            </View>
            <View className='b'>
              {
                goodsList.map((iitem, iindex)  => {
                  return <Navigator className={`item ${(iindex + 1) % 2 == 0 ? 'item-b' : ''}`} url={`/pages/goods/goods?id=${iitem.id}`} key={iitem.id}>
                    <Image className='img' src={iitem.picUrl} background-size='cover'></Image>
                    <Text className='name'>{iitem.name}</Text>
                    <Text className='price'>￥{iitem.retailPrice}</Text>
                  </Navigator>
                })
              }
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Index;
