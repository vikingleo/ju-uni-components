<script>
	import Vue from 'vue'
export default {
	onLaunch: function() {
		console.log('App Launch');
		uni.getSystemInfo({
			success: function(e) {
				// 根据安全屏幕宽度，设置rpx和px的比例，比例尺参考微信小程序 1rpx=n px
				Vue.prototype.$rpxToPxFactor = e.safeArea.width < 375 ? 0.42 : e.safeArea.width > 375 ? 0.552 : 0.5;
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
</style>
