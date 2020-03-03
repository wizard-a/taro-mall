import Taro , { Component, clearStorage } from '@tarojs/taro';
import { View, Text , Image, ScrollView, Navigator, Input, CheckboxGroup} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import './index.less';

@connect(({ search }) => ({
  helpKeyword: search.helpKeyword,
  goodsList: search.goodsList,
  filterCategoryList: search.filterCategoryList,
  /** search index 接口数据*/
  historyKeywordList: search.historyKeywordList,
  defaultKeyword: search.defaultKeyword,
  hotKeywordList: search.hotKeywordList
}))
class Search extends Component {

   config = {
    navigationBarTitleText: '搜索'
  }

  state = {
    keyword: null,
    page: 1,
    limit: 20,
    categoryId: 0,
    currentSort: 'name',
    currentSortType: 'default',
    currentSortOrder: 'desc',
    // defaultKeyword: {},
    searchStatus: false,
    categoryFilter: false,
  }

  componentDidMount () {
    this.getSearchKeyword();
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch({type: 'search/REST'});
  }

  getSearchKeyword = () => {
    const {dispatch} = this.props;
    dispatch({type: 'search/getSearchIndex'})
  }

  getGoodsList = (cbk) => {
    const { dispatch } = this.props;
    const { page, limit, keyword, categoryId, currentSort, currentSortOrder} = this.state;
    dispatch({type: 'search/getGoodsList', payload: {keyword, page, limit, sort: currentSort, order: currentSortOrder, categoryId}}).then(res => {
      this.setState({
        searchStatus: true,
        categoryFilter: false,
      })

      cbk && cbk();
    });
    //重新获取关键词
    this.getSearchKeyword();
  }

  inputChange = (e) => {
    const {value} = e.target;
    this.setState({
      keyword: value,
      searchStatus: false,
    }, () => {
      if (value) {
        this.getHelpKeyword(value);
      }
    })
  }

  /**
   * 获取搜索关键字
   */
  getHelpKeyword = (value) => {
    const { dispatch } = this.props;
    dispatch({type: 'search/getSearchHelper', payload: value});
  }

  inputFocus = (e) => {
    // this.setData({
    //   searchStatus: false,
    //   goodsList: []
    // });
    const {value} = e.target;
    this.setState({
      searchStatus: false,
    }, () => {
      if (value) {
        this.getHelpKeyword(value);
      }
    })
  }

  getSearchResult = (keyword) => {
    if (keyword === '') {
      keyword = this.props.defaultKeyword.keyword;
    }
    this.setState({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      // goodsList: []
    }, () => {

      this.getGoodsList();
    });

  }

  onKeywordConfirm = (e) => {
    this.getSearchResult(e.target.value);
  }

  clearKeyword = () => {
    // this.setState
    console.log('清空输入框数据');
    this.setState({
      keyword: '',
      searchStatus: false
    });
  }

  closeSearch = () => {
    Taro.navigateBack()
  }

  clearHistory = () => {
    const {dispatch} = this.props;
    dispatch({type: 'search/clearHistory'});
  }

  onKeywordTap = (keyword) => {
    this.getSearchResult(keyword);
  }

  openSortFilter = (currentId) => {
    switch (currentId) {
      case 'categoryFilter':
        this.setState({
          categoryFilter: !this.state.categoryFilter,
          currentSortType: 'category',
          currentSort: 'add_time',
          currentSortOrder: 'desc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.state.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setState({
          currentSortType: 'price',
          currentSort: 'retail_price',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false
        }, () => {
          this.getGoodsList();
        });
        break;
      default:
        //综合排序
        this.setState({
          currentSortType: 'default',
          currentSort: 'name',
          currentSortOrder: 'desc',
          categoryFilter: false,
          categoryId: 0,
        }, () => {
          this.getGoodsList();
        });
    }
  }

  selectCategory = (categoryIndex) => {
    const {dispatch, filterCategoryList} = this.props;
    let currentIndex = categoryIndex;
    let filterCategory = filterCategoryList;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }



