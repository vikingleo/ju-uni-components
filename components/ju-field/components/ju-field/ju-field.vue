<template>
    <!--    文本框-->
    <view class="ju-field-item">
        <!--错误-->
        <view class="ju-field-container"
              :class="{'has-border':border||mode==='default','is-cube':mode==='cube','is-focus':isFocus,'is-error':instanceErrorText}">
            <!--下划线-->
            <view class="default-bottom-border" :style="defaultBottomBorderStyle"></view>
            <!--获取焦点和错误的下划线-->
            <view class="focus-bottom-border" :style="{'background-color':focusBorder?focusBorder:(mode==='cube'?'transparent':'')}"></view>
            <label class="ju-field-label" :class="labelClass" :style="{minWidth:labelWidth,color:instanceErrorText?'#ff6155':(isFocus?focusBorder:'')}">
                <i :class="labelIcon" class="ju-field-label-icon" v-if="labelIcon" :style="{'margin-right':label?'10rpx':0}"></i>
                <template v-if="label">
                    <span v-text="label" v-if="labelAlign!=='justify'"></span>
                    <template v-else>
                        <span v-text="item" :key="index" v-for="(item,index) in label"></span>
                    </template>
                </template>
            </label>
            <view class="ju-field-content">
                <view class="error-wrap" v-if="instanceErrorText" v-text="instanceErrorText" @click="cancelError"></view>
                <input :password="type==='password'"
                       class="ju-field-content-input"
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
                       :focus="focus"
                       :confirm-type="confirmType"
                       :confirm-hold="confirmHold"
                       :cursor="cursor"
                       :selection-start="selectionStart"
                       :selection-end="selectionEnd"
                       :adjust-position="adjustPosition"
                       :holdKeyboard="holdKeyboard"
                />
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
            labelIcon: {type: String, default: ""},
            labelAlign: {type: String, default: "left"},
            labelWidth: {type: String, default: "100rpx"},
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
            cursorSpacing: Number,
            placeholderStyle: String,
            placeholderClass: {type: String, default: 'input-placeholder'},
            focus: Boolean,
            confirmType: {type: String, default: 'done'},
            confirmHold: Boolean,
            cursor: Number,
            selectionStart: {type: Number, default: -1},
            selectionEnd: {type: Number, default: -1},
            adjustPosition: {type: Boolean, default: true},
            holdKeyboard: Boolean
        },
        computed: {
            labelClass: function () {
                let _cla = ''
                if (this.labelIcon && !this.label) {
                    _cla += "label-align-center"
                } else {
                    _cla += "label-align-" + this.labelAlign
                }
                if (this.required) {
                    _cla += ` is-required`
                }
                return _cla
            },
            defaultBottomBorderStyle: function () {
                let _style = ''
                if (typeof this.border === 'string' && this.border !== 'false') {
                    _style += ` background-color:${this.border}`
                } else if (typeof this.border === 'boolean' && !this.border) {
                    _style += ' display:none;'
                }
                return _style
            }
        },
        data() {
            return {
                isFocus: false,
                instanceErrorText: ''
            }
        },
        watch: {
            errorText: function (newVal) {
                this.instanceErrorText = newVal
            }
        },
        created() {
            this.instanceErrorText = this.errorText
        },
        methods: {
            onFocus(e) {
                this.isFocus = true
                this.$emit("focus", e.detail)
            },
            onBlur(e) {
                this.isFocus = false
                this.$emit("blur", e.detail)
            },
            onInput(e) {
                this.$emit('input', e.target.value)
            },
            onConfirm(e) {
                this.$emit('confirm', e.detail)
            },
            onKeyboardheightchange(e) {
                this.$emit('keyboardheightchange', e.detail)
            },
            cancelError() {
                this.instanceErrorText = null
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "./_variable.scss";

    .ju-field {
        &-item {
            height: units(40);
            position: relative;

            .ju-field-container {
                &.has-border {

                    .default-bottom-border, .focus-bottom-border {
                        position: absolute;
                        display: block;
                        bottom: 0;
                        height: 1px;
                        background-color: $border-color;
                        transition: all .4s;
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

                    .default-bottom-border {
                        display: none;
                    }

                    background-color: $grey100;

                    .ju-field-label {
                        background-color: darken($grey100, 5%);
                        transition: all .2s;
                        transition-delay: .2s;
                    }

                    .ju-field-content-input {
                        padding: {
                            left: units(10);
                            right: units(10);
                        };
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
                box-shadow: units(1) units(3) units(2) rgba(#000, .3);

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    border: {
                        bottom: units(5) solid rgba($danger, 1);
                        right: units(5) solid transparent;
                        left: units(5) solid transparent;
                    };
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
            padding: 0 units(10);
            display: flex;
            line-height: 1;
            font-size: units(14);
            align-items: center;
            border-radius: $border-radius 0 0 $border-radius;

            &.label-align {
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

            input {
                font-size: units(14);
                height: 100%;
                width: 100%;
                border: 0;
            }
        }

        &-container {
            display: flex;
            align-items: center;
            @extend .ju-field-item;
            /*overflow: hidden;*/
        }

    }
</style>
