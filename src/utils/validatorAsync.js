

import {
	isChineseCharacter,
	isDecimal,
	isEnglish,
	isIDCard,
	isMPStrict,
	isNumAndStr,
	isNumber
} from './checkUtil'

/**
 * 满足日常表单的比较全面的验证器
 * @param form 表单，object结构，
 * @param obj 验证规则，规则如下：
 * {
 *      // name就是表单字段名
 *     name:{
 *          //这些就是定义好的验证类型
            request:'error msg',
            mobile:'error msg',
            chinese:'error msg',
            id_card:'error msg',
            number:'error msg',
            decimal:'error msg',
            number_english:'error msg',
            english:'error msg',
            max:{length:4,msg:'error msg'},
            min:{length:4,msg:'error msg'},
            maxlength:{length:4,msg:'error msg'},
            minlength:{length:4,msg:'error msg'},
        }
 * }
 * 其中error msg就是自定义的错误提示，否则用自带的
 * @param toast
 * @returns {Promise<unknown>}
 */
export default function (form, obj, toast = true) {
    return new Promise((resolve, reject) => {

        if (!form || !Object.keys(form) || !obj || !Object.keys(obj).length) {
            reject({
                status: 0,
                msg: '没有传入规则对象'
            })
            return
        }
        // 符合验证规则
        let ruleTyle = ['mobile', 'chinese', 'id_card', 'number', 'decimal', 'number_english', 'english', 'max', 'min',
            'maxlength', 'minlength', 'required'
        ]
        let msgList = {
            mobile: '手机号码不正确',
            chinese: '不是纯汉字',
            id_card: '身份证不正确',
            number: '不是纯数字',
            decimal: '不是小数点',
            number_english: '不是数字+英文字母',
            english: '不是纯英文字母',
            max: max => `支持最大为${max}的数字`,
            min: min => `支持最小为${min}的数字`,
            maxlength: len => `最大长度为${len}`,
            minlength: len => `最小长度为${len}`,
            required: name => `${name}为必填`
        }
        let switchKey = ''
        for (let i in obj) {
            for (let j in obj[i]) {
                //没有验证规则，跳过
                if (ruleTyle.indexOf(j) < 0) {
                    return
                } else {
                    let ruleName = j
                    switchKey = i
                    let msg = obj[i][j]
                    let name = i
                    let res = {}
                    switch (ruleName) {
                        case 'mobile':
                            if (!isMPStrict(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            } else {

                            }
                            break
                        case 'chinese':
                            if (!isChineseCharacter(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return

                            }
                            break
                        case 'id_card':
                            if (!isIDCard(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'number':
                            if (!isNumber(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'decimal':
                            if (!isDecimal(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'number_english':
                            if (!isNumAndStr(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'english':
                            if (!isEnglish(form[name])) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'max':
                            if (isNaN(form[name]) || +form[name] > msg.length) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'min':
                            if (isNaN(form[name]) || +form[name] < msg.length) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'maxlength':
                            if (form[name].length > msg.length) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'minlength':
                            if (form[name].length < msg.length) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return
                            }
                            break
                        case 'required':
                            if (!form[name]) {
                                res = notMsg(ruleName, msg)
                            }
                            if (res.status === 0) {
                                toast && uni.showToast({
                                    title: res.msg,
                                    icon: 'none'
                                })
                                resolve(res)
                                return

                            }
                            break
                    }
                    // 最后一个
                    if (Object.keys(obj)[Object.keys(obj).length - 1] === switchKey) {
                        resolve({
                            status: 1,
                            msg: '全部通过'
                        })
                        return
                    }
                }
            }
        }

		/**
		 * 如果没有msg，返回默认
		 * @param ruleName
		 * @param msg
		 * @returns {*}
		 */
        function notMsg(ruleName, msg) {
            return {
                msg: typeof msg === 'object' ? (msg.msg || msgList[ruleName](msg.length)) : msg,
                status: 0
            }
        }
    })

}