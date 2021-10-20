// 更新state的多个对象的方法
import Vue from "vue"
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_SHOP_GOODS,
    RECEIVE_SHOP_INFO,
    RECEIVE_SHOP_RATINGS,
    INCREMENT_SHOP_FOOD,
    DECREMENT_SHOP_FOOD,
    CLEAR_SHOP_CART,
    RECEIVE_SEARCH_SHOP
} from "./mutation-types"
export default {
    // 接收地址相关信息
    [RECEIVE_ADDRESS](state, { address }) {
        state.address = address
    },
    // 接收食品类别信息
    [RECEIVE_CATEGORYS](state, { categorys }) {
        state.categorys = categorys
    },
    // 接收店铺信息
    [RECEIVE_SHOPS](state, { shops }) {
        state.shops = shops
    },
    //接收用户信息
    [RECEIVE_USER_INFO](state, { userinfo }) {
        state.userinfo = userinfo
    },
    //重置用户信息
    [RESET_USER_INFO](state) {
        state.userinfo = {}
    },
    //接收商家商品信息
    [RECEIVE_SHOP_GOODS](state, { shopgoods }) {
        state.shopgoods = shopgoods
    },
    //接收商家评价信息
    [RECEIVE_SHOP_RATINGS](state, { shopratings }) {
        state.shopratings = shopratings
    },
    //接收商家信息
    [RECEIVE_SHOP_INFO](state, { shopinfo }) {
        state.shopinfo = shopinfo
    },
    //增加food.count
    [INCREMENT_SHOP_FOOD](state, { food }) {
        if (!food.count) {// 第一次增加时, 没有count
            Vue.set(food, "count", 1)//使用Vue.set方法给对象设置一个新的属性，才能在页面中监听到数据得变化
            //这里将food加入到shopcart里面
            state.shopcart.push(food)
        } else {
            food.count++

        }

    },
    //减少food.count
    [DECREMENT_SHOP_FOOD](state, { food }) {
        // count 有值才减1
        if (food.count) {
            food.count--
            if (food.count === 0) {//如果当前的count为0了，就要将这个数据重shopcart中删除
                state.shopcart.splice(state.shopcart.indexOf(food), 1)
            }
        }
    },

    // 清空购物车
    [CLEAR_SHOP_CART](state) {
        // 将购物车置为空前，需要清空count
        state.shopcart.forEach(cart => {
            cart.count = 0
        });
        state.shopcart = []
    },

    //根据关键字设置state中searchshops的值
    [RECEIVE_SEARCH_SHOP](state, { searchshops }) {
        state.searchshops = searchshops
    }



}