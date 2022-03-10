<template>
	<view class="p-15">
		<view class="avg avg-2">
			<view class="avg-item p-5">
				<ju-image-upload :src="src" type="select" upload :upload-url="uploadUrl" :uploadWxSdkUrl="uploadWxSdkUrl" :count="1" :row-count="1" @select="onTest" border="dashed" @choose="onTest" @remove="onTest" @preview="onTest" @control="onTest" @upload="onTest"></ju-image-upload>
			</view>
			<view class="avg-item p-5">
				<ju-image-upload :src="src1" type="select" upload :upload-url="uploadUrl" :uploadWxSdkUrl="uploadWxSdkUrl" :count="1" :row-count="1" @select="onTest" border="dashed" @choose="onTest" @remove="onTest" @preview="onTest" @control="onTest" @upload="onTest"></ju-image-upload>
			</view>
		</view>
		<!-- 上传图片 -->
	</view>
</template>

<script>
	import juImageUpload from "@/components/ju-image-upload/components/ju-image-upload/ju-image-upload.vue"
	import api from '@/http/api'

	export default {
		components: {
			juImageUpload
		},
		data() {
			return {
				src: [
					// "http://static.dev.yfb.yunshuiccc.com/uploads/images/2020-09-18/36035e315dba028b80f96c607392b813.jpg",
					// "http://static.dev.yfb.yunshuiccc.com/uploads/images/2020-09-18/46d39c72a2b1d371869275657a68de5a.jpg",
					// "http://static.dev.yfb.yunshuiccc.com/uploads/images/2020-09-18/3f17598b6f8447e969c2f62294f3b827.jpg",
					// "http://static.dev.yfb.yunshuiccc.com/uploads/images/2020-09-18/5ef40c5698a2def69b923309898dbefd.jpg",
					// "http://static.dev.yfb.yunshuiccc.com/uploads/images/2020-09-18/4972fe6ba022737b783d1ee8d16c741f.jpg"
                ],
                src1:[],
				uploadUrl: api.tool.upload_image_general,
				uploadWxSdkUrl: api.tool.file_upload
			}
		},
		methods: {
			onTest(e) {
				console.log(e)
				this.src = e.files
			}
		}
	}
</script>

<style lang="scss">
.p-15 {
	padding: units(15);
}
</style>
