import Taro , { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Button, Navigator, Text, Block, Input, Image, RichText} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import {getGoodsDetail, getGoodsRelated, goodsCollectAddOrDelete} from '../../services/goods';
import { groupOnJoin } from '../../services/group';
import { addCart, cartFastAdd, getCartGoodsCount} from '../../services/cart';

import { showErrorToast } from '../../utils/util';
import {ImgWeChat, ImgFriend} from '../../static/images';

import './index.less';

class Goods extends Component {

   config = {
      navigationBarTitleText: '商品详情'
  }

  state={
    canShare: false,
    id: 0,
    goods: {},
    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
    attribute: [],
    issueList: [],
    comment: {},
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '规格数量选择',
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    openAttr: false,
    openShare: false,
    collect: false,
    shareImage: '',
    isGroupon: false, //标识是否是一个参团购买
    soldout: false,
    canWrite: false, //用户是否获取了保存相册的权限
  }

  componentWillMount () {

  }
  componentDidMount () {
    const { id, grouponId } = this.$router.params;
    // const id = 1181000;
    // console.log('id', id);
    if (id) {
      this.setState({
        id: parseInt(id),
      }, () => {
        this.getGoodsInfo();
      })
    }

    // 记得打开
    if (grouponId) {
      this.setState({
        isGroupon: true,
      }, () => {
        this.getGrouponInfo(grouponId);
      });
    }

    let that = this;
    Taro.getSetting({
        success: function (res) {
            console.log(res)
            //不存在相册授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
                Taro.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: function () {
                        that.setState({
                            canWrite: true
                        })
                    },
                    fail: function (err) {
                        that.setState({
                            canWrite: false
                        })
                    }
                })
            } else {
                that.setState({
                    canWrite: true
                });
            }
        }
    })
  }

  componentDidShow () {
    // 页面显示
    getCartGoodsCount().then(res => {
      this.setState({
        cartGoodsCount: res || 0
      });
    })
  }

  getGrouponInfo = (grouponId) => {
    let that = this;
    groupOnJoin({
      grouponId: grouponId
    }).then(res => {
      that.setState({
        grouponLink: res.groupon,
        id: res.goods.id
      });
      //获取商品详情
      that.getGoodsInfo();
    })
  }

  getGoodsInfo = () => {
    const { id } = this.state;
    getGoodsDetail(id).then(res => {
      console.log('----res--------', res);

      let _specificationList = res.specificationList
      // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
      if (_specificationList.length == 1) {
        if (_specificationList[0].valueList.length == 1) {
          _specificationList[0].valueList[0].checked = true

          // 如果仅仅存在一种货品，那么商品价格应该和货品价格一致
          // 这里检测一下
          let _productPrice = res.productList[0].price;
          let _goodsPrice = res.info.retailPrice;
          if (_productPrice != _goodsPrice) {
            console.error('商品数量价格和货品不一致');
          }

          this.setState({
            checkedSpecText: _specificationList[0].valueList[0].value,
            tmpSpecText: '已选择：' + _specificationList[0].valueList[0].value,
          });
        }
      }

      res.info.detail2 = res.info.detail.replace(/style=\"\"/gi, `style="width: 100%;height: ${Taro.pxTransform(375)}"`)

      this.setState({
        goods: res.info,
        attribute: res.attribute,
        issueList: res.issue,
        comment: res.comment,
        brand: res.brand,
        specificationList: res.specificationList,
        productList: res.productList,
        userHasCollect: res.userHasCollect,
        shareImage: res.shareImage,
        checkedSpecPrice: res.info.retailPrice,
        groupon: res.groupon,
        canShare: res.share,
      });

      //如果是通过分享的团购参加团购，则团购项目应该与分享的一致并且不可更改
      if (this.state.isGroupon) {
        let groupons = this.state.groupon;
        for (var i = 0; i < groupons.length; i++) {
          if (groupons[i].id != this.state.grouponLink.rulesId) {
            groupons.splice(i, 1);
          }
        }
        groupons[0].checked = true;
        //重设团购规格
        this.setState({
          groupon: groupons
        });

      }

      this.setState({
        collect: res.userHasCollect == 1
      });

      // WxParse.wxParse('goodsDetail', 'html', res.info.detail, that);
      //获取推荐商品
      setTimeout(() => {
        this.getGoodsRelated();
      }, 5)

    });
  }

  getGoodsRelated = () => {
    const {id} = this.state;

    getGoodsRelated(id).then(res => {
      this.setState({
        relatedGoods: res.list,
      });
    })

  }

  componentDidShow () {}

  shareFriendOrCircle = () => {
    if (this.state.openShare === false) {
      this.setState({
        openShare: !this.state.openShare
      });
    } else {
      return false;
    }
  }

  closeShare = () => {
    this.setState({
      openShare: false,
    });
  }

  handleSetting = (e) => {
    console.log('---', e);
    console.log(e)
    // TODO 需测试
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
        Taro.showModal({
            title: '警告',
            content: '不授权无法保存',
            showCancel: false
        })
        this.setState({
          canWrite: false
        })
    } else {
        Taro.showToast({
            title: '保存成功'
        })
        this.setState({
          canWrite: true
        })
    }
  }

  saveShare = () => {
    Taro.downloadFile({
      url: this.state.shareImage,
      success: function(res) {
        console.log(res)
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            Taro.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，可以分享到朋友圈了',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#a78845',
              success: function(res1) {
                if (res1.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function() {
            console.log('fail')
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  }

  switchAttrPop = () => {
    if (this.state.openAttr == false) {
      this.setState({
        openAttr: !this.state.openAttr
      });
    }
  }

  closeAttr = () => {
    this.setState({
      openAttr: false,
    });
  }

  //获取选中的规格信息
  getCheckedSpecValue = () => {
    let checkedValues = [];
    let _specificationList = this.state.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  }

  isCheckedAllSpec = () => {
    return !this.getCheckedSpecValue().some(function(v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  }

  getCheckedProductItem = (key) => {
    return this.state.productList.filter(function(v) {
      if (v.specifications.toString() == key.toString()) {
        return true;
      } else {
        return false;
      }
    });
  }

  getCheckedSpecKey = () => {
    let checkedValue = this.getCheckedSpecValue().map(function(v) {
      return v.valueText;
    });
    return checkedValue;
  }

  changeSpecInfo = () => {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function(v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function(v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setState({
        tmpSpecText: checkedValue.join('　')
      });
    } else {
      this.setState({
        tmpSpecText: '请选择规格数量'
      });
    }

    if (this.isCheckedAllSpec()) {
      this.setState({
        checkedSpecText: this.state.tmpSpecText
      });

      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setState({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      if (checkedProduct.number > 0) {
        this.setState({
          checkedSpecPrice: checkedProduct.price,
          soldout: false
        });
      } else {
        this.setState({
          checkedSpecPrice: this.state.goods.retailPrice,
          soldout: true
        });
      }

    } else {
      this.setState({
        checkedSpecText: '规格数量选择',
        checkedSpecPrice: this.state.goods.retailPrice,
        soldout: false
      });
    }
  }

  clickSkuValue = (data) => {
    let specName = data.specification;
    let specValueId = data.id;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.state.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].name === specName) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setState({
      specificationList: _specificationList,
    }, () =>{
      //重新计算spec改变后的信息
      this.changeSpecInfo();
    });


    //重新计算哪些值不可以点击
  }

  // 团购选择
  clickGroupon = (data) => {

    //参与团购，不可更改选择
    if (this.state.isGroupon) {
      return;
    }

    // let specName = data.specification;
    let specValueId = data.id;

    let _grouponList = this.state.groupon;
    for (let i = 0; i < _grouponList.length; i++) {
      if (_grouponList[i].id == specValueId) {
        if (_grouponList[i].checked) {
          _grouponList[i].checked = false;
        } else {
          _grouponList[i].checked = true;
        }
      } else {
        _grouponList[i].checked = false;
      }
    }

    this.setState({
      groupon: _grouponList,
    });
  }

  cutNumber = () => {
    this.setState({
      number: (this.state.number - 1 > 1) ? this.state.number - 1 : 1
    });
  }

  addNumber = () => {
    this.setState({
      number: this.state.number + 1
    });
  }

  //添加或是取消收藏
  addCollectOrNot = () => {

    goodsCollectAddOrDelete({
      type: 0,
      valueId: this.state.id
    }).then((res) => {
      if (this.state.userHasCollect == 1) {
        this.setState({
          collect: false,
          userHasCollect: 0
        });
      } else {
        this.setState({
          collect: true,
          userHasCollect: 1
        });
      }
    })
  }

  openCartPage = () => {
    Taro.switchTab({
      url: '/pages/cart/cart'
    });
  }

  addToCart = () => {
    if (this.state.openAttr == false) {
      //打开规格选择窗口
      this.setState({
        openAttr: !this.state.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        showErrorToast('请选择完整规格');
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        showErrorToast('没有库存');
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {
        showErrorToast('没有库存');
        return false;
      }

      // 添加购物车
      addCart({
        goodsId: this.state.goods.id,
        number: this.state.number,
        productId: checkedProduct.id
      }).then(res => {
        Taro.showToast({
          title: '添加成功'
        });
        this.setState({
          openAttr: !this.state.openAttr,
          cartGoodsCount: res
        });
        if (this.state.userHasCollect == 1) {
          this.setState({
            collect: true
          });
        } else {
          this.setState({
            collect: false
          });
        }
      })

    }
  }

    //获取选中的团购信息
  getCheckedGrouponValue = () => {
    let checkedValues = {};
    let _grouponList = this.state.groupon;
    for (let i = 0; i < _grouponList.length; i++) {
      if (_grouponList[i].checked) {
        checkedValues = _grouponList[i];
      }
    }

    return checkedValues;
  }

  addFast = () => {
    if (this.state.openAttr == false) {
      //打开规格选择窗口
      this.setState({
        openAttr: !this.state.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        showErrorToast('请选择完整规格');
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        showErrorToast('没有库存');
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {
        showErrorToast('没有库存');
        return false;
      }

      //验证团购是否有效
      let checkedGroupon = this.getCheckedGrouponValue();

      //立即购买
      cartFastAdd({
        goodsId: this.state.goods.id,
        number: this.state.number,
        productId: checkedProduct.id
      }).then(res => {
        Taro.setStorageSync('cartId', res);
        Taro.setStorageSync('grouponRulesId', checkedGroupon.id);
        Taro.setStorageSync('grouponLinkId', this.state.grouponLink.id);
        Taro.navigateTo({
          url: '/pages/checkout/checkout'
        })
      })
    }
  }

  render() {
    const {canShare, collect, cartGoodsCount, soldout, groupon, number, specificationList, tmpSpecText, openAttr, canWrite, goods, isGroupon, brand, comment, attribute, issueList, relatedGoods, openShare, checkedSpecText, checkedSpecPrice} = this.state;
    return (
      <Block>
      <View className='container'>
        <Swiper className='goodsimgs' indicator-dots='true' autoplay='true' interval='3000' duration='1000'>
          { Array.isArray(goods.gallery) && goods.gallery.map(item => {
            return <SwiperItem key={item}>
              <Image className='img' src={item} background-size='cover'></Image>
            </SwiperItem>
          })}

        </Swiper>
        {/* <!-- 分享 --> */}
        <View class='goods_name'>
          <View class='goods_name_left'>{goods.name}</View>
          {
            !canShare && <View className='goods_name_right' onClick={this.shareFriendOrCircle}>分享</View>
          }
        </View>
        <View className='share-pop-box' style={{display: !openShare ? 'none' : 'block'}}>
          <View className='share-pop'>
            <View className='close' onClick={this.closeShare}>
              <AtIcon className='icon' size='14' color='#666' value='close' />
            </View>
            <View className='share-info'>
              {
                !isGroupon && <Button className='sharebtn' openType='share'>
                  <Image class='sharebtn_image' src={ImgWeChat}></Image>
                  <View class='sharebtn_text'>分享给好友</View>
                </Button>
              }

              {
                !isGroupon && !canWrite && <Button  className='savesharebtn' openType='openSetting' onOpenSetting={this.handleSetting} >
                  <Image class='sharebtn_image' src={ImgFriend}></Image>
                  <View class='sharebtn_text'>发朋友圈</View>
                </Button>
              }
              {
                !isGroupon && canWrite && <Button className='savesharebtn' onClick={this.saveShare}>
                  <Image class='sharebtn_image' src={ImgFriend}></Image>
                  <View class='sharebtn_text'>发朋友圈</View>
                </Button>
              }
            </View>
          </View>
        </View>

        <View className='goods-info'>
          <View className='c'>
            <Text className='desc'>{goods.brief}</Text>
            <View className='price'>
              <View className='counterPrice'>原价：￥{goods.counterPrice}</View>
              <View className='retailPrice'>现价：￥{checkedSpecPrice}</View>
            </View>
            {
              brand.name && <View className='brand'>
                {/* TODO url 替换 */}
                <Navigator url='../brandDetail/brandDetail?id={brand.id}'>
                  <Text>{brand.name}</Text>
                </Navigator>
              </View>
            }

          </View>
        </View>
        <View className='section-nav section-attr' onClick={this.switchAttrPop}>
          <View className='t'>{checkedSpecText}</View>
          <AtIcon className='i' value='chevron-right' size='18' color='#666' />
        </View>
        {
          comment && comment.count > 0 && <View className='comments'>
            <View className='h'>
              <Navigator url={`/pages/comment/comment?valueId=${goods.id}&type=0`}>
                <Text className='t'>评价({comment.count > 999 ? '999+' : comment.count})</Text>
                <View className='i'>
                  查看全部
                  <van-icon name='arrow' />
                </View>
              </Navigator>
            </View>
            <View className='b'>
              {
                Array.isArray(comment.data) && comment.data.map(item => {
                  return <View className='item' key={item.id}>
                    <View className='info'>
                      <View className='user'>
                        <Image src={item.avatar}></Image>
                        <Text>{item.nickname}</Text>
                      </View>
                      <View className='time'>{item.addTime}</View>
                    </View>
                    <View className='content'>
                      {item.content}
                    </View>
                    {
                      item.picList.length > 0 && <View className='imgs'>
                        {
                          item.picList.map(pic => {
                            return <Image className='img' key={item.pic} src={pic}></Image>
                          })
                        }
                      </View>
                    }
                    {
                      item.adminContent && <View className='customer-service'>
                        <Text className='u'>商家回复：</Text>
                        <Text className='c'>{item.adminContent}</Text>
                      </View>
                    }
                  </View>
                })
              }
            </View>
          </View>
        }

        <View className='goods-attr'>
          <View className='t'>商品参数</View>
          <View className='l'>
            {
              Array.isArray(attribute) && attribute.map(item => {
                return <View className='item' key={item.name}>
                  <Text className='left'>{item.attribute}</Text>
                  <Text className='right'>{item.value}</Text>
                </View>
              })
            }

          </View>
        </View>

        <View className='detail'>
          { goods.detail && <RichText style={{fontSize: 0}} nodes={goods.detail2} />}
        </View>

        <View className='common-problem'>
          <View className='h'>
            <View className='line'></View>
            <Text className='title'>常见问题</Text>
          </View>
          <View className='b'>
            {
              Array.isArray(issueList) && issueList.map(item => {
                return <View className='item' key={item.id}>
                  <View className='question-box'>
                    <Text className='spot'></Text>
                    <Text className='question'>{item.question}</Text>
                  </View>
                  <View className='answer'>
                    {item.answer}
                  </View>
                </View>
              })
            }
          </View>
        </View>

        {/* <!-- 大家都在看 --> */}
        {
          Array.isArray(relatedGoods) && relatedGoods.length > 0 && <View className='related-goods'>
            <View className='h'>
              <View className='line'></View>
              <Text className='title'>大家都在看</Text>
            </View>
            <View className='b'>
              {
                relatedGoods.map(item => {
                  return <View className='item' key={item.id}>
                  <Navigator url='/pages/goods/goods?id={item.id}'>
                    <Image className='img' src={item.picUrl} background-size='cover'></Image>
                    <Text className='name'>{item.name}</Text>
                    <Text className='price'>￥{item.retailPrice}</Text>
                  </Navigator>
                </View>
                })
              }
            </View>
          </View>
        }
      </View>

      {/* <!-- 规格选择界面 --> */}

      <View className='attr-pop-box' style={{display: !openAttr ? 'none' : 'block'}}>
        <View className='attr-pop'>
          <View className='close' onClick={this.closeAttr}>
            <AtIcon className='icon' size='14' color='#666' value='close' />
          </View>
          <View className='img-info'>
            <Image className='img' src={goods.picUrl}></Image>
            <View className='info'>
              <View className='c'>
                <View className='p'>价格：￥{checkedSpecPrice}</View>
                <View className='a'>{tmpSpecText}</View>
              </View>
            </View>
          </View>

          {/* <!-- 规格列表 --> */}
          <View className='spec-con'>
            {
              Array.isArray(specificationList) && specificationList.map(item => {
                return <View className='spec-item' key={item.name}>
                <View className='name'>{item.name}</View>
                <View className='values'>
                  {
                    item.valueList.map(vitem => {
                      return  <View className={`value ${vitem.checked ? 'selected' : ''}`} onClick={() => this.clickSkuValue(vitem)} key={vitem.id}>{vitem.value}</View>
                    })
                  }
                </View>
              </View>
              })
            }
            {
              groupon.length > 0 && <View className='spec-item'>
                <View className='name'>团购立减</View>
                <View className='values'>
                  {
                    groupon.map(vitem1 => {
                      return  <View className={`value ${vitem1.checked ? 'selected' : ''}`} onClick={ () => this.clickGroupon(vitem1) } key={vitem1.id}>￥{vitem1.discount} ({vitem1.discountMember}人)</View>
                    })
                  }

                </View>
              </View>
            }


            {/* <!-- 数量 --> */}
            <View className='number-item'>
              <View className='name'>数量</View>
              <View className='selnum'>
                <View className='cut' onClick={this.cutNumber}>-</View>
                <Input value={number} className='number' disabled type='number' />
                <View className='add' onClick={this.addNumber}>+</View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* <!-- 联系客服 TODO 禁用了 --> */}
      <View className='contact'>
        <contact-button style='opacity:0;position:absolute;' type='default-dark' session-from='weapp' size='27'>
        </contact-button>
      </View>

      {/* <!-- 底部按钮 --> */}
      <View className='bottom-btn'>
        {
          !isGroupon && <View className='l l-collect' onClick={this.addCollectOrNot}>
            {
              collect ? <AtIcon className='icon' value='star-2' color='#ab956d' size={20} /> : <AtIcon className='icon' value='star' size={20} />
            }
          </View>
        }
        {
          !isGroupon && <View className='l l-cart'>
            <View className='box'>
              <Text className='cart-count'>{cartGoodsCount}</Text>
              <AtIcon onClick={this.openCartPage} className='icon' value='shopping-cart' size={22} />
            </View>
          </View>
        }
        { !soldout && !isGroupon && <View className='r' onClick={this.addToCart}>加入购物车</View>}
        { !soldout && <View className='c' onClick={this.addFast}>{isGroupon?'参加团购':'立即购买'}</View>}
        { soldout && <View className='n'>商品已售空</View>}
      </View>
      </Block>
    );
  }
}
export default Goods;
