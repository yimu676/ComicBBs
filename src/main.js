import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './axios/http.js'

import Vant from 'vant';
import {Toast} from 'vant'
import { Dialog } from 'vant';

// 全局注册

import 'vant/lib/index.css';
import EventBus from '@/bus.js'

Vue.use(EventBus)
Vue.prototype.$EventBus = EventBus
Vue.prototype.$msg = Toast
Vue.prototype.$http = http
Vue.prototype.$Dialog = Dialog

Vue.use(Vant);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
