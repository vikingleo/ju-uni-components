<!--
mode=1: 单排横向滚动
mode=2: 双排横向滚动
mode=3: 全部显示
rowCount: 每行个数
-->
<template>
    <view :id="elementId" class="navigator-menu" v-if="list&&list.length">
        <scroll-view scroll-x class="scroll-view" :style="{width: wrapWidth}" @scroll="scrolling" scroll-with-animation :show-scrollbar="false">
            <view class="scroll-container" :class="{'is-fix':!fix}" :style="{height: wrapHeight}">
                <!--导航-->
                <view class="menu-container " :id="elementId+'-item-'+index" v-for="(item,index) in list" :key="index" :style="{width:itemWidth}">
                    <template v-if="show">
                        <button class="menu-item " @click="onSubmit" :class="{'click-feedback':clickFeedback}" :data-url="item[urlFieldName]">
                            <!--图标-->
                            <view>
                                <view class="menu-icon" :class="{'menu-icon-placeholder':!item[iconFieldName]}" :style="{height: size,width: size}">
                                    <template v-if="!baseIconFont">
                                        <view class="menu-icon-container">
                                            <view class="menu-icon-body">
                                                <image lazy-load mode="aspectFit" :src="item[iconFieldName]"></image>
                                            </view>
                                        </view>
                                    </template>
                                    <template v-else>
                                        <i :class="baseIconFont + ' ' +item[iconFieldName]" :style="{'font-size':size}"></i>
                                    </template>
                                </view>
                            </view>
                            <!--文本-->
                            <view class="menu-title" v-if="showName" :style="{color}" v-text="item[nameFieldName]"></view>
                        </button>
                    </template>
                </view>
            </view>
        </scroll-view>
        <!--滚动条-->
        <view v-if="isScroll&&showScrollBar" class=" scroll-bar-wrap">
            <view class="scroll-groove ">
                <view class="scroll-bar " :style="{transform: 'translateX('+barScrollLeft+')'}"></view>
            </view>
        </view>
    </view>
