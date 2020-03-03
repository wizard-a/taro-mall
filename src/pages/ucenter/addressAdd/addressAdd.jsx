import Taro , { Component } from '@tarojs/taro';
import { View , Button, Block, Input, ScrollView} from '@tarojs/components';
import { AtCheckbox } from 'taro-ui';
import * as area from '../../../utils/area';
import { showErrorToast } from '../../../utils/util';
import * as check from '../../../utils/check';
import { saveAddress } from '../../../services/address';

import './index.less';

class Index extends Component {

   config = {
       navigationBarTitleText: '编辑地址'
  }

  state={
    address: {
      id: 0,
      areaCode: 0,
      address: '',
      name: '',
      tel: '',
      isDefault: 0,
      province: '',
      city: '',
      county: ''
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [{
        code: 0,
        name: '省份'
      },
      {
        code: 0,
        name: '城市'
      },
      {
        code: 0,
        name: '区县'
      }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false,
    checkedList: []
  }

  constructor(props) {
    super(props);
    this.checkboxOption = [{value: 'default', label: '设为默认地址'}]
  }

  componentWillMount () {}
  componentDidMount () {
     // 页面初始化 options为页面跳转所带来的参数
     const { id } = this.$router.params;
     if (id && id != 0) {
       this.setState({
         addressId: id
       }, () => {
        this.getAddressDetail();
       });

     }
  }
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  bindinputName = (event) => {
    let address = this.state.address;
    address.name = event.detail.value;
    this.setState({
      address: address
    });
  }

  bindinputMobile =(event) => {
    let address = this.state.address;
    address.tel = event.detail.value;
    this.setState({
      address: address
    });
  }

  chooseRegion = () => {
    this.setState({
      openSelectRegion: !this.state.openSelectRegion
    });

    //设置区域选择数据
    let address = this.state.address;
    if (address.areaCode > 0) {
      let selectRegionList = this.state.selectRegionList;
      selectRegionList[0].code = address.areaCode.slice(0, 2) + '0000';
      selectRegionList[0].name = address.province;

      selectRegionList[1].code = address.areaCode.slice(0, 4) + '00';
      selectRegionList[1].name = address.city;

      selectRegionList[2].code = address.areaCode;
      selectRegionList[2].name = address.county;

      let regionList = area.getList('county', address.areaCode.slice(0, 4));
      regionList = regionList.map(item => {
        //标记已选择的
        if (address.areaCode === item.code) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })

      this.setState({
        selectRegionList: selectRegionList,
        regionType: 3,
        regionList: regionList
      });

    } else {
      let selectRegionList = [{
            code: 0,
            name: '省份',
          },
          {
            code: 0,
            name: '城市',
          },
          {
            code: 0,
            name: '区县',
          }
        ];

      this.setState({
        selectRegionList: selectRegionList,
        regionType: 1,
        regionList: area.getList('province')
      });
    }

    setTimeout(() => {
      this.setRegionDoneStatus();
    }, 5);

  }

  bindinputAddress = (event) => {
    let address = this.state.address;
    address.addressDetail = event.detail.value;
    this.setState({
      address: address
    });
  }

  bindIsDefault = (value) => {
    console.log('value', value)
    let address = this.state.address;
    address.isDefault = !address.isDefault;
    this.setState({
      address: address,
      checkedList: value,
    });
  }

  doneSelectRegion = () => {
    if (this.state.selectRegionDone === false) {
      return false;
    }

    let address = this.state.address;
    let selectRegionList = this.state.selectRegionList;
    address.province = selectRegionList[0].name;
    address.city = selectRegionList[1].name;
    address.county = selectRegionList[2].name;
    address.areaCode = selectRegionList[2].code;

    this.setState({
      address: address,
      openSelectRegion: false
    });
  }

  selectRegion = (event) => {
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.state.regionList[regionIndex];
    let regionType = this.state.regionType;
    let selectRegionList = this.state.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;

    if (regionType == 3) {
      this.setState({
        selectRegionList: selectRegionList
      })

      let regionList = this.state.regionList.map(item => {
        //标记已选择的
        if (this.state.selectRegionList[this.state.regionType - 1].code == item.code) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })

      this.setState({
        regionList: regionList
      })
      setTimeout(() => {
        this.setRegionDoneStatus();
      }, 5);
      return
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.code = 0;
        item.name = index == 1 ? '城市' : '区县';
      }
      return item;
    });

    this.setState({
      selectRegionList: selectRegionList,
      regionType: regionType + 1
    })

    let code = regionItem.code;
    let regionList = [];
    if (regionType === 1) {
      // 点击省级，取市级
      regionList= area.getList('city', code.slice(0, 2))
    }
    else {
      // 点击市级，取县级
      regionList= area.getList('county', code.slice(0, 4))
    }

    this.setState({
      regionList: regionList
    })
    setTimeout(() => {
      this.setRegionDoneStatus();
    }, 5);

  }

