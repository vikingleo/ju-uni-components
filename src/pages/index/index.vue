<template>
	<view style="padding:20rpx">
        <view>隐藏滚动条</view>
		<ju-navigator-grid
			height="180"
			size="77rpx"
			:list="menu1"
			@press="onPress"
            :show-scroll-bar="false"
		/>
        <br>

        <view>展示滚动条</view>
        
		<ju-navigator-grid
			:list="menu1"
			@press="onPress"
		/>
        <br>
        <view>list.length小于等于row-count * col-count
        </view>
		<ju-navigator-grid
			:list="menu2"
            row-count="2"
            col-count="3"
            size="70px"
            height="200"
			@press="onPress"
		/>
        <br>
	</view>
</template>

<script>
    import juNavigatorGrid from "@/components/ju-navigator-grid/components/ju-navigator-grid/ju-navigator-grid.vue"

    export default {
        components: {
            juNavigatorGrid
        },
        data() {
            return {
                menu1: [
                    {title: "带app内url", url: '/pages/field/index', icon: "/static/images/100x100.jpg"},
                    {title: "带外部url", url: 'https://baidu.com'},
                    {title: "普通按钮", type: 'custom'},
                    {title: "share", openType: 'share', icon: ''},
                    {title: '<span style="color:red;font-weight:bold;">社区团购</span>', icon: "/static/images/200x200-1.jpg"},
                    {title: "redirect", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "社区团购", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "拼团", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "帮助", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "新手福利", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "领券中心", openType: 'redirectTo', url: '/pages/field/index'},
                ],
                menu2: [
                    {title: "社区团购", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "拼团", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "帮助", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "新手福利", openType: 'redirectTo', url: '/pages/field/index'},
                    {title: "领券中心", openType: 'redirectTo', url: '/pages/field/index'},
                ]
            }
        },
        onLoad() {},
        methods: {
            onPress(e) {
                console.log(e)
            }
        }
    }
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200 rpx;
	width: 200 rpx;
	margin-top: 200 rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50 rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36 rpx;
	color: #8f8f94;
}
</style>
