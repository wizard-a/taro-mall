
import Taro, {useCallback} from '@tarojs/taro';
import  { AtTabBar } from 'taro-ui';
import { Block } from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import * as app from '../../utils/app';


export default () => {
  const {nav, currentNavIndex} = useSelector(state => state.home.shop)
  const dispatch = useDispatch();
  const onClick = useCallback((tab) => {
    console.log('nav', nav, nav.length, tab);
    if (nav && nav.length >= tab) {
      const currTab = nav[tab];
      app.tabBarSwitchTab(currTab);
      dispatch({type: 'home/changeShopNavIndex', payload: tab})
      dispatch({type: 'home/changeShopNav', payload: currTab})
    }
  }, [nav]);
  return <Block>
      <AtTabBar
        className='my-tab-bar'
        fixed
        current={currentNavIndex || 0}
        fontSize={10}
        iconSize={24}
        onClick={onClick}
        backgroundColor='#fafafa'
        selectedColor='#AB956D'
        color='#666'
        tabList={nav}
      />
  </Block>
}
