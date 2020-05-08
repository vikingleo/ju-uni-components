<template>
    <view style="padding:15px">
        <h4>默认</h4>
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
        <ju-field mode="cube" label="用户名" v-model="username" placeholder="请填写用户名"></ju-field>
        <ju-field label="密码" type="password" v-model="password" placeholder="请填写密码"></ju-field>
        <br />
        <h4>没有group</h4>
        <ju-field label="用户名" v-model="username" placeholder="请填写用户名"></ju-field>
        <ju-field label="密码" type="password" v-model="password" placeholder="请填写密码"></ju-field>
    </view>
</template>

<script>
    import juFieldGroup from "../../components/ju-field/components/ju-field/ju-field-group"
    import juField from "../../components/ju-field/components/ju-field/ju-field"

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
            }
        }
    }
</script>

<style lang="scss">
</style>
