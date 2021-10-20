// 通过mutation,间接更新state
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_SHOP_RATINGS,
    RECEIVE_SHOP_INFO,
    RECEIVE_SHOP_GOODS,
    INCREMENT_SHOP_FOOD,
    DECREMENT_SHOP_FOOD,
    CLEAR_SHOP_CART,
    RECEIVE_SEARCH_SHOP
} from "./mutation-types"

import { getPosition, getIndexCategory, getShops, UserLogOut, getUserinfo, getShopGoods, getShopRatings, getShopInfo, searchShops } from "../api"

export default {
    // 异步获取地址
    async getAddress({ commit, state }) {
        // 第一步发送异步请求
        const geohash = state.latitude + "," + state.longitude;
        const result = await getPosition(geohash);
        // 第二步：提交mutation
        if (result.code === 0) {
            const address = result.data
            commit(RECEIVE_ADDRESS, { address })
        }
    },
    // 异步获取食品分类数组
    async getIndexCategory({ commit }) {
        const result = await getIndexCategory();
        if (result.code === 0) {
            const categorys = result.data;
            commit(RECEIVE_CATEGORYS, { categorys })
        }
    },
    // 异步获取店铺数组
    async getShop({ commit, state }) {
        const result = await getShops(state.longitude, state.latitude);
        if (result.code === 0) {
            const shops = result.data;
            commit(RECEIVE_SHOPS, { shops })
        }
    },
    //同步设置用户信息
    setUserInfo({ commit }, userinfo) {
        commit(RECEIVE_USER_INFO, { userinfo })
    },
    //异步登出
    async logout({ commit }) {
        const result = await UserLogOut();
        if (result.code === 0) {
            commit(RESET_USER_INFO)
        }
    },
    //异步获取用户信息，主要用于判断用户是否登录
    async getUserInfo({ commit }) {
        const result = await getUserinfo()
        if (result.code === 0) {
            const userinfo = result.data
            commit(RECEIVE_USER_INFO, { userinfo })
        }
    },
    //异步发送请求商家商品列表
    async getGoods({ commit }, callback) {
        const result = await getShopGoods()
        if (result.code === 0) {
            const shopgoods = result.data
            commit(RECEIVE_SHOP_GOODS, { shopgoods })
        }
        //下面一句话如果有回调函数传入则执行，如果没有则执行
        callback && callback()
    },
    //异步发送请求商家评价信息
    async getRatings({ commit }) {
        const result = await getShopRatings()
        if (result.code === 0) {
            const shopratings = result.data
            commit(RECEIVE_SHOP_RATINGS, { shopratings })
        }
    },
    //异步发送请求商家评价信息
    async getInfo({ commit }) {
        const result = await getShopInfo()
        if (result.code === 0) {
            const shopinfo = result.data
            commit(RECEIVE_SHOP_INFO, { shopinfo })
        }
    },
    //同步跟新food中的count
    changeFoodCount({ commit }, { isAdd, food }) {
        if (isAdd) {
            //增加count
            commit(INCREMENT_SHOP_FOOD, { food })
        } else {
            //减少count
            commit(DECREMENT_SHOP_FOOD, { food })
        }
    },
    //清空购物车列表
    clearshopcart({ commit }) {
        commit(CLEAR_SHOP_CART)
    },

    //根据关键字异步查询商铺相关数据信息
    async getSearchShops({ commit, state }, keyword) {
        const geohash = state.latitude + "," + state.longitude;
        const result = await searchShops(geohash, keyword);
        if (result.code === 0) {
            const searchshops = result.data
            commit(RECEIVE_SEARCH_SHOP, { searchshops })
        }

    }

}