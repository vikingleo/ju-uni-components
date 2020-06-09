<template>
	<view class="img-upload">
		<!-- <view class="img-upload-sheet" v-if="sheetActive" :class="{'ready-hide':readyHideSheet}">
			<view class="img-upload-sheet-mask" @click="hideSheet"></view>
			<view class="img-upload-sheet-control">
				<view class="item">
					<button class="control-btn-item control-btn-item-preview" @click="onPreview">
						<view class="control-btn-item-icon"><i class="vis-icon icon-eye"></i></view>
						<view class="control-btn-item-text">预览</view>
					</button>
				</view>
				<view class="item">
					<button class="control-btn-item control-btn-item-remove" @click="onRemove">
						<view class="control-btn-item-icon"><i class="vis-icon icon-trash"></i></view>
						<view class="control-btn-item-text">删除</view>
					</button>
				</view>
				<view class="item" v-if="type==='select'">
					<button class="control-btn-item control-btn-item-select" @click="onSelect">
						<view class="control-btn-item-icon">
							<i class="vis-icon icon-check" v-if="findInSelected()"></i>
						</view>
						<view class="control-btn-item-text" v-text="findInSelected()?'已选择':'选择'"></view>
					</button>
				</view>
			</view>
		</view> -->
		<view class="img-upload-content" :style="{margin:count>1?gutter/2*-1+'px':0}">
			<view class="img-upload-container img-preview-item" :key="index" v-for="(item,index) in instanceUrls" :style="{ width:instanceWidth, height:instanceHeight,padding:gutter/2+'px'}">
				<view class="img-upload-body" :style="{backgroundColor}" :class="{square:rowCount>0}">
					<!--删除-->
					<view class="btn-type-default-remove" v-if="type!=='readonly'" @click="onRemove(item,index)"><i class="vis-icon icon-close"></i></view>
					<!-- 选择 -->
					<view class="btn-type-default-select" :class="{'selected':findInSelected(item,index)}" v-if="type==='select'&&selectCount>0" @click="onSelect(item,index)">
						<i class="vis-icon icon-check" v-if="findInSelected(item,index)"></i>
					</view>
					<!--图片框-->
					<view class="img-upload-body-content" :class="{'no-border':border==='none'}" style="border-style:solid;">
						<image :src="item" :mode="mode" class="img-upload-img" @click="onPreview(item,index)"></image>
					</view>
				</view>
			</view>
			<view class="img-upload-container" v-if="instanceUrls.length<count" :style="{  width:instanceWidth, height:instanceHeight ,padding:count>1?gutter/2+'px':0 }">
				<button class="img-upload-btn img-upload-body" :class="{square:rowCount>0}" :style="{backgroundColor}" @click="onChoose">
					<view class="img-upload-body-content" :class="{'no-border':border==='none'}" :style="{color,borderStyle:border}">
						<template v-if="$slots.default&&$slots.default.length">
							<slot></slot>
						</template>
						<template v-else>
							<view>
								<i v-if="icon" :class="icon" class="btn-icon"></i>
								<i v-else class="vis-icon icon-plus btn-icon"></i>
							</view>
							<view class="btn-text" v-text="text"></view>
						</template>
					</view>
				</button>
			</view>
		</view>
	</view>
