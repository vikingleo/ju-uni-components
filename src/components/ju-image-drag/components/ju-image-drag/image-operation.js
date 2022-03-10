const isWechatBrowser = () => {
	let flag = false
	//#ifdef H5
	flag = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
	//    #endif
	return flag
}
//#ifdef H5
import weixinJsSDK from 'weixin-js-sdk'

//#endif
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
				sizeType: ['compressed'],
				sourceType: ['album', 'camera']
			}
			defaultOption = Object.assign(defaultOption, option)
			let platform = uni
			// #ifdef H5
			// @TODO 此处自行引入微信js-sdk
			platform = isWechatBrowser() && weixinJsSDK ? weixinJsSDK : uni
			// #endif
			// #ifndef H5
			platform = uni
			// #endif
			let res_data = {}
			let type = ''
			platform.chooseImage({
				count: defaultOption.count,
				sizeType: defaultOption.sizeType,
				sourceType: defaultOption.sourceType,
				success: function (res) {
					// #ifdef H5
					if (isWechatBrowser() && weixinJsSDK) {
						res_data.localIds = res.localIds
						type = 'wx-sdk'
					} else {
						res_data = {paths: res.tempFilePaths, files: res.tempFiles}
						type = 'uni'
					}
					// #endif
					// #ifndef H5
					res_data = {paths: res.tempFilePaths, files: res.tempFiles}
					type = 'uni'
					// #endif
					resolve({status: 1, msg: '选择图片成功', data: res_data, type})
				},
				fail(e) {
					console.error(e)
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
		console.log(option);

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
					reject(err)
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
		if (!weixinJsSDK || !option.localId) {
			return
		}
		return new Promise((resolve, reject) => {
			weixinJsSDK.uploadImage({
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
