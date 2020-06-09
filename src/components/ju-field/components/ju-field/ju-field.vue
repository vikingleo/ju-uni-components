<template>
    <!--    文本框-->
    <view class="ju-field-item" :class="className" :style="{height}">
        <!--错误-->
        <view class="ju-field-container" :class="{'has-border':border||mode==='default','is-cube':mode==='cube','is-focus':isFocus,'is-error':instanceErrorText,'is-disabled':disabled}" :style="{backgroundColor,height}">
            <template v-if="border&&border!=='transparent'">
                <!--下划线-->
                <view class="default-bottom-border" :style="defaultBottomBorderStyle"></view>
                <!--获取焦点和错误的下划线-->
                <view class="focus-bottom-border" :style="{'background-color':focusBorder?focusBorder:(mode==='cube'?'transparent':'')}"></view>
            </template>
            <!--disabled状态-->
            <view class="is-disabled-box" :style="{color:disabledLockColor,'background-color':disabledLockBg,'background-image':'url('+ disabledLock +')'}" v-if="(disabledLock||($slots.disabledLock&&disabledLock==='custom'))&&disabled&&mode==='cube'">
                <!-- 可以通过slot设置字体图标 -->
                <slot name="disabledLock" v-if="disabledLock==='custom'"></slot>
            </view>
            <label class="ju-field-label" @click="onFocus" :class="labelMoreClass" :style="{minWidth:labelWidth,color:instanceErrorText?'#ff6155':(isFocus?focusBorder:'')}" v-if="label||labelIcon">
                <i :class="labelIcon" class="ju-field-label-icon" v-if="labelIcon" :style="{'margin-right':label?'10rpx':0}"></i>
                <view v-if="label" class="ju-field-label-content" :class="'label-align-'+labelAlign">
                    <view v-text="item" :key="index" v-for="(item,index) in label"></view>
                </view>
                <view class="colon" v-if="colon">:</view>
            </label>
            <slot name="inputBefore"></slot>
            <view class="ju-field-content" :class="contentClass">
                <view class="error-wrap" v-if="instanceErrorText" v-text="instanceErrorText" @click="cancelError"></view>
                <template v-if="$slots.content">
                    <slot name="content"></slot>
                </template>
                <template v-else>
                    <input
                            :password="type==='password'"
                            class="ju-field-content-input"
                            :class="inputClass"
                            :id="id"
                            :placeholder="placeholder"
                            :type="type"
                            :name="name"
                            :maxlength="maxlength"
                            :value="value"
                            @focus="onFocus"
                            @blur="onBlur"
                            @input="onInput"
                            @confirm="onConfirm"
                            @keyboardheightchange="onKeyboardheightchange"
                            :disabled="disabled"
                            :cursor-spacing="cursorSpacing"
                            :placeholder-style="placeholderStyle"
                            :focus="isFocus"
                            :confirm-type="confirmType"
                            :confirm-hold="confirmHold"
                            :cursor="cursor"
                            :selection-start="selectionStart"
                            :selection-end="selectionEnd"
                            :adjust-position="adjustPosition"
                            :holdKeyboard="holdKeyboard"
                    />
                </template>
            </view>
            <template v-if="$slots.control">
                <view class="ju-field-control">
                    <slot name="control"></slot>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
    import Parent from "./ju-field-group"

    export default {
        name: "ju-field",
        extends: Parent,
        props: {
            //模式，可选：底部线条：default或不设置，cude：带边框
            mode: {type: String, default: "default"},
            id: {type: String, default: ""},
            //mode=cube时有效
            backgroundColor: {type: String, default: ""},
            height: {
                type: String,
                default: '98rpx'
            },
            labelIcon: {type: String, default: ""},
            labelAlign: {type: String, default: "left"},
            labelWidth: {type: String, default: "100rpx"},
            labelClass: {type: String, default: ""},
            contentClass: String,
            inputClass: String,
            className: {type: String, default: ""},
            placeholder: {type: String, default: ""},
            value: {type: String, default: "", required: true},
            type: {type: String, default: "text"},
            name: {type: String, default: ""},
            maxlength: {type: Number | String, default: 140},
            border: {type: String | Boolean, default: "#eee"},
            focusBorder: {type: String | Boolean, default: ""},
            label: String,
            required: Boolean,
            errorText: String,
            disabled: Boolean,
            disabledLock: {
                type: String,
                default:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE4UlEQVR4Xu1aXWhcRRQ+Zy5pXKlBRYoKgtIiCqm4M3OJmlC6IEJ98I9WQUEFsSiVgvriH1jBn9dKVYwVFB9UWn1RUKHCRowacudstV3QapU+VUGFGsUkD3uPTMmGm5u7yd65924WcweWwGbO+c75duacM2cGoYfDGDPCzDsQ8UL7AQD7l5n5TwD4g5lPep73SbVaPdUrs7BoICJSzHwfIu4AgC3d4CHiRKvV+gIRx7XWv3Yj4zqnMAKs4wCwe+Hjat/pMAwPFklEIQQQ0R4AeMXV6wS5X5j5Ca314Rx1nlWVOwFEdAgAdnVh6GkAaC/vSwDg0tVkEHGvlPLAavPS/D9XAojoXwCodDDgM2b+WAhxVEr5TdIcIrqdmW9DxHs7OcHMT2mtX0rj5EpzcyOAiL4DgGsSwI4i4n4p5TvdGt1F/HhEKfVqt/oKJ4CIPgSAOxKA3hgcHHx8eHj4HxdjgyC4RQhxEAA2Jcg/o5R6wUVvVCbzCjDG2BT3dtwQZj6gtd6b1UAr32g06sy8Pa5LCDFarVa/zoKRiYBms7lxfn7eGrA1ZsRhpdSdWQyLyyaRgIjvSSnvzoKTiYAgCPYJIZ5dsqQQJ6SUtSxGJckaYzYj4ucAcHkM72Yp5aeueJkIaDQak8w8GgUPw7Dm+/6Eq0EryRHR/QDwVoyAD6SU3aTdRNXOBBhjtiLisZjzz/m+v68I59s6icgSYIlYHEKIK1zPD84EENHTAPB8zNltSqkviyTAGLMLEW2xFR3OGSELAbaYuS5ixRml1AVFOm91T05OnlepVGZiOFNKqetdsLMQYMvYi9ugzHxEa32TixFpZRIywm9KKVtOpx5OBNTr9XOGhoZmo2jM/K7W+p7UFjgIGGNetueCqOjMzEylVqvNpVXnRIAx5ipE/D4Gtl8p9WhaA1zmB0HwgBDizdgPcLXW+oe0+pwICIJguxCiHgULw7DwDNDG64DvlH5LAtIuGTu/XAHlFihjQBkE//dZgIhse2sbIl4LAJtjwfJ8ZrbfR8cpROzVhcYyfET8FgDOxGqDHwHgeBiGJ3zfP5IU8BPTIBHdtXDs7NTgdEkeay0zrpR6KG7EMgKIyDJ141pbWxD+R0qpW6O6lxBgjHkREZ8sCLwv1DLzg1rrxTJ6kQBjzEWI+HviPkFM6vBsYGZ7GtwIACcQsdVjDweY+TJ7uYOIPydhJzVS7TxE3CSlPOvrIgFBEIwKISZjik7Ozs7KsbGxv3vsXC5wU1NTQ57nPRbvW0bbdosEEJG9yBxfsj8QMzUcc/Eio5KFSxYTyw57tNavxVfAsg6vUsrpsJTR5tzFiYijSqMn1+gWKAmI75VyBZRboIwBZRDMPSRHFBpjzm21WpWRkRH7Sqyw0ZdZYOHA9f5CZfawlPL1ohjoOwJshTYwMPBX1GEhxJXVavWnIkjoOwKmp6dv8Dzvq1hxstP3ffvSJPdREtBvlWC5AsotUMaAMgiu6yyQ9MqDmbdorRNbW1nzYt+lQetQEAQ7Pc87xMz2vLFbKWVfhBYy+pIA62mz2dwwNzdX0VovqQrzZqFvCcjb0U76SgL6rRLs1S/fxilXQLkCyrb46vcC5c3Qer8bdLgd7nUwT42X6nbYal/X7wMiOXP9vhCJkLB+3whFSFjplVjq/bgWAsy86iux/wB0koduccKvMwAAAABJRU5ErkJggg=="
            },
            disabledLockBg: {type: String, default: "#fff"},
            disabledLockColor: {type: String, default: "#778a98"},
            cursorSpacing: Number,
            placeholderStyle: String,
            placeholderClass: {type: String, default: "input-placeholder"},
            focus: Boolean,
            confirmType: {type: String, default: "done"},
            confirmHold: Boolean,
            cursor: Number,
            selectionStart: {type: Number, default: -1},
            selectionEnd: {type: Number, default: -1},
            adjustPosition: {type: Boolean, default: true},
            holdKeyboard: Boolean,
            // 显示点
            colon: Boolean
        },
        computed: {
            labelMoreClass: function () {
                let _cla = ""
                if (this.labelClass) {
                    _cla += ` ${this.labelClass}`
                }
                if (this.labelIcon && !this.label) {
                    _cla += "label-align-center"
                }
                if (this.required) {
                    _cla += ` is-required`
                }
                if (this.labelBgIsColor) {
                    _cla += ` bg-${this.labelBackgroundColor.replace(
                        /(^\s*)|(\s*$)/g,
                        ""
                    )}`
                }
                return _cla
            },
            defaultBottomBorderStyle: function () {
                let _style = ""
                if (typeof this.border === "string" && this.border !== "false") {
                    _style += ` background-color:${this.border}`
                } else if (typeof this.border === "boolean" && !this.border) {
                    _style += " display:none;"
                }
                return _style
            }
        },
        data() {
            return {
                isFocus: false,
                instanceErrorText: ""
            }
        },
        watch: {
            errorText: function (newVal) {
                this.instanceErrorText = newVal
            }
        },
        onShow() {
            this.instanceErrorText = this.errorText
        },
        methods: {
            onFocus(e) {
                if (!this.isFocus) {
                    this.isFocus = true
                }
                this.$emit("focus", e.detail)
            },
            onBlur(e) {
                if (this.isFocus) {
                    this.isFocus = false
                }
                this.$emit("blur", e.detail)
            },
            onInput(e) {
                this.$emit("input", e.target.value)
            },
            onConfirm(e) {
                this.$emit("confirm", e.detail)
            },
            onKeyboardheightchange(e) {
                this.$emit("keyboardheightchange", e.detail)
            },
            cancelError() {
                this.instanceErrorText = null
            }
        }
    }
