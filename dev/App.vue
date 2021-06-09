<template>
    <div id="app">
        <div style="display: flex">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            textStyles: [],
            replaceFont: ''
        }
    },
    mounted() {
        this.$message.$on('get', (data)=>{
            console.log(data);
            // if (data.title === 'doSomething') {
            //     console.log(data.content)
            // }
        })
        this.postMessage()
    },
    methods: {
        postMessage(data) {
            this.$message.post(data)
        }
    },
}
</script>
<style lang="scss">
    #app {
        font-size: 100px;
    }
</style>