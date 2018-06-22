import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Routers from './route/router.js';

import './style.css';
import product_data from './mock-data/product.js';

Vue.use(Vuex);
Vue.use(VueRouter);

const RouterConfig = {
  mode: 'history',
  routes: Routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
});

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})

// 数组去重
function getFilterArray (array) {
  const res = [];
  const json = {};
  for (let i = 0; i < array.length; i++){
    const _self = array[i];
    if(!json[_self]) {
      res.push(_self);
      json[_self] = 1;
    }
  }
  return res;
}

const store = new Vuex.Store({
  state: {
    // 商品列表数据
    productList: [],
    // 购物车数据
    cartList: []
  },
  getters: {
    brands: state => {
      const brands = state.productList.map(item => item.brand);
      return getFilterArray(brands);
    },
    colors: state => {
      const colors = state.productList.map(item => item.color);
      return getFilterArray(colors);
    }
  },
  mutations: {
    // 添加商品列表
    setProductList (state, data) {
      state.productList = data;
    },
    // 修改商品数量
    editCartCount (state, payload) {
      const product = state.cartList.find(item => item.id === payload.id);
      product.count += payload.count;
    },
    // 删除购物车中的一个商品
    deleteCart (state, id) {
      const index = state.cartList.findIndex(item => item.id === id);
      state.cartList.splice(index, 1);
    },
    addCart (state, id) {
      const isAdded = state.cartList.find(item => item.id === id);
      if(isAdded) {
        isAdded.count++;
      }else{
        state.cartList.push({
          id: id,
          count: 1
        });
      }
    },
    // 清空购物车
    emptyCart (state) {
      state.cartList = [];
    }
  },
  actions: {
    // 请求商品列表
    getProductList (context) {
      setTimeout(() => {
        context.commit('setProductList', product_data);
      }, 500);
    },
    buy (context) {
      return new Promise(resolve => {
        setTimeout(() => {
          context.commit('emptyCart');
          resolve();
        }, 500);
      });
    }
  }
});

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
})
