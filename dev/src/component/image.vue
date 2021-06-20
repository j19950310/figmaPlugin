<template>
    <img class="image" 
        :src="content" 
        @load="onLoad" 
        alt="">
</template>
<script>
export default {
    props: {
        content: {
            type: String,
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
    },
    methods: {
        onLoad(e) {
            
        },
    },
}
</script>
<style lang="scss">
.image {
    // @include size(100px);
    display: block;
    width: auto;
    height: 75px;
}
</style>