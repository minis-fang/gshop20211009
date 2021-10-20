<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link class="header_login" slot="right" :to="userinfo._id? '/userinfo':'/login'">
        <span class="header_login_text" v-if="!userinfo._id">登录|注册</span>
        <span class="header_login_text" v-else>
          <i class="iconfont icon-person"></i>
        </span>
      </router-link>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(minArr,index) in categorysArr" :key="index">
            <a
              href="javascript:"
              class="link_to_food"
              v-for="(category,index) in minArr"
              :key="index"
            >
              <div class="food_container">
                <img :src="baseImgUrl+category.image_url" />
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img v-else src="./images/msite_back.svg" alt="back" />
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList />
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";

import HeaderTop from "../../components/HeaderTop/HeaderTop";
import ShopList from "../../components/ShopList/ShopList";
export default {
  data() {
    return {
      baseImgUrl: "https://fuss10.elemecdn.com"
    };
  },
  mounted() {
    // 获取categorys
    this.$store.dispatch("getIndexCategory");
    this.$store.dispatch("getShop");
  },
  components: { HeaderTop, ShopList },
  computed: {
    ...mapState(["address", "categorys", "userinfo"]),
    // 利用categorys计算出一个新的二维数组
    categorysArr() {
      // 1.准备一个而为数组
      const arr = [];
      // 2.准备一个小数组
      let minArr = [];
      // 3.得到categorys数据
      const categorys = this.categorys;
      //4.对这个数据进行重新分配
      const len = 8; //定义分配长度
      categorys.forEach(c => {
        // 如果小的长度已经是8了，就重新置为空
        if (minArr.length === 8) {
          minArr = [];
        }
        // 一旦minArr的长度为0,我们就将它加入到外面的大数组中
        if (minArr.length === 0) {
          arr.push(minArr);
        }
        // 将每条数据放入小数组中
        minArr.push(c);
      });
      return arr;
    }
  },
  watch: {
    categorys(value) {
      // 这里需要监视分类数据，等数据来了，页面渲染了就执行以下代码
      // 不然这里会出现错误
      this.$nextTick(() => {
        //此方法在这里的用处就是等数据渲染完成后执行代码
        // 创建一个Swiper实例对象
        new Swiper(".swiper-container", {
          loop: true, // 循环模式选项
          // 如果需要分页器
          pagination: {
            el: ".swiper-pagination"
          }
        });
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl'
.msite // 首页
  width 100%
  .msite_nav
    bottom-border-1px(#e4e4e4)
    margin-top 45px
    height 200px
    background #fff
    .swiper-container
      width 100%
      height 100%
      .swiper-wrapper
        width 100%
        height 100%
        .swiper-slide
          display flex
          justify-content center
          align-items flex-start
          flex-wrap wrap
          .link_to_food
            width 25%
            .food_container
              display block
              width 100%
              text-align center
              padding-bottom 10px
              font-size 0
              img
                display inline-block
                width 50px
                height 50px
            span
              display block
              width 100%
              text-align center
              font-size 13px
              color #666
      .swiper-pagination
        >span.swiper-pagination-bullet-active
          background #02a774
  .msite_shop_list
    top-border-1px(#e4e4e4)
    margin-top 10px
    background #fff
    .shop_header
      padding 10px 10px 0
      .shop_icon
        margin-left 5px
        color #999
      .shop_header_title
        color #999
        font-size 14px
        line-height 20px
</style>