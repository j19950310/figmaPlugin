<template>
    <img class="fill" 
        :src="src" 
        @load="onLoad" 
        alt="">
</template>
<script>
export default {
    props: {
        content: {
            type: Uint8Array
        },
        max: {
            type: Number,
            default: 150
        }
    },
    data() {
        return {
            src: '',
        }
    },
    mounted() {
        this.src = URL.createObjectURL(new Blob([this.content.buffer], { type: 'image/png' }))
    },
    methods: {
        onLoad(e) {
            // this.$nextTick(()=>{
            //     const height = this.$el.height
            //     const width = this.$el.width
            //     const MAX = this.max
            //     const ratio = MAX / Math.max(width, height)
            //     this.$el.width = ratio * width
            //     this.$el.height =ratio * height
            // })
        }
    },
}
</script>
<style lang="scss">
.fill {
    display: block;
    width: auto;
    height: 75px;
}
</style>