</script>

<style lang="scss">
    @import "./_variable.scss";

    .colon {
        padding-left: units(5);
    }

    .ju-field {

        &-item {
            position: relative;

            .ju-field-container {
                display: flex;
                align-items: center;
                position: relative;

                &.has-border {
                    .default-bottom-border,
                    .focus-bottom-border {
                        position: absolute;
                        display: block;
                        bottom: 0;
                        height: 1px;
                        background-color: $border-color;
                        transition: all 0.4s;
                        left: 50%;
                        right: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .default-bottom-border {
                        width: 100%;
                    }

                    .focus-bottom-border {
                        width: 0;
                    }
                }

                &.is-cube {
                    border-radius: $border-radius;
                    background-color: $grey100;

                    .default-bottom-border {
                        display: none;
                    }

                    .ju-field-label {
                        transition: all 0.2s;
                        transition-delay: 0.2s;
                    }

                    .ju-field-content-input {
                        padding: {
                            left: units(10);
                            right: units(10);
                        }
                    }
                }

                &.is-focus {
                    overflow: hidden;

                    .focus-bottom-border {
                        z-index: 1;
                        width: 100%;
                        background-color: $primary;
                    }

                    .default-bottom-border {
                        opacity: 0;
                    }
                }

                &.is-error {
                    .focus-bottom-border {
                        width: 99%;
                        background-color: $danger !important;
                    }

                    .ju-field-label {
                        color: $danger;
                    }
                }

                &.is-disabled {
                    .is-disabled-box {
                        position: absolute;
                        left: units(-10);
                        top: 50%;
                        bottom: 50%;
                        width: units(20);
                        height: units(20);
                        transform: translateY(-50%);
                        border-radius: 100px;
                        background-color: #fff;
                        background: {
                            repeat: no-repeat;
                            position: center;
                            size: 50%;
                        }
                    }

                    .ju-field-content-input {
                        color: $default !important;
                    }
                }
            }

            // 错误
            .error-wrap {
                z-index: 1;
                color: white;
                font-size: units(12);
                position: absolute;
                padding: units(5) units(10);
                background-color: rgba($danger, 1);
                bottom: 0;
                left: 0;
                transform: translateY(120%);
                border-radius: $border-radius;
                box-shadow: units(1) units(3) units(2) rgba(#000, 0.3);

                &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    border: {
                        bottom: units(5) solid rgba($danger, 1);
                        right: units(5) solid transparent;
                        left: units(5) solid transparent;
                    }
                    top: units(-5);
                }
            }
        }

        &-control {
            padding: 0 units(10);
        }

        &-label {
            color: $default;
            white-space: nowrap;
            height: 100%;
            padding:0 units(10);
            display: flex;
            line-height: 1;
            font-size: units(14);
            align-items: center;
            border-radius: $border-radius 0 0 $border-radius;

            &-content {
                flex: 1;
                display: flex;
                align-items: center;

                &.label-align {
                    &-left {
                        justify-content: flex-start;
                    }

                    &-justify {
                        justify-content: space-between;
                    }

                    &-right {
                        justify-content: flex-end;

                        &.is-required {
                            &::after {
                                right: 0;
                                left: unset;
                            }
                        }
                    }

                    &-center {
                        justify-content: center;

                        &.is-required {
                            &::after {
                                right: 0;
                                left: unset;
                            }
                        }
                    }
                }
            }

            &.is-required {
                position: relative;

                &::after {
                    content: "*";
                    display: block;
                    position: absolute;
                    color: #f00;
                    left: 0;
                }
            }
        }

        &-content {
            flex: 1;
            height: 100%;
            position: relative;
            &-input{
                height: 100%;
            }
            input {
                font-size: units(14);
                height: 100%;
                width: 100%;
                border: 0;
            }
        }
    }

</style>
