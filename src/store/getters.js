//基于state的getter计算属性对象
export default {
    totalShopCart(state) {
        //此处使用数组的reduce函数做统计，默认当前值为0，便利shopcart中的food,将food.count与初始值相加，然后统计总数返回
        return state.shopcart.reduce((preValue, food) => preValue + food.count, 0)
    },
    totalShopCartMoney(state) {
        return state.shopcart.reduce((preValue, food) => preValue + food.count * food.price, 0)
    },
    totalNotShopRatings(state) {
        return state.shopratings.reduce((preValue, rating) => preValue + (rating.rateType === 1 ? 1 : 0), 0)
    },
    totalYesShopRatings(state) {
        return state.shopratings.reduce((preValue, rating) => preValue + (rating.rateType === 0 ? 1 : 0), 0)
    }
}