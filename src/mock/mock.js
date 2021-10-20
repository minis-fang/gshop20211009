import Mock from 'mockjs'
import data from './data.json'

// 返回goods数据
Mock.mock('/goods', { code: 0, data: data.goods })
// 返回评论数据
Mock.mock('/ratings', { code: 0, data: data.ratings })
// 返回商家数据
Mock.mock('/info', { code: 0, data: data.info })

//本文件主要是是利用mock技术实现前端拦截ajax请求，实现模拟请求数据
//本模板不需要使用export default向外暴露，只需要在main.js中引入执行即可