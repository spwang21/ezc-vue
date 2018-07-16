import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login';
import register from '@/pages/register';
import clause from '@/pages/clause';
import Home from '@/pages/home';
import specialService from '@/pages/specialService';
import exchangeCard from '@/pages/exchangeCard';
import Card from '@/pages/memberCard';
import remind from '@/pages/remind';
import packageOrder from '@/pages/packageOrder';
import SharePage from '@/pages/share';
import memberSign from '@/pages/memberSign';
import Mall from '@/pages/mall';
import search from '@/pages/search';
import PackageList from '@/pages/packageList';
import PackageDetail from '@/pages/PackageDetail';
import goodsList from '@/pages/goodsList';
import goodsDetail from '@/pages/goodsDetail';
import Community from '@/pages/community';
import CommunityDetail from '@/pages/CommunityDetail';
import Publish from '@/pages/publish';
import Mine from '@/pages/mine';
import Integral from '@/pages/integral';
import memberInfo from '@/pages/memberInfo';
import vehicle from '@/pages/vehicle';
import bindCar from '@/pages/vehiclesBound';
import orderList from '@/pages/orderList';
import aboutUs from '@/pages/aboutUs';
import bespeakDrive from '@/pages/bespeakDrive';
import recordDrive from '@/pages/recordDrive';
import driveDetail from '@/pages/detailDrive';
import recordRepair from '@/pages/recordRepair';
import recordRescue from '@/pages/recordRescue';
import bespeakRepair from '@/pages/bespeakRepair';
import bespeakRescue from '@/pages/bespeakRescue';
import Page404 from '@/pages/404';

Vue.use(Router);

export default new Router({
  routes: [    
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        title:"首页"
      }
    },
    {
      path: '/service',
      name: 'specialService',
      component: specialService,
      meta:{
        title:"专属服务"
      }
    },
    {
      path: '/coupons',
      name: 'exchangeCard',
      component: exchangeCard,
      meta:{
        title:"领券中心"
      }
    },
    {
      path: '/card',
      name: 'memberCard',
      component: Card,
      meta:{
        title:"我的卡包"
      }
    },
    {
      path: '/remind',
      name: 'remind',
      component: remind,
      meta:{
        title:"我的提醒"
      }
    },
    {
      path: '/package',
      name: 'packageOrder',
      component: packageOrder,
      meta:{
        title:"会员套餐"
      }
    },
    {
      path: '/qrcode',
      name: 'sharePage',
      component: SharePage,
      meta:{
        title:"我的分享"
      }
    },
    {
      path: '/sign',
      name: 'memberSign',
      component: memberSign,
      meta:{
        title:"会员签到"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        title:"登录"
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta:{
        title:"注册"
      }
    },
    {
      path: '/404',
      name: 'Page404',
      component: Page404,
      meta:{
        title:"404！Page Not Found!"
      }
    },
    {
      path: '/clause',
      name: 'clause',
      component: clause,
      meta:{
        title:"使用条款"
      }
    },
    {
      path: '/mall',
      name: 'mall',
      component: Mall,
      meta:{
        title:"商城"
      }
    },
    {
      path: '/mall/package',
      name: 'packageList',
      component: PackageList,
      meta:{
        title:"套餐推荐"
      }
    },
    {
      path: '/mall/package/:id',
      name: 'packageDetail',
      component: PackageDetail,
      meta:{
        title:"套餐详情"
      }
    },
    {
      path: '/mall/goods',
      name: 'goodsList',
      component: goodsList,
      meta:{
        title:"商品列表"
      }
    },
    {
      path: '/mall/goods/:id',
      name: 'goodsDetail',
      component: goodsDetail,
      meta:{
        title:"商品详情"
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta:{
        title:"搜索结果"
      }
    },
    {
      path: '/community',
      name: 'community',
      component: Community,
      meta:{
        title:"发现"
      }
    },
    {
      path: '/community/detail/:id',
      name: 'communityDetail',
      component: CommunityDetail,
      meta:{
        title:"动态详情"
      }
    },
    {
      path: '/community/publish',
      name: 'publish',
      component: Publish,
      meta:{
        title:"发表"
      }
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine,
      meta:{
        title:"个人中心"
      }
    },
    {
      path: '/mine/integral',
      name: 'integral',
      component: Integral,
      meta:{
        title:"会员积分"
      }
    },
    {
      path: '/mine/myInfo',
      name: 'memberInfo',
      component: memberInfo,
      meta:{
        title:"会员信息"
      }
    },
    {
      path: '/mine/vehicle',
      name: 'vehicle',
      component: vehicle,
      meta:{
        title:"我的车库"
      }
    },
    {
      path: '/mine/vehicle/:id',
      name: 'bindCar',
      component: bindCar,
      meta:{
        title:"绑定爱车"
      }
    },
    {
      path: '/mine/order',
      name: 'orderList',
      component: orderList,
      meta:{
        title:"我的订单"
      }
    },
    {
      path: '/mine/about',
      name: 'aboutUs',
      component: aboutUs,
      meta:{
        title:"关于我们"
      }
    },
    {
      path: '/record/drive',
      name: 'recordDrive',
      component: recordDrive,
      meta:{
        title:"试驾记录"
      }
    },
    {
      path: '/record/drive/:id',
      name: 'driveDetail',
      component: driveDetail,
      meta:{
        title:"试驾详情"
      }
    },
    {
      path: '/record/maintenance',
      name: 'recordRepair',
      component: recordRepair,
      meta:{
        title:"维保记录"
      }
    },
    {
      path: '/record/rescue',
      name: 'recordRescue',
      component:recordRescue,
      meta:{
        title:"救援记录"
      }
    },
    {
      path: '/drive',
      name: 'bespeakDrive',
      component: bespeakDrive,
      meta:{
        title:"预约试驾"
      }
    },
    {
      path: '/maintenance',
      name: 'bespeakRepair',
      component: bespeakRepair,
      meta:{
        title:"预约维保"
      }
    },
    {
      path: '/rescue',
      name: 'bespeakRescue',
      component:bespeakRescue,
      meta:{
        title:"一键救援"
      }
    }
  ]
});
