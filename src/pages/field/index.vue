<template>
	<view style="padding:15px">
		<h4>外面包一层特定的组件</h4>
		<br />
		<ju-field-group>
			<ju-field label-align="justify" label="用户名" required v-model="username" placeholder="请填写用户名"></ju-field>
			<ju-field
				label-align="right"
				required
				label="密码"
				type="password"
				v-model="password"
				placeholder="请填写密码"
			></ju-field>
		</ju-field-group>
		<br />
		<h4>mode=cube</h4>
		<ju-field
			mode="cube"
			background-color="lightBlue"
			label="用户名"
			v-model="username"
			placeholder="请填写用户名"
		></ju-field>
		<ju-field label="密码" type="password" v-model="password" placeholder="请填写密码"></ju-field>
		<br />
		<h4>没有group</h4>
		<ju-field label="用户名" v-model="username" placeholder="请填写用户名"></ju-field>
		<ju-field label="密码" type="password" v-model="password" placeholder="请填写密码"></ju-field>
		<br />
		<h4>示例</h4>
		<ju-field
			label="获取验证码："
			background-color="orange"
			placeholder="输入6位验证码"
			type="number"
			maxlength="11"
			v-model="password"
		>
			<template slot="control">
				<view class>获取验证码</view>
			</template>
		</ju-field>
		<br />
		<h4>disabled</h4>
		<ju-field
			label="用户名："
			mode="cube"
			placeholder="请输入"
			disabled
			v-model="username"
			style="margin-bottom:10px"
		/>
		<ju-field
			label="用户名："
			mode="cube"
			placeholder="请输入"
			disabled
			disabled-lock-bg="red"
			disabled-lock-color="white"
			v-model="username"
		/>
		<h4>设置disabledLock的插槽</h4>

		<ju-field
			label="用户名："
			mode="cube"
			placeholder="请输入"
			disabled
			disabled-lock="custom"
			disabled-lock-bg="red"
			disabled-lock-color="white"
			v-model="username"
		>
			<view slot="disabledLock" style="text-align:center;font-size:24rpx;line-height:1.8">1</view>
		</ju-field>
	</view>
</template>

<script>
	import juFieldGroup from "../../components/ju-field/components/ju-field/ju-field-group";
	import juField from "../../components/ju-field/components/ju-field/ju-field";

	export default {
		name: "page-field",
		components: {
			juFieldGroup,
			juField
		},
		data() {
			return {
				username: "jiaxiaoye",
				password: "asd123"
			};
		}
	};
</script>