<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!--current用来指定是否是当前分类-->
          <li
            class="menu-item"
            v-for="(good,index) in shopgoods"
            :key="index"
            :class="{current:index===currentIndex}"
            @click="changeCurrentIndex(index)"
          >
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon" />
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class="foods-wrapper">
        <ul ref="foodlist">
          <li class="food-list-hook" v-for="(good,index) in shopgoods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li
                class="food-item bottom-border-1px"
                v-for="(food,index) in good.foods"
                :key="index"
                @click="showFood(food)"
              >
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" />
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <Food ref="foodref" :food="food" />
  </div>
</template>

<script>
/*
* 本页说明：
###关于点餐左右分开滚动的说明：
  1、滚动使用了better-scroll.js库，因此需要使用npm 安装此库
  2、此处创建滚动内容的时候需要注意，跟MSite中的swiper一样，我们需要在数据获取完成，并且页面加载后才能新建滚动区域，
    不同的是MSite中采用的wacth监视数据改变，结合this.$nextTick()实现的
    此处使用的直接在dispacth相应的action的时候传递回调函数，利用回调函数确认创建滚动区域的时机
  3、本页data中设计了三个数据
    currentIndex:用来计算确定当前的选项是哪一个，这里利用tops和scrolly计算得来。
    tops:[] 用来存储每个food类别的li的top值
    scrolly:用来存储当前滚动的高度
  4、这里滚动的效果，监听事件都需要参考better-scrolly.js中的官方api 
*/
import BScroll from "better-scroll";
import { mapState } from "vuex";
import CartControl from "../../../components/CartControl/CartControl";
import Food from "../../../components/Food/Food";
import ShopCart from "../../../components/ShopCart/ShopCart";
export default {
  data() {
    return {
      scrolly: 0, //右侧滚动高度
      tops: [], //用来收集当前分类的top值
      food: {}
    };
  },
  mounted() {
    //此处使用BScroll创建滚动对象，需要考虑需要数据完全加载出来才行，因此在出发action中传入一个回调函数，用于等数据获取完整后执行
    this.$store.dispatch("getGoods", () => {
      this.$nextTick(() => {
        const menuWrapper = new BScroll(".menu-wrapper", {
          click: true //如果不设置，有些浏览器会出现兼容问题
        });
        this.foodsWrapper = new BScroll(".foods-wrapper", {
          probeType: 2,
          click: true
        });
        this._getScrollY(); //非事件回调函数
        //收集foodlist的分类高度
        this._getTops(); //非事件回调函数
      });
    });
  },
  computed: {
    ...mapState(["shopgoods"]),
    currentIndex() {
      let index = 0; //设置初始值
      //根据scrolly和tops中的值来获取当前的index
      const { scrolly, tops } = this;
      index = tops.findIndex((top, index) => {
        return scrolly >= top && scrolly < tops[index + 1];
      });
      return index;
    }
  },
  methods: {
    _getScrollY() {
      // 收集当前滚动的高度,如果要监听这个需要在上面代码中配置probeType
      this.foodsWrapper.on("scroll", position => {
        this.scrolly = Math.abs(position.y);
      });
      //监听当前滚动的scrollEnd,然后修改scrolly,用于优化bug
      this.foodsWrapper.on("scrollEnd", position => {
        this.scrolly = Math.abs(position.y);
      });
    },
    _getTops() {
      let tops = []; //创建一个新的数组
      let liTop = 0; //第一个值肯定为0
      tops.push(liTop);
      const foodArr = this.$refs.foodlist.getElementsByClassName(
        "food-list-hook"
      );
      Array.prototype.slice.call(foodArr).forEach((li, index) => {
        liTop += li.clientHeight;
        tops.push(liTop);
      });
      this.tops = tops;
    },
    changeCurrentIndex(index) {
      this.scrolly = this.tops[index];
      this.foodsWrapper.scrollTo(0, -this.scrolly, 300, "easing");
    },
    showFood(food) {
      // 此处注意：父组件调用子组件的时间，这里使用ref得到组件对象，然后调用对应方法
      this.$refs.foodref.changeFoodShow(true);
      this.food = food;
    }
  },
  components: {
    CartControl,
    Food,
    ShopCart
  }
};
</script>

<style lang="stylus"rel="stylesheet/stylus">
@import '../../../common/stylus/mixins.styl'
.goods
  display flex
  position absolute
  top 195px
  bottom 46px
  width 100%
  background #fff
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background #fff
        color $green
        font-weight 700
        .text
          border-none()
      .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
      .text
        display table-cell
        width 56px
        vertical-align middle
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size 12px
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      bottom-border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
        .desc
          line-height 12px
          margin-bottom 8px
        .extra
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 159)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 12px
</style>