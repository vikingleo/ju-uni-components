import Vue from 'vue'

const vue = Vue.prototype
const isWechatBrowser = () => {
    //#ifdef H5
    return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
    //    #endif
    //    #ifndef H5
    return false
    //    #endif
}

class ImageOperation {

    /**
     * 返回当前浏览器是否微信浏览器
     * @returns {boolean}
     */
    isWechatBrowser() {
        return isWechatBrowser()
    }

    /**
     * 选择图片
     * @returns {Promise<unknown>}
     */
    onChooseImage(option = {}) {
        return new Promise((resolve, reject) => {
            let defaultOption = {
                count: 1,
                sizeType: [ 'original', 'compressed' ],
                sourceType: [ 'album', 'camera' ]
            }
            defaultOption = Object.assign(defaultOption, option)
            let platform = uni
            // #ifdef H5
            // @TODO 此处自行引入微信js-sdk
            platform = isWechatBrowser() && vue.$wx ? vue.$wx : uni
            // #endif
            // #ifndef H5
            platform = uni
            // #endif
            platform.chooseImage({
                count: defaultOption.count,
                sizeType: defaultOption.sizeType,
                sourceType: defaultOption.sourceType,
                success: function (res) {
                    let res_data = null
                    let type = null
                    // #ifdef H5
                    if (isWechatBrowser() && vue.$wx) {
                        res_data = res.localIds
                        type = 'wx'
                    } else {
                        res_data = {paths: res.tempFilePaths, files: res.tempFiles}
                        type = 'default'
                    }
                    // #endif
                    // #ifndef H5
                    res_data = {paths: res.tempFilePaths, files: res.tempFiles}
                    type = 'default'
                    // #endif
                    resolve({status: 1, msg: '选择图片成功', data: res_data, type})
                },
                fail(e) {
                    resolve({status: 0, msg: e.errMsg})
                }
            })
        })
    }

    /**
     * 使用uni内置接口上传图片
     * @param option
     * @returns {Promise<unknown>}
     */
    uploadForUni(option = {}) {
        const that = this
        return new Promise((resolve, reject) => {
            if (!option.filePath) {
                reject({code: 1, msg: '没有传入"filePath"'})
                return
            }
            if (!option.url) {

                reject({code: 1, msg: '没有上传URL'})
                return
            }
            option.formData = Object.assign({access_token: uni.getStorageSync('access_token')}, option.formData)
            uni.uploadFile({
                ...option,
                success(response) {
                    let res = null
                    if (response.statusCode !== 200) {
                        uni.showModal({
                            title: '上传' + response.statusCode.toString(),
                            content: '网络请求错误',
                            fail(err) {
                                console.error(err)
                            }
                        })
                    } else {
                        res = JSON.parse(response.data)
                        res.code = +res.code
                    }
                    resolve(res)
                },
                fail(err) {
                    uni.showModal({
                        title: '请求错误',
                        content: '网络请求错误'
                    })
                    reject(err)
                    console.error(err)
                }
            })
        })
    }

    /**
     * 微信sdk上传获取mediaId
     * @param option
     * @returns {Promise<unknown>}
     */
    uploadForWXSDK(option = {}) {
        if (!vue.$wx || !option.localId) {
            return
        }
        return new Promise((resolve, reject) => {
            vue.$wx.uploadImage({
                localId: option.localId,
                isShowProgressTips: option.isShowProgressTips || 1,
                success: function (res) {
                    resolve({status: 1, msg: '成功', data: res.serverId})
                },
                fail: function (err) {
                    reject(err)
                    throw new Error(err)
                }
            })
        })
    }

}

export default ImageOperation