</template>
<script>
    import numeral from 'numeral'

    export default {
        props: {
            //菜单的id，用于设定子项的宽高，建议必填
            elementId: {
                type: String,
                default: 'navigatorMenu',
            },
            // 列表，必填
            list: {
                type: Array,
                default: [],
            },
            //是否显示菜单名称，可选
            showName: {
                type: Boolean,
                default: true,
            },
            //名称key
            nameFieldName: {
                type: String,
                default: 'title',
            },
            // 基础iconfont样式名，如果存在，使用文字图标
            baseIconFont: {
                type: String,
                default: '',
            },
            //图标的key
            iconFieldName: {
                type: String,
                default: 'icon',
            },
            // 跳转链接的key，可选
            urlFieldName: {
                type: String,
                default: 'url',
            },
            // 文本、图标颜色（如果图标是字体图标）
            color: {
                type: String,
                default: '#666',
            },
            // 行数
            rowCount: {
                type: Number | String,
                default: 2,
            },
            // 列数
            colCount: {
                type: Number | String,
                default: 4,
            },
            // 图标宽高
            size: {
                type: String,
                default: '60rpx',
            },
            // 点击反馈
            clickFeedback: {
                type: Boolean,
                default: true,
            },
            //当出现横向滚动时，是否显示指示条
            showScrollBar: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                wrapWidth: null,
                itemWidth: null,
                barScrollLeft: null,
                show: false,
                containerHeight: '',
                isScroll: false,
            }
        },
        computed: {
            fix: function () {
                return this.list.length <= this.rowCount * this.colCount
            },
            wrapHeight: function () {
                return this.fix ? 'auto' : (this.containerHeight || 0)
            },
        },
        mounted() {
            setTimeout(() => {
                this.init()
            }, 10)
        },
        methods: {
            init() {
                const that = this
                if (!that.list || !that.list.length) return

                let query = uni.createSelectorQuery().in(that)
                let node = query.select(`#${that.elementId}-item-0`).boundingClientRect()

                node = query.select('#' + that.elementId).boundingClientRect()
                node.exec(result => {
                    let [ container, wrap ] = result
                    console.log(container, wrap)
                    // 取余，如果list长度大于行x列，且有余数，滚动的宽度为单行数量+1，否则，就等于单行数量
                    let more_col = that.list.length > (that.rowCount * that.colCount) && that.list.length % (that.rowCount * that.colCount) === 0
                    //单个宽度
                    let itemWidth = `${numeral(wrap.width).divide(that.colCount).value()}px`
                    that.itemWidth = itemWidth
                    //外部宽度
                    let wrapWidth = `${more_col ? itemWidth * (that.colCount + 1) : wrap.width}px`
                    that.wrapWidth = wrapWidth
                    // 单个高度
                    let itemHeight = numeral(that.size.substr(0, that.size.indexOf('rpx'))).multiply(that.$rpxToPxFactor).add(40).value()
                    console.log(itemHeight)
                    // 单个高度外框
                    let containerHeight = `${numeral(container.height || itemHeight).multiply(that.rowCount).value()}px`
                    console.log(containerHeight)
                    let isScroll = that.list.length > (that.rowCount * that.colCount)
                    console.log(isScroll)
                    that.containerHeight = containerHeight
                    that.isScroll = isScroll
                    that.show = true
                    wrapWidth = null
                    itemWidth = null
                    containerHeight = null
                })
            },
            /**
             * 滚动事件
             * @param e
             */
            scrolling(e) {
                const that = this
                //如果没有开启指示条，不执行滚动监听
                if (!that.showScrollBar) {
                    return
                }
                console.log(e.detail)
                let {scrollLeft, scrollWidth} = e.detail
                // 可滚动区域
                console.log(that.wrapWidth)
                let canScrollWidth = numeral(scrollWidth).subtract(that.wrapWidth.substring(0, that.wrapWidth.length - 2)).value()
                let scale = numeral(scrollLeft).divide(canScrollWidth).value()
                // 可滚动区域
                let grooveW = 40
                // 计算滚动条可滚动区域
                that.barScrollLeft = `${numeral(scale).multiply(grooveW).value()}px`
            },
            /**
             * 菜单触发的事件
             * @param e
             */
            onSubmit(e) {
                const that = this
                if (e && e.detail && e.currentTarget.dataset) {
                    let {url, opentype} = e.currentTarget.dataset
                    if (!url) {
                        return
                    }
                    url = url.substr(0, 1) === '/' ? url : '/' + url
                    if (!opentype) {
                        wx.navigateTo({
                            url,
                        })
                    } else {
                        switch (opentype) {
                            case 'navigate':
                                wx.navigateTo({
                                    url,
                                })
                                break
                            case 'redirect':
                                wx.redirectTo({
                                    url,
                                })
                                break
                            case 'switchTab':
                                wx.switchTab({
                                    url,
                                })
                                break
                        }
                    }
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
    @function units($val) {
        @return $val*2rpx;
    }

    view, button, scroll-view, text {
        box-sizing: border-box;
        line-height: 1;
    }

    .scroll-container {
        white-space: nowrap;
        display: flex;
        flex-wrap: wrap;

        &.is-fix {
            flex-direction: column;
        }
    }

    .menu-container {
        position: relative;

        .menu-item {
            background-color: transparent;
            width: 100%;
            height: 100%;
            padding: units(10);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;

            &::after {
                display: none;
            }

            &.click-feedback {
                &:active {
                    background-color: #f1f4f7 !important;
                    opacity: .7;
                }
            }
        }
    }

    .scroll-groove {
        width: 54px;
        height: 6px;
        padding: 2px;
        border-radius: 100vw;
        background-color: #f1f4f7;
        overflow: hidden;

        .scroll-bar {
            width: 10px;
            height: 2px;
            border-radius: 100vw;
            background-color: #017be7;
        }
    }

    .scroll-view {
        width: 100%;
    }

    .menu-icon {
        position: relative;
        overflow: hidden;

        &-container {
            height: 0;
            padding-bottom: 100%;
        }

        &-body {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            image, img {
                width: 100%;
                height: 100%;
            }
        }

        &-placeholder {
            background-color: #eee;
            color: #f1f4f7;
            font-size: 30%;
        }
    }

    // 菜单标题
    .menu-title {
        font-size: units(12);
        margin-top: units(5);
    }

    .scroll-bar-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: units(5);
    }
</style>
