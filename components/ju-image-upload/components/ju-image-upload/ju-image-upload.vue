<template>
    <view class="img-upload">
        <view class="img-upload-sheet" v-if="sheetActive" :class="{'ready-hide':readyHideSheet}">
            <view class="img-upload-sheet-mask" @click="hideSheet"></view>
            <view class="img-upload-sheet-control">
                <view class="item">
                    <button class="control-btn-item control-btn-item-preview" @click="onPreview">
                        <view class="control-btn-item-icon"><i class="ju-icon icon-eye"></i></view>
                        <view class="control-btn-item-text">预览</view>
                    </button>
                </view>
                <view class="item">
                    <button class="control-btn-item control-btn-item-remove" @click="onRemove">
                        <view class="control-btn-item-icon"><i class="ju-icon icon-trash"></i></view>
                        <view class="control-btn-item-text">删除</view>
                    </button>
                </view>
                <view class="item" v-if="type==='select'">
                    <button class="control-btn-item control-btn-item-select" @click="onSelect">
                        <view class="control-btn-item-icon">
                            <i class="ju-icon icon-check" v-if="findInSelected()"></i>
                        </view>
                        <view class="control-btn-item-text" v-text="findInSelected()?'已选择':'选择'"></view>
                    </button>
                </view>
            </view>
        </view>
        <view class="img-upload-content" :style="{margin:count>1?gutter/2*-1+'px':0}">
            <view class="img-upload-container img-preview-item" :key="index" v-for="(item,index) in instanceUrls" :style="{ width:instanceWidth, height:instanceHeight,padding:gutter/2+'px'}">
                <view class="img-upload-body" :style="{backgroundColor}" :class="{square:rowCount>0}" @click="onControl(item,index)">
                    <view class="img-upload-body-content" :class="{'no-border':border==='none'}" :style="{borderStyle:border}">
                        <view class="img-upload-check" v-if="findInSelected(item,index)">
                            <i class="ju-icon icon-check"></i>
                        </view>
                        <image :src="item" :mode="mode" class="img-upload-img"></image>
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
                                <i v-else class="ju-icon icon-plus btn-icon"></i>
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
    export default {
        components: {},
        props: {
            // @TODO 类型，默认多张上传，（待开发可选：select）
            type: {
                type: String,
                default: ""
            },
            // @TODO 多选还是单选
            selectMore: {
                type: Boolean,
                default: false
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
                type: String,
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
            //@TODO 缺少总数、每次上传数区分
            count: {
                type: Number | String,
                default: 1,
                validator: function (value) {
                    return +value > 0
                }
            },
            //单次选择数量
            chooseCount: {
                type: Number | String,
                default: 9,
                validator: function (value) {
                    return +value >= 1 && +value <= 9
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
            }
        },
        data() {
            return {
                instanceUrls: [],
                sheetActive: false,
                currentSelectedSrc: {},
                readyHideSheet: false,
                selectedList: [],
                tempFilePaths: [], //标记选择图片后对应的id
                uploadedServerId: [], //标记已经经过内置接口上传获取的serverId/mediaId
                uploadedUrls: [] //标记上传后返回的url集合
            }
        },
        mounted() {
            if (this.src) {
                if (typeof this.src === "string") {
                    this.instanceUrls = JSON.parse(JSON.stringify([ this.src ]))
                } else if (Array.isArray(this.src)) {
                    this.instanceUrls = this.src
                }
            }
        },
        computed: {
            instanceWidth: function () {
                return this.rowCount ? `${100 / this.rowCount}%` : this.width
            },
            instanceHeight: function () {
                return this.rowCount ? "auto" : this.height
            }
        },
        watch: {
            src: function (newData, oldData) {
                this.instanceUrls =
                    typeof newData === "string" && newData
                        ? JSON.parse(JSON.stringify([ newData ]))
                        : newData
            }
        },
        methods: {
            /**
             * 返回是否在已选择列表
             * */
            findInSelected(src, index) {
                const that = this
                src = src || this.currentSelectedSrc.src
                index = index || this.currentSelectedSrc.index
                let find_index = that.selectedList.findIndex(
                    o => o.index === index && o.src === src
                )
                return find_index > -1
            },
            /**
             * 选择图片
             * */
            onChoose() {
                const that = this
                let platform = uni
                // #ifdef H5
                // @FIXME 如是微信网页开发，请自行引入微信js-sdk
                platform = that.$wx || uni
                // #endif
                // #ifndef H5
                platform = uni
                // #endif
                platform.chooseImage({
                    count:
                        +that.chooseCount > 9
                            ? 9
                            : +that.chooseCount < 1
                            ? 1
                            : +that.chooseCount,
                    sizeType: [ "original", "compressed" ],
                    sourceType: [ "album", "camera" ],
                    success: function (res) {
                        let res_data = []
                        // #ifdef H5
                        //  此处自行引入微信js-sdk后使用，会判断是否有$wx,如果没有，就直接按照非微信公众号开发返回localIds
                        res_data = that.$wx ? res.localIds : res.tempFilePaths
                        // #endif
                        // #ifndef H5
                        res_data = res.tempFilePaths
                        // #endif
                        that.tempFilePaths = JSON.parse(JSON.stringify(res_data))
                        that.uploadedServerId = []
                        // #ifdef H5
                        that.onUploadWx(res_data[ 0 ])
                        // #endif
                        // #ifndef H5
                        that.onUploadWx(res_data)
                        // #endif
                    }
                })
            },
            /**
             * 自动上传图片
             */
            onUploadWx(data) {
                const that = this
                // #ifdef H5
                if (that.$wx) {
                    if (!data) {
                        return
                    }
                    let server_ids = JSON.parse(
                        JSON.stringify(that.uploadedServerId)
                    )
                    that.$wx.uploadImage({
                        localId: data,
                        isShowProgressTips: 1,
                        success: function (res) {
                            server_ids.push(res.serverId)
                            that.uploadedServerId = JSON.parse(
                                JSON.stringify(server_ids)
                            )
                            if (
                                that.uploadedServerId.length ===
                                that.tempFilePaths.length
                            ) {
                                that.$emit("choose", {
                                    files: server_ids,
                                    param: that.param,
                                    urls: that.instanceUrls
                                })
                                //如果要自动上传
                                if (that.upload) {
                                    that.uploadImageAfterChoose(
                                        that.uploadedServerId[ 0 ]
                                    )
                                }
                            } else {
                                //递归回传最新的tempFilePath
                                that.onUploadWx(
                                    that.tempFilePaths[ that.uploadedServerId.length ]
                                )
                            }
                        },
                        fail: function (err) {
                            throw new Error(err)
                        }
                    })
                } else {
                    that.$emit("choose", {
                        files: data,
                        param: that.param,
                        urls: that.instanceUrls
                    })
                }
                // #endif

                // #ifndef H5
                that.$emit("choose", {
                    files: data,
                    param: that.param,
                    urls: that.instanceUrls
                })
                // #endif
            },
            /**
             * 递归上传图片到服务器
             * */
            async uploadImageAfterChoose(mediaId) {
                const that = this
                console.debug("选择后上传", mediaId)
                try {
                    if (!mediaId) {
                        return false
                    }
                    //@FIXME 此处的网络请求、URL、参数根据自己项目处理
                    let param = null
                    if (that.param && that.param.uploadField) {
                        param = that.param.uploadField
                    } else {
                        param = {mediaId}
                    }
                    let res = await that
                    .$http(that.uploadUrl || that.$api.tool.file_upload)
                    .post(param)
                    if (res.code === 0) {
                        let pic = JSON.parse(JSON.stringify(that.uploadedUrls))
                        pic.push(res.data.url)
                        that.uploadedUrls = JSON.parse(JSON.stringify(pic))
                        if (
                            that.uploadedUrls.length !== that.tempFilePaths.length
                        ) {
                            await that.uploadImageAfterChoose(
                                that.uploadedServerId[ that.uploadedUrls.length ]
                            )
                        } else {
                            that.instanceUrls = JSON.parse(
                                JSON.stringify(
                                    that.instanceUrls.concat(that.uploadedUrls)
                                )
                            )
                            that.uploadedUrls = []
                            that.$emit("upload", {
                                param: that.param,
                                current_upload: that.uploadedUrls,
                                urls: that.instanceUrls
                            })
                        }
                    }
                } catch (e) {
                    throw new Error(e.errMsg)
                }
            },
            //  切换弹出操作面板
            onControl(src, index) {
                if (src) {
                    this.currentSelectedSrc = JSON.parse(
                        JSON.stringify({src, index})
                    )
                    this.sheetActive = true
                    this.$emit("control", {
                        current: src,
                        index,
                        param: this.param,
                        urls: this.instanceUrls
                    })
                }
            },
            /**
             * 开始预览
             */
            onPreview() {
                const that = this
                if (!that.currentSelectedSrc || !that.currentSelectedSrc.src) {
                    return
                }
                // that.hideSheet()
                uni.previewImage({
                    urls: this.instanceUrls,
                    current: this.currentSelectedSrc.src,
                    success(res) {
                        that.$emit("preview", {
                            current: that.currentSelectedSrc.src,
                            index: that.currentSelectedSrc.index,
                            urls: this.instanceUrls,
                            param: this.param
                        })
                    }
                })
            },
            /**
             * 删除，目前只支持删除后上传
             */
            onRemove() {
                const that = this
                if (!that.currentSelectedSrc) {
                    return
                }
                uni.showModal({
                    title: `您正在删除列表第${that.currentSelectedSrc.index + 1}张`,
                    content: "是否确认删除？",
                    success(res) {
                        if (res.confirm) {
                            let urls = JSON.parse(
                                JSON.stringify(that.instanceUrls)
                            )
                            let find_validate =
                                urls[ that.currentSelectedSrc.index ] ===
                                that.currentSelectedSrc.src
                            if (find_validate) {
                                urls.splice(that.currentSelectedSrc.index, 1)
                            }
                            that.instanceUrls = JSON.parse(JSON.stringify(urls))
                            //查找是否在已选择列表 begin
                            let selected_list = JSON.parse(
                                JSON.stringify(that.selectedList)
                            )
                            let find_selected_list = selected_list.findIndex(
                                o =>
                                    o.index === that.currentSelectedSrc.index &&
                                    o.src === that.currentSelectedSrc.src
                            )
                            if (find_selected_list > -1) {
                                selected_list.splice(find_selected_list, 1)
                                that.selectedList = JSON.parse(
                                    JSON.stringify(selected_list)
                                )
                            }
                            // 查找是否在已选择列表 end
                            that.hideSheet()
                            that.$emit("remove", {
                                current: that.currentSelectedSrc.src,
                                index: that.currentSelectedSrc.index,
                                urls: urls,
                                param: this.param
                            })
                        }
                    }
                })
            },
            /**
             * 隐藏操作面板的过渡动画
             */
            hideSheet() {
                this.readyHideSheet = true
                setTimeout(() => {
                    this.readyHideSheet = false
                    this.sheetActive = false
                }, 500)
                //返回之前选择的图片信息
                this.$emit("cancel-control", {
                    current: this.currentSelectedSrc.src,
                    param: this.param,
                    index: this.currentSelectedSrc.index,
                    urls: this.instanceUrls
                })
                this.currentSelectedSrc = JSON.parse(JSON.stringify({}))
            },
            /**
             * @TODO 选择图片，选择模式下，操作面板多出选择按钮，选中后图片显示被选择，支持多选和单选
             */
            onSelect() {
                if (this.currentSelectedSrc && this.currentSelectedSrc.src) {
                    let list = JSON.parse(JSON.stringify(this.selectedList))
                    let find_index = list.findIndex(
                        o =>
                            o.index === this.currentSelectedSrc.index &&
                            o.src === this.currentSelectedSrc.src
                    )
                    let type = ""
                    if (find_index > -1) {
                        list.splice(find_index, 1)
                        type = "cancel-select"
                    } else {
                        list.push(this.currentSelectedSrc)
                        type = "select"
                    }
                    this.selectedList = JSON.parse(JSON.stringify(list))
                    this.$emit(type, {
                        current: this.currentSelectedSrc.src,
                        index: this.currentSelectedSrc.index,
                        param: this.param,
                        urls: this.instanceUrls,
                        selected: this.selectedList
                    })
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "../../../../static/ju-image-upload/iconfont/iconfont";

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
        overflow: hidden;

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
                margin-top: units(10);
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

                .ju-icon {
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
</style>
