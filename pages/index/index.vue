<template>
	<view>
		<ju-navigator-grid :list="menu1" element-id="juNavigatorGrid1"/>
	</view>
</template>

<script>
	import juNavigatorGrid from '@/components/components/ju-navigator-grid/ju-navigator-grid.vue'
	export default {
		components:{
			juNavigatorGrid
		},
		data() {
			return {
				menu1:[
					{title:'1',icon:''},
					{title:'2',icon:''},
					{title:'3',icon:''},
					{title:'4',icon:''},
					{title:'5',icon:''},
					{title:'6',icon:''},
					{title:'7',icon:''},
					{title:'8',icon:''},
					{title:'9',icon:''},
					{title:'10',icon:''},
				]
			}
		},
		onLoad() {

		},
		methods: {

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
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
