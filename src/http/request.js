/**
 * 仅用于Page，app.js不用
 * @param url
 * @param options {Object}
 * @returns {{get(*=): *, post(*=): *, delete(*=): *}}
 */
export default function (url, options = {}) {
    if (options.loading) {
        uni.hideLoading()
    }
    const responseStatusField = 'code'
    //基础配置
    const header = {
        'content-type': 'application/x-www-form-urlencoded'
    }
    options = JSON.parse(JSON.stringify(Object.assign({
        loading: true,
        login: true,
        catch: true
    }, options)))
    let params = {access_token: uni.getStorageSync('access_token')}

    /**
     * 执行请求的本体
     * @param {String} $url 请求URL
     * @param {String} method 'POST','GET','DELETE'
     * @param {Object} data {paramName:paramValue}
     */
    let requestLock = true
    let request = ($url, method, data) => new Promise((resolve, reject) => {
        data = Object.assign(params, data)
        let opt = {
            url: $url,
            header,
            method,
            data,
			sslVerify:false,
            success(res) {
                if (!res.data) {
                    reject(res)
                    throw new Error(res)
                }
                requestLock = false
                res.data[ responseStatusField ] = +res.data[ responseStatusField ]
                console.log(res.data)
                if (res.data[ responseStatusField ] === 0) {
                    resolve(res.data)
                } else if (res.data[ responseStatusField ] === 1) {
                    if (options.catch) {
                        uni.hideKeyboard()
                        uni.showModal({
                            title: '提示',
                            content: res.data.msg
                        })
                    }
                    resolve(res.data)
                } else if (res.data[ responseStatusField ] === -1) {
                    uni.removeStorageSync('userInfo')
                    uni.removeStorageSync('access_token')
                    uni.removeStorageSync('isLogin')
                    resolve(res.data)
                    // 如果遇到code=-1，弹出授权
                    if (options.login) {
                        uni.showModal({
                            title: '未登录，是否前往登录？',
                            icon: 'none',
                            success(r) {
                                if (r.confirm) {
                                    setTimeout(() => {
                                        uni.navigateTo({
                                            url: `/pages/login`
                                        })
                                    }, 1000)
                                }
                            }
                        })
                    }
                }
                uni.stopPullDownRefresh()
                if (options.loading) {
                    uni.hideLoading()
                }
            },
            fail(err) {
				console.error(err)
                requestLock = false
                uni.stopPullDownRefresh()

                if (options.loading) {
                    uni.hideLoading()
                }
                reject(err)
                throw new Error(err.errMsg)
            }
        }

        if (options.loading) {
            uni.showLoading()
        }
        uni.request(opt)

    })

    return {
        get(data) {
            return request(url, 'GET', data)
        },
        post(data) {
            return request(url, 'POST', data)

        },
        delete(data) {
            return request(url, 'DELETE', data)
        }
    }

}
