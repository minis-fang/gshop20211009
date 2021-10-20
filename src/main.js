/*
入口JS
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button } from 'mint-ui'

import "./mock/mock"//此处使用mockjs实现前端模拟数据
import "./fiters"//引入全局过滤器

// 注册全局组件
Vue.component(Button.name, Button)
//图片懒加载插件
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'//此处直接引入图片资源
Vue.use(VueLazyload, {
  loading: loading//设置图片懒加载时的图片
})
//这里使用了这个插件就多了一个全局指令v-lazy,代替图片的:src,这里需要注意，只能使用在异步加载的imgsrc


new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})