</template>
<script>
	import ImageOperation from "./image-operation";

	export default {
		components: {},
		props: {
			// 是否提供选择图片,select,null|defualt,readonly
			type: {
				type: String,
				default: ""
			},
			// @TODO 可选数量
			selectCount: {
				type: Number | String,
				default: 0
			},
			//图片路径，单张时，可传字符串或数组，多张请用数组
			src: {
				type: String | Array,
				default: ""
			},
			//单行个数，如果不设置或<=0，设置width、height
			rowCount: {
				type: String | Number,
				default: 0
			},
			// 单项相距，只接受不带参数的数字/字符串型数字
			gutter: {
				type: String | Number,
				default: 10
			},
			// 单项宽度
			width: {
				type: String,
				default: "200rpx"
			},
			//单项高度
			height: {
				type: String,
				default: "200rpx"
			},
			// 自定义添加按钮的icon，填写完整icon，例如 icon="app-icon icon-home"
			icon: {
				type: String,
				default: ""
			},
			// 添加按钮的文本，默认只有图标
			text: {
				type: String,
				default: ""
			},
			//边框样式
			border: {
				type: String | Boolean,
				default: "solid"
			},
			// 添加按钮的背景色，只有
			backgroundColor: {
				type: String,
				default: "#fff"
			},
			// 图片的模式，上传的图片所用的模式，具体查看image文档
			mode: {
				type: String,
				default: "scaleToFill"
			},
			//额外参数，每个操作回调都会返回，例如form中，指明field是哪个：:param="{field:'idCard'}"}
			param: {
				type: Object,
				default: null
			},
			//选择图片总数,所选图片到达数量，隐藏添加按钮
			count: {
				type: Number | String,
				default: 1,
				validator: function(value) {
					return +value > 0;
				}
			},
			//单次选择数量
			chooseCount: {
				type: Number | String,
				default: 1,
				validator: function(value) {
					return +value >= 1 && +value <= 9;
				}
			},
			// 字体颜色
			color: {
				type: String,
				default: "#ccc"
			},
			//上传到服务器
			upload: {
				type: Boolean,
				default: false
			},
			//服务器接收地址
			uploadUrl: {
				type: String,
				default: ""
			},
			uploadUrlWxsdk: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				instanceUrls: [],
				sheetActive: false,
				currentSelectedSrc: {},
				readyHideSheet: false,
				selectedList: [],
				tempFilePaths: [], //标记选择图片后对应的id，wx-js-sdk是localIds
				tempServerId: [], //标记已经经过内置接口上传获取的serverId/mediaId
				uploadedUrls: [], //标记上传后返回的url集合，每次上传成功后清空
				uploadFileName: "file", //uni.uploadFile的name，props.param.uploadField设置后可覆盖该值
				filesDataByLocalId: [] //通过localId获取的文件信息
			};
		},
		mounted() {
			if (this.src) {
				if (typeof this.src === "string") {
					this.instanceUrls = JSON.parse(JSON.stringify([this.src]));
				} else if (Array.isArray(this.src)) {
					this.instanceUrls = this.src;
				}
			}
		},
		computed: {
			instanceWidth: function() {
				return this.rowCount ? `${100 / this.rowCount}%` : this.width;
			},
			instanceHeight: function() {
				return this.rowCount ? "auto" : this.height;
			},
			isWechatBrowser: function() {
				//#ifdef H5
				return (
					window.navigator.userAgent
						.toLowerCase()
						.match(/MicroMessenger/i) == "micromessenger"
				);
				//    #endif
				//    #ifndef H5
				return false;
				//    #endif
			}
		},
		watch: {
			src: function(newData, oldData) {
				console.log(newData);
				this.instanceUrls =
					typeof newData === "string" && newData
						? JSON.parse(JSON.stringify([newData]))
						: newData;
			}
		},
		onShow() {},
		methods: {
			stringifyDataset(item) {
				return JSON.stringify(item);
			},
			/**
			 * 返回是否在已选择列表
			 * */
			findInSelected(src, index) {
				const that = this;
				let find_index = that.selectedList.findIndex(
					o => o.index === index
				);
				return find_index > -1;
			},
			/**
			 * 选择图片
			 * */
			async onChoose() {
				const that = this;
				try {
					const IO = new ImageOperation();
					let res = await IO.onChooseImage({
						count:
							+that.chooseCount > 9
								? 9
								: +that.chooseCount < 1
								? 1
								: +that.chooseCount
					});
					console.log(res);
					if (res.status) {
						that.tempFilePaths = JSON.parse(JSON.stringify(res.data));
						that.uploadedServerId = that.uploadedUrls = [];
						// #ifdef H5
						if (res.type === "default") {
							that.$emit("choose", {
								files: that.tempFilePaths,
								urls: that.instanceUrls,
								param: that.param
							});
							that.chooseAfterNotSDK(res.data[0]);
						} else {
							that.chooseAfterWxJSSDK(res.data[0]);
						}
						// #endif
						// #ifndef H5
						that.$emit("choose", {
							files: that.tempFilePaths,
							urls: that.instanceUrls,
							param: that.param
						});
						that.chooseAfterNotSDK(res.data[0]);

						// #endif
					}
				} catch (e) {
					throw new Error(e);
				}
			},
			/**
			 * H5端，使用wx js-sdk时，选择图片后的处理
			 * */
			async chooseAfterWxJSSDK(localId) {
				const that = this;
				if (!localId) {
					return;
				}
				try {
					if (that.isWechatBrowser && that.$wx) {
						let filesDataByLocalId = JSON.parse(
							JSON.stringify(that.filesDataByLocalId)
						);

						that.$wx.getLocalImgData({
							localId,
							success(res) {
								console.log(res);
								filesDataByLocalId.push(res.localData);
								that.filesDataByLocalId = JSON.parse(
									JSON.stringify(filesDataByLocalId)
								);
							}
						});
						let server_ids = JSON.parse(
							JSON.stringify(that.uploadedServerId)
						);
						const IO = new ImageOperation();
						let res = await IO.uploadForWXSDK({ localId });
						if (res.status === 1) {
							server_ids.push(res.data);
							that.uploadedServerId = JSON.parse(
								JSON.stringify(server_ids)
							);
							if (
								that.uploadedServerId.length ===
								that.tempFilePaths.length
							) {
								that.$emit("choose", {
									files: server_ids,
									param: that.param,
									urls: that.instanceUrls,
									localFile: that.filesDataByLocalId
								});
								//如果要自动上传
								if (that.upload) {
									await that.uploadImageForWXJSSDK(
										that.uploadedServerId[0]
									);
								}
							} else {
								//递归回传最新的tempFilePath
								await that.chooseAfterWxJSSDK(
									that.tempFilePaths[that.uploadedServerId.length]
								);
							}
						}
					}
				} catch (e) {
					throw new Error(JSON.stringify(e));
				}
			},
			/**
			 * 微信小程序端和APP，选择图片后端处理
			 * */
			chooseAfterNotSDK(localFile) {
				const that = this;
				if (!localFile) {
					return;
				}
				if (that.upload) {
					that.uploadImageForDefault(localFile);
				}
			},

			/**
			 * H5，使用js-sdk时，递归上传图片到服务器
			 * */
			async uploadImageForWXJSSDK(serverId) {
				const that = this;
				console.debug("微信js-sdk上传", serverId);
				if (!serverId || !that.isWechatBrowser || !that.$wx) {
					return false;
				}
				try {
					//@FIXME 此处已定义默认的上传serverId的接口，需要时修改
					let res = await that
						.$http(that.uploadUrlWxsdk || that.$api.tool.file_upload)
						.post({ mediaId: serverId });
					if (res.code === 0) {
						let pic = JSON.parse(JSON.stringify(that.uploadedUrls));
						console.log(pic);
						pic.push(res.data.url);
						that.uploadedUrls = JSON.parse(JSON.stringify(pic));
						if (
							that.uploadedUrls.length !== that.tempFilePaths.length
						) {
							await that.uploadImageForWXJSSDK(
								that.uploadedServerId[that.uploadedUrls.length]
							);
						} else {
							that.instanceUrls = JSON.parse(
								JSON.stringify(
									that.instanceUrls.concat(that.uploadedUrls)
								)
							);
							that.$emit("upload", {
								param: that.param,
								current_upload: that.uploadedUrls,
								urls: that.instanceUrls
							});
						}
					}
				} catch (e) {
					throw new Error(JSON.stringify(e));
				}
			},
			/**
			 * 非wx-js-sdk上传文件
			 * */
			async uploadImageForDefault(localFile) {
				const that = this;
				console.log("普通图片上传上传", localFile);
				if (!localFile) {
					return;
				}
				try {
					const IO = new ImageOperation();
					let formData =
						that.param && that.param.formData
							? that.param.formData
							: {};
					//@FIXME 此处为自定义的登录态标识
					formData.access_token = uni.getStorageSync("access_token");
					let res = await IO.uploadForUni({
						url: that.uploadUrl,
						filePath: localFile,
						name:
							that.param && that.param.uploadField
								? that.param.uploadField
								: that.uploadFileName,
						formData
					});
					console.error(res);
					if (res.code === 0) {
						let pic = JSON.parse(JSON.stringify(that.uploadedUrls));
						pic.push(res.data.url);
						that.uploadedUrls = JSON.parse(JSON.stringify(pic));
						if (
							that.uploadedUrls.length !== that.tempFilePaths.length
						) {
							await that.uploadImageForDefault(
								that.tempFilePaths[that.uploadedUrls.length]
							);
						} else {
							let instanceUrls = !that.instanceUrls
								? []
								: JSON.parse(JSON.stringify(that.instanceUrls));
							instanceUrls = instanceUrls.concat(
								JSON.parse(JSON.stringify(that.uploadedUrls))
							);
							that.instanceUrls = JSON.parse(
								JSON.stringify(instanceUrls)
							);
							that.$emit("upload", {
								param: that.param,
								current_upload: that.uploadedUrls,
								urls: that.instanceUrls
							});
						}
					}
				} catch (e) {
					throw new Error(JSON.stringify(e));
				}
			},
			//  切换弹出操作面板
			onControl(src, index) {
				if (src) {
					this.currentSelectedSrc = JSON.parse(
						JSON.stringify({ src, index })
					);
				}
				if (this.type === "select") {
					this.sheetActive = true;
					// 类型为选择时，提供control事件，比如因input层级过高导致遮盖了弹出层，可以通过此事件隐藏input
					this.$emit("control", {
						current: src,
						index,
						param: this.param,
						urls: this.instanceUrls
					});
				} else {
					console.log(this.type);
					this.onPreview();
				}
			},
			/**
			 * 开始预览
			 */
			onPreview(src, index) {
				const that = this;

				if (!src || (index !== 0 && !index)) {
					return;
				}
				that.currentSelectedSrc = { src, index };
				uni.previewImage({
					urls: that.instanceUrls,
					current: that.currentSelectedSrc.src,
					success(res) {
						that.$emit("preview", {
							current: that.currentSelectedSrc.src,
							index: that.currentSelectedSrc.index,
							urls: that.instanceUrls,
							param: that.param
						});
					}
				});
			},
			/**
			 * 删除，目前只支持删除后上传
			 */
			async onRemove(src, index) {
				const that = this;
				try {
					if (!src || (index !== 0 && !index)) {
						return;
					}
					that.currentSelectedSrc = { src, index };
					let modal = await uni.showModal({
						title: `您正在删除列表第${that.currentSelectedSrc.index +
							1}张`,
						content: "是否确认删除？"
					});
					console.log(modal);
					if (modal[1].confirm) {
						let urls = JSON.parse(JSON.stringify(that.instanceUrls));
						let find_validate =
							urls[that.currentSelectedSrc.index] ===
							that.currentSelectedSrc.src;
						if (find_validate) {
							urls.splice(that.currentSelectedSrc.index, 1);
						}
						console.log(urls);
						that.instanceUrls = JSON.parse(JSON.stringify(urls));

						//查找是否在已选择列表 begin
						let selected_list = JSON.parse(
							JSON.stringify(that.selectedList)
						);
						let find_selected_list = selected_list.findIndex(
							o =>
								o.index === that.currentSelectedSrc.index &&
								o.src === that.currentSelectedSrc.src
						);
						if (find_selected_list > -1) {
							selected_list.splice(find_selected_list, 1);
							that.selectedList = JSON.parse(
								JSON.stringify(selected_list)
							);
						}
						// 查找是否在已选择列表 end
						that.readyHideSheet = true;
						setTimeout(() => {
							that.readyHideSheet = false;
							that.sheetActive = false;
						}, 500);
						that.$emit("remove", {
							current: that.currentSelectedSrc.src,
							index: that.currentSelectedSrc.index,
							urls: that.instanceUrls,
							param: this.param
						});
					}
				} catch (e) {
					throw new Error(JSON.stringify(e));
				}
			},
			/**
			 * 隐藏操作面板的过渡动画
			 */
			hideSheet() {
				this.readyHideSheet = true;
				setTimeout(() => {
					this.readyHideSheet = false;
					this.sheetActive = false;
				}, 500);
				//返回之前选择的图片信息
				this.$emit("cancel-control", {
					current: this.currentSelectedSrc.src,
					param: this.param,
					index: this.currentSelectedSrc.index,
					urls: this.instanceUrls
				});
				this.currentSelectedSrc = JSON.parse(JSON.stringify({}));
			},
			/**
			 * 选择图片，暂时废弃
			 */
			onSelect(src, index) {
				if (!src || (index !== 0 && !index)) {
					return;
				}
				if (!this.selectCount) {
					uni.showToast({
						title: "未设置可选数量",
						icon: "none"
					});
				}
				this.currentSelectedSrc = {
					src,
					index
				};
				let list = JSON.parse(JSON.stringify(this.selectedList));
				if (+this.selectCount === 1) {
					list = [];
					list.push(this.currentSelectedSrc);
				}

				let find_index = list.findIndex(
					o =>
						o.index === this.currentSelectedSrc.index &&
						o.src === this.currentSelectedSrc.src
				);
				// 如果未满，查看是否在数组内，如果在，删除，
				if (find_index > -1) {
					list.splice(find_index, 1);
				} else {
					if (list.length < +this.selectCount) {
						list.push(this.currentSelectedSrc);
					} else {
						uni.showToast({
							title: `可选数量为${this.selectCount}张`,
							icon: "none"
						});
					}
				}
				this.selectedList = JSON.parse(JSON.stringify(list));
				console.log(this.selectedList);

				this.$emit("select", {
					current: this.currentSelectedSrc.src,
					index: this.currentSelectedSrc.index,
					param: this.param,
					urls: this.instanceUrls,
					selected: this.selectedList
				});
			}
		}
	};
