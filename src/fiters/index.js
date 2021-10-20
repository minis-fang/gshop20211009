import Vue from "vue";
import dayjs from "dayjs";

Vue.filter('timeForMat', (value, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(value).format(formatStr)
})