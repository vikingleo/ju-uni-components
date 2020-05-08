<template>
    <!--    文本框-->
    <view class="ju-field-item">
        <!--错误-->
        <view class="error-wrap" v-if="errorText" v-text="errorText"></view>
        <view class="ju-field-container"
              :class="{'has-border':border||mode==='default','is-cube':mode==='cube','is-focus':isFocus,'is-error':errorText}">
            <label class="ju-field-label" :class="labelClass" :style="{minWidth:labelWidth}">
                <i :class="labelIcon" class="ju-field-label-icon" v-if="labelIcon"></i>
                <template v-if="label">
                    <span v-text="label" v-if="labelAlign!=='justify'"></span>
                    <template v-else>
                        <span v-text="item" :key="index" v-for="(item,index) in label"></span>
                    </template>
                </template>
            </label>
            <view class="ju-field-content">
                <input :password="type==='password'"
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
            mode: {
                type: String,
                default: "default"
            },
            id: {
                type: String,
                default: ""
            },
            labelIcon: {
                type: String,
                default: ""
            },
            labelAlign: {
                type: String,
                default: "left"
            },
            labelWidth: {
                type: String,
                default: "100rpx"
            },
            placeholder: {
                type: String,
                default: ""
            },
            value: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: "text"
            },
            name: {
                type: String,
                default: ""
            },
            maxlength: {
                type: Number | String,
                default: 140
            },
            border: {
                type: String | Boolean,
                default: "#eee"
            },
            label: {
                type: String,
                default: ""
            },
            required: {
                type: Boolean,
                default: false
            },
            errorText: String,
            disabled: Boolean,
            cursorSpacing: Number,
            placeholderStyle: String,
            focus: Boolean,
            confirmType: String,
            confirmHold: Boolean,
            cursor: Number,
            selectionStart: Number,
            selectionEnd: Number,
            adjustPosition: Boolean,
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
            }
        },
        data() {
            return {
                isFocus: false
            }
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
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "./_variable.scss";

    .ju-field {
        &-item {
            height: units(40);
            /*overflow: hidden;*/
            position: relative;

            .ju-field-container {
                &.has-border {
                    &::after, &::before {
                        content: "";
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

                    &::after {
                        width: 100%;

                    }

                    &::before {
                        width: 0;
                    }
                }

                &.is-cube {
                    border-radius: $border-radius;

                    &::after {
                        display: none;
                    }

                    background-color: $grey100;

                    .ju-field-label {
                        background-color: darken($grey100, 5%);
                    }
                }

                &.is-focus {
                    &::before {
                        z-index: 1;
                        width: 100%;
                        background-color: $primary;
                    }
                }

                &.is-error {
                    &::before {
                        width: 100%;
                        background-color: $danger;
                    }

                    .ju-field-label {
                        color: $danger;
                    }
                }
            }

            // 错误
            .error-wrap {
                z-index: 1;
                color: $danger;
                font-size: units(12);
                position: absolute;
                padding: units(5);
                background-color: rgba($danger, .2);
                bottom: 0;
                left: $border-radius/2;
                transform: translateY(120%);
                border-radius: $border-radius;
                box-shadow: units(1) units(3) units(2) rgba(#000, .3);

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    border: {
                        bottom: units(5) solid rgba($danger, .2);
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
            font-size: units(14);
            align-items: center;


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

            input {
                font-size: units(14);
                height: 100%;
                width: 100%;
                border: 0;
                padding: {
                    left: units(10);
                    right: units(10);
                }
            }
        }

        &-container {
            display: flex;
            align-items: center;
            @extend .ju-field-item;
            overflow: hidden;
        }
    }
</style>
