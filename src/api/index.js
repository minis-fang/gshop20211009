// 包含n个接口的请求函数
// 函数的返回值是promise
import ajax from "./ajax";
const BS_PATH = "/api"
// 1、根据经纬度获取位置详情
export const getPosition = (geohash) => ajax(`${BS_PATH}/position/${geohash}`)
// 2、获取食品分类列表
export const getIndexCategory = () => ajax(BS_PATH + "/index_category")
// 3、根据经纬度获取商铺列表
export const getShops = (longitude, latitude) => ajax(BS_PATH + '/shops', { longitude, latitude })
// 4、根据经纬度和关键字搜索商铺列表
export const searchShops = (geohash, keyword) => ajax(BS_PATH + '/search_shops', { geohash, keyword })
// 5、获取一次性验证码
// export const getOnceCaptcha = () => ajax(BS_PATH + "/captcha")
// 6、用户名密码登陆
export const getPwdLogin = ({ name, pwd, captcha }) => ajax(BS_PATH + '/login_pwd', { name, pwd, captcha }, 'POST')
// 7、发送短信验证码
export const getSendcode = (phone) => ajax(BS_PATH + '/sendcode', { phone })
// 8、手机号验证码登陆
export const getPhoneLogin = (phone, code) => ajax(BS_PATH + '/login_sms', { phone, code }, "POST")
// 9、根据会话获取用户信息
export const getUserinfo = () => ajax(BS_PATH + '/userinfo')
// 10、用户登出
export const UserLogOut = () => ajax(BS_PATH + "/logout")
// 11、请求mock中的shopgoods
export const getShopGoods = () => ajax("/goods")
// 12、请求mock中的shopratings
export const getShopRatings = () => ajax("/ratings")
// 13、请求mock中的shopinfo
export const getShopInfo = () => ajax("/info")