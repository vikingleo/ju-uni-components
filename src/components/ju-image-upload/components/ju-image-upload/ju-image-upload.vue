<template>
    <view class="img-upload" :style="{margin:count>1?gutter/2*-1+'px':0}">
        <view class="img-upload-content">
            <view class="img-upload-container img-preview-item" :key="item.id" v-for="(item,index) in instanceFiles" :style="{ flex:'0 0 '+instanceWidth, height:instanceHeight,padding:gutter/2+'px'}">
                <view class="img-upload-body" :style="{backgroundColor,}" :class="{square:rowCount>0}">
                    <!--删除-->
                    <view class="btn-type-default-remove" v-if="type!=='readonly'" @click="onRemove(item)"><i class="vis-icon icon-close"></i></view>
                    <!-- 选择 -->
                    <view class="btn-type-default-select" :class="{'selected':findInSelected(item.id)}" v-if="type==='select'&&selectCount>0" @click="onSelect(item,index)">
                        <i class="vis-icon icon-check" v-if="findInSelected(item.id)"></i>
                    </view>
                    <!--图片框-->
                    <view class="img-upload-body-content" :class="{'no-border':border==='none','selected':findInSelected(item.id)}" :style="{borderStyle:border}">
                        <image :src="item.url" :mode="mode" class="img-upload-img" @click="onPreview(item,index)"></image>
                    </view>
                </view>
            </view>
            <view class="img-upload-container" v-if="instanceUrls.length<count" :style="{  flex:'0 0 '+instanceWidth, height:instanceHeight ,padding:count>1?gutter/2+'px':0 }">
                <button class="img-upload-btn img-upload-body" :class="{square:rowCount>0}" :style="{backgroundColor}" @click="onChoose" :disabled="uploading">
                    <view class="img-upload-body-content" :class="{'no-border':border==='none'}" :style="{color,borderStyle:border}">
                        <template v-if="$slots.default&&$slots.default.length">
                            <slot></slot>
                        </template>
                        <template v-else>
                            <view>
                                <template v-if="!uploading">
                                    <i v-if="icon" :class="icon" class="btn-icon"></i>
                                    <i v-else class="vis-icon icon-plus btn-icon"></i>
                                </template>
                                <i v-else class="vis-icon icon-loading-line btn-icon spinner-cycle"></i>
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
    import ImageOperation from "./image-operation"
    // #ifdef H5
    import wx from 'weixin-js-sdk'
    //#endif
    export default {
        components: {},
        props: {
            // 是否提供选择图片,select,null|default,readonly
            type: {type: String, default: ""},
            // @TODO 可选数量
            selectCount: {type: Number | String, default: 0},
            // 已选择的图片的id
            selected: {type: Array, default: () => []},
            //图片路径，单张时，可传字符串或数组，多张请用数组
            src: {type: String | Array, default: ""},
            //单行个数，如果不设置或<=0，设置width、height
            rowCount: {type: String | Number, default: 0},
            // 单项相距，只接受不带参数的数字/字符串型数字
            gutter: {type: String | Number, default: 10},
            // 单项宽度
            width: {type: String, default: "200rpx"},
            //单项高度
            height: {type: String, default: "200rpx"},
            // 自定义添加按钮的icon，填写完整icon，例如 icon="app-icon icon-home"
            icon: {type: String, default: ""},
            // 添加按钮的文本，默认只有图标
            text: {type: String, default: ""},
            //边框样式
            border: {type: String | Boolean, default: "solid"},
            // 添加按钮的背景色，只有
            backgroundColor: {type: String, default: "#fff"},
            // 图片的模式，上传的图片所用的模式，具体查看image文档
            mode: {type: String, default: "aspectFill"},
            //额外参数，每个操作回调都会返回，例如form中，指明field是哪个：:param="{field:'idCard'}"}
            param: {type: Object, default: null},
            //选择图片总数,所选图片到达数量，隐藏添加按钮
            count: {type: Number | String, default: 1, validator: function (value) { return +value > 0 }},
            //单次选择数量
            chooseCount: {type: Number | String, default: 1, validator: function (value) { return +value >= 1 && +value <= 9 }},
            // 字体颜色
            color: {type: String, default: "#ccc"},
            //上传到服务器，考虑到url分为uni和微信js-sdk，使用这个判定是否开启
            upload: {type: Boolean, default: false},
            // 图片上传的地址，uni-app上传方式
            uploadUrl: {type: String, default: ""},
            // 图片上传的地址，js-sdk上传方式，js-sdk需要用到mediaId上传，和uni不同
            uploadWxSdkUrl: {type: String, default: ""}
        },
        data() {
            //@TODO 需要改成自己的路径，如不设置，则需要在调用组件的地方，设置属性upload-uni-url或upload-wx-sdk-url，否则无法使用自动上传
            const selectedList = this.selected
            return {
                instanceFiles: [],   //当前上传后图片对象列表
                instanceUrls: [],   //当前上传后图片url列表
                sheetActive: false,
                currentSelectedSrc: {},
                readyHideSheet: false,
                selectedList,   // 已被选中的图片，保存的是id
                tempFilePaths: [], //标记选择图片后对应的id，wx-js-sdk是localIds
                tempServerId: [], //标记已经经过内置接口上传获取的serverId/mediaId
                uploadedUrls: [], //标记上传后返回的url集合，每次上传成功后清空
                uploadFileName: "file", //uni.uploadFile的name，props.param.uploadField设置后可覆盖该值
                filesDataByLocalId: [], //通过localId获取的文件信息
                uploading: false    // 是否正在上传
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            instanceWidth: function () {
                return this.rowCount ? `${100 / this.rowCount}%` : this.width
            },
            instanceHeight: function () {
                return this.rowCount ? "auto" : this.height
            },
            // 根据instanceFiles列表生成的图片URL列表
            picUrls: function () {
                return this.instanceFiles.map(o => o.url)
            }

        },
        watch: {
            src: function (newData, oldData) {
                this.instanceUrls = newData
            }
        },
        methods: {
            /**
             * 生成不和列表重复的id
             * */
            randomId() {
                let random_id = Math.floor(Math.random() * 100000)
                let find_in_list = this.instanceFiles.findIndex(o => +o.id === random_id)
                if (find_in_list > -1) {
                    this.randomId()
                } else {
                    return random_id
                }
            },
            init() {
                const that = this
                if (typeof this.src === "string" || this.src.constructor !== Array) {
                    console.warn('参数 "src" 应该是一个数组，结构为：{id:xxx,url:"xxx"}，其中id为Number且唯一，当前初始src将不显示且不被包含在图片列表')
                    return
                }
                that.instanceFiles = this.src.map(i => {
                    if (typeof i === 'string' || (i.id && typeof i.id !== 'number')) {
                        let random_id = that.randomId()
                        return {
                            id: random_id,
                            url: i
                        }
                    }
                })
            },
            /**
             * 返回是否在已选择列表
             * */
            findInSelected(id) {
                return this.selectedList.findIndex(o => +o === +id) > -1
            },
            /**
             * 选择图片
             * */
            async onChoose() {
                const that = this
                try {
                    that.tempFilePaths = that.uploadedUrls = that.uploadedServerId = []
                    const IO = new ImageOperation()
                    let res = await IO.onChooseImage({
                        count: +that.chooseCount > 9 ? 9 : +that.chooseCount < 1 ? 1 : +that.chooseCount
                    })

                    if (res.status) {
                        that.tempFilePaths = JSON.parse(JSON.stringify(res.data.paths))
                        that.uploadedServerId = []
                        // #ifdef H5
                        if (res.type === "default") {
                            that.$emit("choose", {
                                type: 'choose',
                                ...res.data,
                                urls: that.picUrls,
                                files: that.instanceFiles,
                                param: that.param
                            })
                            if (that.upload) {
                                that.uploading = true
                                that.uploadImageForDefault(that.tempFilePaths[ 0 ])
                            }
                        } else {
                            that.chooseAfterWxJSSDK(that.tempFilePaths[ 0 ])
                        }
                        // #endif
                        // #ifndef H5
                        that.$emit("choose", {
                            type: 'choose',
                            ...res.data,
                            urls: that.picUrls,
                            files: that.instanceFiles,
                            param: that.param
                        })
                        //如果开启上传
                        if (that.upload) {
                            that.uploading = true
                            that.uploadImageForDefault(that.tempFilePaths[ 0 ])
                        }

                        // #endif
                    }
                } catch (e) {
                    throw new Error(e)
                }
            },
            /**
             * H5端，使用wx js-sdk时，选择图片后的处理
             * */
            async chooseAfterWxJSSDK(localId) {
                const that = this
                if (!localId) {
                    return
                }
                try {
                    const IO = new ImageOperation()

                    if (IO.isWechatBrowser() && wx) {
                        let filesDataByLocalId = JSON.parse(
                            JSON.stringify(that.filesDataByLocalId)
                        )
                        wx.getLocalImgData({
                            localId,
                            success(res) {

                                filesDataByLocalId.push(res.localData)
                                that.filesDataByLocalId = JSON.parse(
                                    JSON.stringify(filesDataByLocalId)
                                )
                            }
                        })
                        let server_ids = JSON.parse(
                            JSON.stringify(that.uploadedServerId)
                        )
                        let res = await IO.uploadForWXSDK({localId})
                        if (res.status === 1) {
                            server_ids.push(res.data)
                            that.uploadedServerId = JSON.parse(
                                JSON.stringify(server_ids)
                            )
                            if (
                                that.uploadedServerId.length ===
                                that.tempFilePaths.length
                            ) {
                                that.$emit("choose", {
                                    type: 'choose',
                                    serverIds: server_ids,
                                    files: that.instanceFiles,
                                    param: that.param,
                                    urls: that.picUrls,
                                    localFile: that.filesDataByLocalId
                                })
                                //如果要自动上传
                                if (that.upload) {
                                    that.uploading = true
                                    await that.uploadImageForWXJSSDK(
                                        that.uploadedServerId[ 0 ]
                                    )
                                }
                            } else {
                                //递归回传最新的tempFilePath
                                await that.chooseAfterWxJSSDK(
                                    that.tempFilePaths[ that.uploadedServerId.length ]
                                )
                            }
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            /**
             * H5，使用js-sdk时，递归上传图片到服务器
             * */
            async uploadImageForWXJSSDK(serverId) {
                const that = this
                console.debug("微信js-sdk上传", serverId)
                const IO = new ImageOperation()
                if (!serverId || !IO.isWechatBrowser() || !wx) {
                    return false
                }
                try {
                    //@FIXME 此处已定义默认的上传serverId的接口，需要时修改
                    let res = await that.$http(that.uploadWxSdkUrl).post({mediaId: serverId})
                    //@FIXME 此处视自己的API差异而定
                    if (res.code === 0) {
                        let pic = JSON.parse(JSON.stringify(that.uploadedUrls))

                        //@FIXME 此处视自己的API差异而定
                        pic.push(res.data.url)
                        that.uploadedUrls = JSON.parse(JSON.stringify(pic))
                        if (that.uploadedUrls.length !== that.tempFilePaths.length) {
                            await that.uploadImageForWXJSSDK(that.uploadedServerId[ that.uploadedUrls.length ])
                        } else {
                            that.instanceUrls = JSON.parse(JSON.stringify(that.instanceUrls.concat(that.uploadedUrls)))
                            that.$emit("upload", {
                                type: 'upload',
                                param: that.param,
                                current_upload: that.uploadedUrls,
                                urls: that.picUrls,
                                files: that.instanceFiles

                            })
                            that.uploading = false

                        }
                    }
                } catch (e) {
                    that.uploading = false
                    console.error(e)
                }
            },
            /**
             * 非wx-js-sdk上传文件
             * */
            async uploadImageForDefault(localFile) {
                const that = this
                if (!localFile) {
                    return
                }
                try {
                    const IO = new ImageOperation()
                    let formData = that.param && that.param.formData ? that.param.formData : {}
                    //@FIXME 此处为自定义的登录态标识
                    formData.access_token = uni.getStorageSync("access_token")
                    let res = await IO.uploadForUni({
                        url: that.uploadUrl,
                        filePath: localFile,
                        name: that.param && that.param.uploadField ? that.param.uploadField : that.uploadFileName,
                        formData
                    })
                    //@FIXME res.code状态视自己的API差异而定
                    that.uploading = false
                    if (res.code === 0) {
                        that.uploadAfter(res.data)
                    } else if (res.code === 1) {
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
                } catch (e) {
                    that.uploading = false
                    console.error(e)
                }
            },
            /**
             * 上传后处理，给图片添加id
             * */
            uploadAfter(data) {
                const that = this
                let random_id = Math.floor(Math.random() * 100000)
                //如果存在，重新生成
                if (that.instanceFiles.findIndex(o => o.id === random_id) > 0) {
                    that.uploadAfter(data)
                    return
                }
                let current_item = {
                    id: random_id,
                    ...data
                }
                that.instanceFiles.push(current_item)
                that.uploadedUrls.push(data.url)
                //@FIXME 此处视自己的API差异而定
                console.log('uploadAfter', that.tempFilePaths, that.uploadedUrls.length)
                if (that.uploadedUrls.length !== that.tempFilePaths.length) {
                    that.uploadImageForDefault(that.tempFilePaths[ that.uploadedUrls.length ])
                } else {
                    that.$emit("upload", {
                        type: 'upload',
                        param: that.param,
                        current_upload: that.uploadedUrls,
                        urls: that.picUrls,
                        files: that.instanceFiles
                    })
                    that.uploading = false
                }
            },
            /**
             * 预览
             */
            onPreview(item, index) {
                const that = this

                if (!item) {
                    return
                }

                uni.previewImage({
                    urls: that.picUrls,
                    current: index,
                    success(res) {
                        that.$emit("preview", {
                            type: 'preview',
                            current: item,
                            index,
                            urls: that.picUrls,
                            files: that.instanceFiles,
                            param: that.param
                        })
                    }
                })
            },
            /**
             * 删除，目前只支持删除后上传
             */
            async onRemove(item) {
                const that = this
                try {
                    if (!item) {
                        return
                    }
                    let find_current = that.instanceFiles.findIndex(o => o.id === item.id)

                    let modal = await uni.showModal({
                        title: `您正在删除列表第${find_current + 1}张`,
                        content: "是否确认删除？"
                    })
                    if (modal[ 1 ].cancel) {
                        return
                    }
                    that.instanceFiles.splice(find_current, 1)
                    // 否在已选择列表 begin
                    let find_in_selected = that.selectedList.findIndex(o => o === item.id)
                    if (find_in_selected > -1) {
                        that.selectedList.splice(find_in_selected, 1)
                    }
                    // 查找是否在已选择列表 end
                    that.$emit("remove", {
                        type: 'remove',
                        current: item,
                        index: find_current,
                        urls: that.picUrls,
                        files: that.instanceFiles,
                        param: this.param,
                        selected: that.selectedList
                    })
                } catch (e) {
                    throw new Error(JSON.stringify(e))
                }
            },
            /**
             * 选择图片，暂时废弃
             */
            onSelect(item, index) {
                if (!item) {
                    return
                }
                let find_in_selected = this.selectedList.findIndex(o => +o === +item.id)
                if (find_in_selected > -1) {
                    this.selectedList.splice(find_in_selected, 1)
                } else {
                    if (+this.selectCount === 1 && find_in_selected < 0) {
                        this.selectedList = new Array([ item.id ])
                    }
                }
                console.log('已选中：', this.selectedList)
                this.$emit("select", {
                    type: 'select',
                    current: item,
                    index: index,
                    param: this.param,
                    urls: this.picUrls,
                    files: this.instanceFiles,
                    selected: this.selectedList
                })
            }
        }
    }
</script>
<style lang="scss">
    @import "./iconfont/iconfont";

    $grey: #eee;
    $grey100: #f2f2f2;
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

    @keyframes translateCycle {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .spinner {
        &-cycle {
            animation: {
                name: translateCycle;
                duration: 1s;
                timing-function: cubic-bezier(.5, 0.25, .25, .5);
                iteration-count: infinite;
                fill-mode: forwards;
            };
        }

        &-reverse {
            animation: {
                direction: alternate;
            };
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

                &.selected {
                    border: {
                        color: $uni-color-primary;
                        style: solid;
                    }
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
                line-height: 1.5;
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
        &-select {
            position: absolute;
            width: units(20);
            height: units(20);
        }

        &-remove {
            position: absolute;
            width: units(30);
            height: units(30);
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
            box-shadow: 0 0 4px inset rgba($color: #000000, $alpha: .2);
            border-radius: units(3);
            background-color: rgba(#000, 0.6);

            &.selected {
                background-color: $uni-color-primary;
                border-color: #fff;
            }
        }
    }
</style>