    this.setState({
      categoryFilter: false,
      categoryId: currentCategory.id,
      page: 1,
    }, () => {
      this.getGoodsList(() => {
        dispatch({
          type: 'search/changeFilterCategoryList',
          payload: [...filterCategory]
        })
      });
    });
  }

  render() {
    const {goodsList, helpKeyword, defaultKeyword, filterCategoryList, historyKeywordList, hotKeywordList } = this.props;
    const { keyword, searchStatus, categoryFilter, currentSortType, currentSortOrder } = this.state;
    // console.log('filterCategoryList', filterCategoryList);
    return (
      <ScrollView className='container'>
        <View className='search-header'>
          <View className='input-box'>
            <AtIcon className='icon' size='18' color='#666' value='search' />
            <Input name='input' className='keyword' focus value={keyword} confirmType='search' onInput={this.inputChange} onFocus={this.inputFocus} onConfirm={this.onKeywordConfirm} placeholder={defaultKeyword.keyword} />
            { keyword && <AtIcon className='del' size='14' color='#666' onClick={this.clearKeyword} value='close' />}
          </View>
          <View className='right' onClick={this.closeSearch}>取消</View>
        </View>
        {
          !searchStatus && <View className='no-search'>
            {
              !keyword  && historyKeywordList.length > 0 && <View className='search-keywords search-history'>
                <View className='h'>
                  <Text className='title'>历史记录</Text>
                  <AtIcon onClick={this.clearHistory} value='close' size='14' color='#666' className='icon' />
                </View>
                <View className='b'>
                  {
                    historyKeywordList.map(item => {
                      return <View className='item' onClick={() => this.onKeywordTap(item.keyword)} key={item.keyword} hoverClass='navigator-hover'>{item.keyword}</View>
                    })
                  }
                </View>
              </View>
            }
            {
              !keyword && hotKeywordList.length > 0 && <View className='search-keywords search-hot'>
                  <View className='h'>
                    <Text className='title'>热门搜索</Text>
                  </View>
                  <View className='b'>
                    {
                      hotKeywordList.map(item => {
                        return  <View className={`item ${item.is_hot === 1 ? 'active' : ''}`} hoverClass='navigator-hover' onClick={() => this.onKeywordTap(item.keyword)} key={item.id}>{item.keyword}</View>
                      })
                    }
                  </View>
                </View>
            }
            {
              keyword && <View className='shelper-list'>
                {
                  Array.isArray(helpKeyword) && helpKeyword.map(item => {
                    return  <View className='item' hoverClass='navigator-hover' key={item.id} onClick={ _ =>this.onKeywordTap(item)}>{item}</View>
                  })
                }
              </View>
            }
          </View>
        }

        {
          searchStatus && goodsList.length && <View className='search-result'>
            <View className='sort'>
              <View className='sort-box'>
                <View className={`item ${currentSortType == 'default' ? 'active' : ''}`} onClick={() => this.openSortFilter('defaultSort')}>
                  <Text className='txt'>综合</Text>
                </View>
                <View className={`item ${currentSortType == 'price' ? 'active' : ''}`} onClick={() => this.openSortFilter('priceSort')}>
                  <Text className='txt'>价格</Text>
                  {
                    currentSortType == 'price' && currentSortOrder == 'asc' && <AtIcon value='chevron-up' size='18' color='#666' />
                  }
                  {
                    currentSortType == 'price' && currentSortOrder == 'desc' && <AtIcon value='chevron-down' size='18' color='#666' />
                  }
                </View>
                <View className={`item ${currentSortType == 'category' ? 'active' : ''}`} onClick={() => this.openSortFilter('categoryFilter')}>
                  <Text className='txt'>分类</Text>
                </View>
              </View>
              {
                categoryFilter && <View className='sort-box-category'>
                  {
                    Array.isArray(filterCategoryList) && filterCategoryList.map((item, index) => {
                      return <View className={`item ${item.selected ? 'active' : ''}`} key={item.id} onClick={() => this.selectCategory(index)}>{item.name}</View>
                    })
                  }
                </View>
              }
            </View>
            <View className='cate-item'>
              <View className='b'>
                {
                  goodsList && goodsList.map((item, index) => {
                    const newIndex = index;
                    return <Navigator className={`item ${(newIndex + 1) % 2 == 0 ? 'item-b' : ''}`} url={`/pages/goods/goods?id={item.id}`} key={item.id}>
                    <Image className='img' src={item.picUrl}></Image>
                    <Text className='name'>{item.name}</Text>
                    <Text className='price'>￥{item.retailPrice}</Text>
                  </Navigator>
                  })
                }
              </View>
            </View>
          </View>
        }

        {
          !goodsList.length && searchStatus && <View className='search-result-empty'>
            <Text className='text'>您寻找的商品还未上架</Text>
          </View>
        }
      </ScrollView>
    );
  }
}
export default Search;
