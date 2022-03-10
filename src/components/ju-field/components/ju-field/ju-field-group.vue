<template>
    <view class="ju-field-group">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: "ju-input-group",
        provide() {
            return {
                fieldGroup: this
            }
        },
        props: {
            labelWidth: String,
            labelAlign: {type:String,default:'left'},
            colon: Boolean,
        }
    }
</script>

<style scoped lang="scss">
    @import "./_variable.scss";

    .ju {
        &-field {
            &-item {
                margin-bottom: 0 !important;
            }

            &-group {
                position: relative;
                padding: 0 units(15);

                &::after,
                &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background-color: $border-color;
                }

                &::before {
                    top: 0;
                }

                &::after {
                    bottom: 1px;
                }
            }
        }
    }
</style>
