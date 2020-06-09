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
            option = Object.assign(defaultOption, option)
            let platform = uni
            // #ifdef H5
            // @TODO 此处自行引入微信js-sdk
            platform = isWechatBrowser() && vue.$wx ? vue.$wx : uni
            // #endif
            // #ifndef H5
            platform = uni
            // #endif
            platform.chooseImage({
                count: option.count,
                sizeType: option.sizeType,
                sourceType: option.sourceType,
                success: function (res) {
                    let res_data = null
                    let type = null
                    // #ifdef H5
                    if (isWechatBrowser() && vue.$wx) {
                        res_data = res.localIds
                        type = 'wx'
                    } else {
                        res_data = res.tempFilePaths
                        type = 'default'
                    }
                    // #endif
                    // #ifndef H5
                    res_data = res.tempFilePaths
                    type = 'default'
                    // #endif
                    resolve({status: 1, msg: '选择图片成功', data: res_data, type})
                },
                fail(e) {
                    reject(e.errMsg)
                }
            })
        })
    }

    /**
     * 上传base64图像数据
     * @param base64
     * @returns {Promise<unknown>}
     */
    base64Upload(base64) {
        return new Promise(async (resolve, reject) => {

            if (!base64) {
                reject('have not base64 image data')
                return
            }
            try {
                let res = await vue.$http(vue.$api.tool.upload_by_base64).post({img: base64})
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 使用uni内置接口上传图片
     * @param option
     * @returns {Promise<unknown>}
     */
    uploadForUni(option = {}) {
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
            console.log(option)
            uni.uploadFile({
                url: option.url,
                filePath: option.filePath,
                name: option.name || 'file',
                fileType: 'image',
                formData: option.formData,
                success(response) {
                    console.log(response)
                    let res = JSON.parse(response.data)
                    res.code = +res.code
                    if (res.code === 1) {
                        uni.showModal({
                            title: '提示',
                            content: res.msg
                        })
                    } else if (res.code === -1) {
                        uni.showModal({
                            title: '未登录',
                            content: res.msg,
                            success(cn) {
                                if (cn.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login'
                                    })
                                }
                            }
                        })
                    }
                    resolve(res)
                },
                fail(err) {
                    reject(err)
                    throw new Error(JSON.stringify(err))
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
