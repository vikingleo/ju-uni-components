<template>
    <button class="btn-sms-code" @click="onGetCode"
            :disabled="btnGetCodeDisabled||disabled"
            :style="{width:$attrs.width}"
            :class="`text-${align} btn-${type} ${btnGetCodeDisabled?'is-disabled':''}`"
            :loading="btnGetCodeLoading"
            :size="size" v-text="getCodeText">
    </button>
</template>

<script>
    const isMPStrict = value => /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(value)

    let verificationCodeTimer = null
    export default {
        name: "sms-code",
        props: {
            //手机号码或请求的依据，此项只会作为判断是否disabled的依据，不做参数传入
            value: {
                type: String,
                default: ''
            },
            // 获取验证码的URL
            url: {
                type: String,
                default: ''
            },
            // 需要请求的参数
            param: {
                type: Object,
                default: {}
            },
            type: {
                type: String,
                default: 'link'
            },
            size: {
                type: String,
                default: ''
            },
            align: {
                type: String,
                default: 'center'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                timeoutSeconds: 60,
                timerSecondsOriginal: 60,
                getCodeText: '获取验证码',
                btnGetCodeLoading: false
            }
        },
        computed: {
            // 获取按钮可点击状态
            btnGetCodeDisabled: function () {
                return !this.value || !isMPStrict(this.value, 'zh-CN') || this.timeoutSeconds < this.timerSecondsOriginal || this.btnGetCodeLoading
            }
        },
        created() {
            console.log(this.$attrs)
        },
        methods: {
            /**
             * 验证码倒计时
             * */
            verificationCodeTimeOut() {
                const that = this
                clearTimeout(verificationCodeTimer)
                if (that.timeoutSeconds <= 0) {
                    that.timeoutSeconds = that.timerSecondsOriginal
                    that.getCodeText = '重新获取'
                } else {
                    that.timeoutSeconds--
                    that.getCodeText = `${that.timeoutSeconds}秒可获取`
                    verificationCodeTimer = setTimeout(function () {
                        that.verificationCodeTimeOut()
                    }, 1000)
                }
            },
            /**
             * 获取短信验证码
             */
            async onGetCode() {
                const that = this
                try {
                    if (!that.value || !isMPStrict(that.value, 'zh-CN')) {
                        uni.showToast({
                            icon: 'none',
                            title: '输入格式错误'
                        })
                        return
                    }
                    that.btnGetCodeLoading = true
                    let res = await that.$http(that.url).post(that.param || {mobile: that.value})
                    that.btnGetCodeLoading = false
                    if (res.code === 0) {
                        uni.showToast({
                            title: res.msg
                        })
                        that.verificationCodeTimeOut()
                    }
                } catch (e) {
                    that.btnGetCodeLoading = false
                    throw new Error(e.errMsg)
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    @function units($val) {
        @return $val * 2rpx;
    }

    //如果引入了basic-style，可以把这里都删掉
    $primary: rgb(0, 140, 255);
    $input-size-default: units(40);
    $default: #778a98;
    $input-size-sm: units(30);
    $border-color: #eee;
    $grey100: #f1f4f7;
    $border-radius: units(4);
    $danger: #ff6155;

    .btn-sms-code {
        padding: units(8) 0;
        font-size: units(14);
        height: units(30);
        line-height: 1;
        color: $default;
        display: flex;
        align-items: center;
        justify-content: center;

        &::after {
            display: none;
        }

        &:active {
            background-color: rgba($grey100, .5);
        }

        &.btn {
            &-link {
                background-color: transparent;
                padding: 0;

                &:not(.is-disabled) {
                    color: $primary;
                }
            }

            &-primary {
                padding: {
                    left: units(5);
                    right: units(5);
                };

                &:not(.is-disabled) {
                    background-color: $primary;
                    color: lighten($primary, 50%);
                }
            }
        }
    }
</style>