</script>
<style lang="scss">

$grey: #eee;
$grey100: #f2f2f2;
$primary: #017be7;
@function units($val) {
	@return $val * 2rpx;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 0.5;
	}
}

@keyframes fadeOut {
	from {
		opacity: 0.5;
	}

	to {
		opacity: 0;
	}
}

@keyframes translateY {
	from {
		transform: translateY(50vh);
	}
	to {
		transform: translateY(0);
	}
}

@keyframes translateYReverse {
	from {
		transform: translateY(0);
	}
	to {
		transform: translateY(50vh);
	}
}

view,
button,
image,
img {
	box-sizing: border-box;
	line-height: 1;
}

.img-upload {
	// overflow: hidden;

	&-mask {
		background-color: rgba($color: #000, $alpha: 0.5);
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 1;
		top: 0;
		left: 0;
		display: none;
	}

	&-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: stretch;
		flex-wrap: wrap;
	}

	&-container {
		position: relative;
	}

	&-body {
		width: 100%;
		height: 100%;

		&.square {
			height: 0;
			padding-bottom: 100%;
		}

		position: relative;

		&:active {
			background-color: lighten($grey100, 3%) !important;
		}

		.img-upload-image {
			width: 100%;
			height: 100%;
		}

		&-content {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border: 1px solid darken($grey, 10%);
			overflow: hidden;
			&.no-border {
				border: 0 !important;
			}
		}
	}

	&-check {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(#000, 0.5);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: units(40);
	}

	&-img {
		width: 100%;
		height: 100%;
	}

	&-btn {
		border-radius: 0;
		border: 0;

		&::after {
			display: none;
			border-radius: 0;
			border-color: darken($grey, 10%);
		}

		.btn-icon {
			margin-bottom: units(5);
			font-size: units(40);
		}

		.btn-text {
			font-size: units(12);
		}
	}
}

.img-upload-sheet {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;

	&-control {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		padding: units(15);
		background-color: #ffffff;
		animation: translateY 0.5s ease 0ms 1 normal forwards;
		transform: translateY(50vh);

		> .item {
			+ .item {
				margin-top: units(10);
			}
		}

		.control-btn-item {
			background-color: $grey100;
			font-size: units(14);
			display: flex;
			align-items: center;
			padding: units(15) units(10);
			color: #fff;

			&:active {
				opacity: 0.9;
			}

			&::after {
				display: none;
			}

			&-icon,
			&-text {
				flex: 1;
			}

			&-icon {
				text-align: right;
			}

			&-text {
				text-align: left;
			}

			&-remove {
				background-color: #dd524d;
			}

			&-preview {
				background-color: #00a95e;
			}

			&-select {
				background-color: dodgerblue;
			}

			.vis-icon {
				margin-right: units(10);
			}
		}
	}

	&-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		background-color: #000000;
		animation: fadeIn 0.5s ease-in 0ms 1 normal forwards;
	}

	&.ready-hide {
		.img-upload-sheet-mask {
			animation: fadeOut 0.5s ease-in 0ms 1 normal forwards;
		}

		.img-upload-sheet-control {
			animation: translateYReverse 0.5s ease 0ms 1 normal forwards;
		}
	}
}

.btn-type-default {
	&-remove,
	&-select {
		position: absolute;
		width: units(25);
		height: units(25);
	}
	&-remove {
		right: units(-7);
		border: 2px solid #fff;
		top: units(-7);
		display: flex;
		z-index: 9;
		font-size: units(10);
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		background-color: #ff0000;
		color: #fff;
		box-shadow: -1px 1px 2px rgba($color: #000000, $alpha: 0.2);
	}
	&-select {
		bottom: units(5);
		right: units(5);
		font-size: units(14);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		z-index: 8;
		box-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.6);
		border: 2px solid #ddd;
		border-radius: units(3);
		background-color: rgba(#ddd, 0.7);
		&.selected {
			background-color: $primary;
			border-color: #fff;
		}
	}
}
</style>
