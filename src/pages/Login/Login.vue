<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:isCurrent}" @click="changeShow()">短信登录</a>
          <a href="javascript:;" :class="{on:!isCurrent}" @click="changeShow()">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:isCurrent}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" />
              <button
                :disabled="!isRightPhone"
                class="get_verification"
                :class="{showColor:(isRightPhone && currentTime===0)}"
                @click.prevent="showTime"
              >{{currentTime? '已发送('+currentTime+')s':'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code" />
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!isCurrent}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name" />
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-model="pwd" v-if="showPwd" />
                <input type="password" maxlength="8" placeholder="密码" v-model="pwd" v-else />
                <div class="switch_button" :class="showPwd?'on':'off'" @click="changePwdShow">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha" />
                <img
                  class="get_verification"
                  src="http://localhost:4000/captcha"
                  alt="captcha"
                  @click="changeNewCaptcha"
                  ref="captcha"
                />
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="loginFun">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip v-if="alertShow" :alertText="alertText" @closeTip="closeTip" />
  </section>
</template>

<script>
import AlertTip from "../../components/AlertTip/AlertTip";
import { getSendcode, getPhoneLogin, getPwdLogin } from "../../api/index";
export default {
  components: {
    AlertTip
  },
  data() {
    return {
      isCurrent: true, //true 代表短信登录，false 代表密码登录
      phone: "", //手机号码
      code: "", //验证码
      currentTime: 0, //倒计时
      name: "", //用户名
      pwd: "", //密码
      captcha: "", //图片验证码
      showPwd: false, //是否显示密码
      alertShow: false,
      alertText: ""
    };
  },
  methods: {
    changeShow() {
      this.isCurrent = !this.isCurrent;
    },
    async showTime() {
      // 当currentTime为0的时候才能设置定时器
      let IntervalID;
      if (!this.currentTime) {
        console.log("设定倒计时");
        this.currentTime = 30;
        IntervalID = setInterval(() => {
          this.currentTime--;
          if (this.currentTime === 0) {
            clearInterval(IntervalID);
          }
        }, 1000);
        // 发送验证码请求
        let result = await getSendcode(this.phone);
        if (result.code === 0) {
          this.changeAlertText("获取验证码成功");
        } else {
          this.changeAlertText(result.msg);
          // 清除定时器
          clearInterval(IntervalID);
          this.currentTime = 0;
        }
      }
    },
    changePwdShow() {
      this.showPwd = !this.showPwd;
    },
    async loginFun() {
      // 分为短信登录，和密码登录
      const { phone, code, name, pwd, captcha } = this;
      let result;
      //短信登录
      if (this.isCurrent) {
        //判断手机号是否存在
        if (!this.isRightPhone) {
          //提示手机号码不存在
          this.changeAlertText("手机号码不存在");
        } else if (!code) {
          //提示验证码不存在
          this.changeAlertText("验证码不存在");
        }
        // 发送请求短信登录
        result = await getPhoneLogin(phone, code);
      } else {
        //密码登录
        // 判断用户名是否存在

        if (!name) {
          //提示用户名不存在
          this.changeAlertText("用户名不存在");
        } else if (!pwd) {
          //判断密码是否存在
          //提示密码不存在
          this.changeAlertText("密码不存在");
        } else if (!captcha) {
          //判断图片验证码是否存在
          //提示图片验证码不存在
          this.changeAlertText("图片验证码不存在");
        }
        // 发送请求密码登录
        result = await getPwdLogin({ name, code, captcha });
      }
      console.log(result);
      if (result.code === 0) {
        // 登录成功，需要将用户信息存储到state
        const userinfo = result.data;
        this.$store.dispatch("setUserInfo", userinfo);
        // 页面跳转到用户信息
        this.$router.replace("/profile");
      } else {
        this.changeAlertText(result.msg);
        this.changeNewCaptcha();
      }
    },
    closeTip() {
      this.alertShow = false;
    },
    changeAlertText(alertMsg) {
      this.alertShow = true;
      this.alertText = alertMsg;
    },
    changeNewCaptcha() {
      this.$refs.captcha.src =
        "http://localhost:4000/captcha?time=" + new Date();
    }
  },
  computed: {
    isRightPhone() {
      return /^1\d{10}$/.test(this.phone);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl'
.loginContainer
  width 100%
  height 100%
  background #fff
  .loginInner
    padding-top 60px
    width 80%
    margin 0 auto
    .login_header
      .login_logo
        font-size 40px
        font-weight bold
        color #02a774
        text-align center
      .login_header_title
        padding-top 40px
        text-align center
        >a
          color #333
          font-size 14px
          padding-bottom 4px
          &:first-child
            margin-right 40px
          &.on
            color #02a774
            font-weight 700
            border-bottom 2px solid #02a774
    .login_content
      >form
        >div
          display none
          &.on
            display block
          input
            width 100%
            height 100%
            padding-left 10px
            box-sizing border-box
            border 1px solid #ddd
            border-radius 4px
            outline 0
            font 400 14px Arial
            &:focus
              border 1px solid #02a774
          .login_message
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .get_verification
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              border 0
              color #ccc
              font-size 14px
              background transparent
              &.showColor
                color black
          .login_verification
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .switch_button
              font-size 12px
              border 1px solid #ddd
              border-radius 8px
              transition background-color 0.3s, border-color 0.3s
              padding 0 6px
              width 30px
              height 16px
              line-height 16px
              color #fff
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              &.off
                background #fff
                .switch_text
                  float right
                  color #ddd
              &.on
                background #02a774
              >.switch_circle
                // transform translateX(27px)
                position absolute
                top -1px
                left -1px
                width 16px
                height 16px
                border 1px solid #ddd
                border-radius 50%
                background #fff
                box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
                transition transform 0.3s
                &.right
                  transform translateX(27px)
          .login_hint
            margin-top 12px
            color #999
            font-size 14px
            line-height 20px
            >a
              color #02a774
        .login_submit
          display block
          width 100%
          height 42px
          margin-top 30px
          border-radius 4px
          background #4cd96f
          color #fff
          text-align center
          font-size 16px
          line-height 42px
          border 0
      .about_us
        display block
        font-size 12px
        margin-top 20px
        text-align center
        color #999
    .go_back
      position absolute
      top 5px
      left 5px
      width 30px
      height 30px
      >.iconfont
        font-size 20px
        color #999
</style>