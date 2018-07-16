// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// import Vuex from 'vuex';
// import store from './vuex/index';
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload);
Vue.use(Vant);

import axios from 'axios';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