  setRegionDoneStatus = () => {
    let doneStatus = this.state.selectRegionList.every(item => {
      return item.code != 0;
    });

    this.setState({
      selectRegionDone: doneStatus
    })
  }

  cancelSelectRegion = () => {
    this.setState({
      openSelectRegion: false,
      regionType: this.state.regionDoneStatus ? 3 : 1
    });
  }

  cancelAddress = () => {
    Taro.navigateBack();
  }
  saveAddress = () => {
    console.log(this.state.address)
    let address = this.state.address;

    if (address.name == '') {
      showErrorToast('请输入姓名');

      return false;
    }

    if (address.tel == '') {
      showErrorToast('请输入手机号码');
      return false;
    }


    if (address.areaCode == 0) {
      showErrorToast('请输入省市区');
      return false;
    }

    if (address.addressDetail == '') {
      showErrorToast('请输入详细地址');
      return false;
    }

    if (!check.isValidPhone(address.tel)) {
      showErrorToast('手机号不正确');
      return false;
    }

    saveAddress({
      id: address.id,
      name: address.name,
      tel: address.tel,
      province: address.province,
      city: address.city,
      county: address.county,
      areaCode: address.areaCode,
      addressDetail: address.addressDetail,
      isDefault: address.isDefault
    }).then(res => {
      var pages = Taro.getCurrentPages();
      console.log('pages', pages);
      var prevPage = pages[pages.length - 2];
      console.log(prevPage);
      if (prevPage.route == "pages/checkout/checkout") {
        prevPage.setState({
          addressId: res.data
        })

        try {
          Taro.setStorageSync('addressId', res.data);
        } catch (e) {

        }
        console.log("set address");
      }
      Taro.navigateBack();
    })
  }

  selectRegionType = (event) => {
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    console.log('regionTypeIndex', regionTypeIndex)
    let selectRegionList = this.state.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.state.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].code <= 0)) {
      return false;
    }

    let selectRegionItem = selectRegionList[regionTypeIndex];
    let code = selectRegionItem.code;
    let regionList;
    if (regionTypeIndex === 0) {
      // 点击省级，取省级
      regionList = area.getList('province');
    }
    else if (regionTypeIndex === 1) {
      // 点击市级，取市级
      regionList = area.getList('city', code.slice(0, 2));
    }
    else{
      // 点击县级，取县级
      regionList = area.getList('county', code.slice(0, 4));
    }
    console.log('regionList', regionList);
    regionList = regionList.map(item => {
      //标记已选择的
      if (this.state.selectRegionList[regionTypeIndex].code == item.code) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    })

    this.setState({
      regionList: regionList,
      regionType: regionTypeIndex + 1
    }, () => {
      this.setRegionDoneStatus();
    })
  }

  render() {
    const {address, openSelectRegion, selectRegionList, regionType, selectRegionDone, regionList, checkedList} = this.state;
    console.log('address.isDefault == 1', address.isDefault)
    return (
      <Block>
        <View className='add-address'>
          <View className='add-form'>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputName} placeholder='姓名' value={address.name} autoFocus />
            </View>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputMobile} value={address.tel} placeholder='手机号码' />
            </View>
            <View className='form-item'>
              <Input className='input' value={address.province + address.city + address.county} disabled onClick={this.chooseRegion} placeholder='省份、城市、区县' />
            </View>
            <View className='form-item'>
              <Input className='input' onInput={this.bindinputAddress} value={address.addressDetail} placeholder='详细地址, 如街道、楼盘号等' />
            </View>
            <View className='form-default'>
              <AtCheckbox options={this.checkboxOption} selectedList={checkedList} onChange={this.bindIsDefault} />
            </View>
          </View>

          <View className='btns'>
            <Button className='cannel' onClick={this.cancelAddress}>取消</Button>
            <Button className='save' onClick={this.saveAddress}>保存</Button>
          </View>

          {
            openSelectRegion && <View className='region-select'>
              <View className='hd'>
                <View className='region-selected'>
                  {
                    selectRegionList.map((item, index) => {
                      return <View className={`item ${item.code == 0 ? 'disabled' : ''} ${(regionType -1) === index ? 'selected' : ''}`} onClick={this.selectRegionType} data-region-type-index={index} key={item.code}>{item.name}</View>
                    })
                  }
                </View>
                <View className={`done ${selectRegionDone ? '' : 'disabled'}`} onClick={this.doneSelectRegion}>确定</View>
              </View>
              <View className='bd'>
                <ScrollView scrollY className='region-list'>
                  {
                    regionList.map((item, index) => {
                      return <View className={`item ${item.selected ? 'selected' : ''}`} onClick={this.selectRegion} data-region-index={index} key={item.code}>{item.name}</View>
                    })
                  }
                </ScrollView>
              </View>
            </View>
          }
        </View>
        {
          openSelectRegion && <View className='bg-mask' onClick={this.cancelSelectRegion}></View>
        }
      </Block>
    );
  }
}
export default Index;
