// 包含n个接口的请求函数
// 函数的返回值是promise
import ajax from "./ajax";
// 1、根据经纬度获取位置详情
export const getPosition = (geohash) => ajax(`/position/${geohash}`)
// 2、获取食品分类列表
export const getIndexcategory = () => ajax("/index_category")
// 3、根据经纬度获取商铺列表
export const getShops = (longitude, latitude) => ajax('/shops', { longitude, latitude })
// 4、根据经纬度和关键字搜索商铺列表
export const searchShops = (geohash, keyword) => ajax('/search_shops', { geohash, keyword })
// 5、获取一次性验证码
export const getOnceCaptcha = () => ajax("/captcha")
// 6、用户名密码登陆
export const getUser = (name, pwd, captcha) => ajax('/login_pwd', { name, pwd, captcha }, 'POST')
// 7、发送短信验证码
export const getSendcode = (phone) => ajax('/sendcode', { phone })
// 8、手机号验证码登陆
export const getLoginsms = (phone, code) => ajax('/login_sms', { phone, code }, "POST")
// 9、根据会话获取用户信息
export const getUserinfo = () => ajax('/userinfo')
// 10、用户登出
export const UserLogOut = () => ajax("/logout")