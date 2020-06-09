<template>
    <web-view :src="src"></web-view>
</template>
<script>
    export default {
        data() {
            return {
                src: ''
            }
        },
        onLoad(opt) {
            this.src = opt.src
        }
    }
</script>
