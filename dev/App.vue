<template>
    <div id="app">
        <div style="display: flex">
            <label for="replace"></label>
            <input type="text" v-model="replaceFont" id="replace">
        </div>
        <button v-for="style in textStyles" :key="style.id">{{style.name}}</button>
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
            if (data.title === 'textStyles') {
                this.textStyles = data.content
            }
        })
    },
    methods: {
        message() {
            parent.postMessage({ 
                pluginMessage: 'anything here' 
            }, '*')
             parent.postMessage({ 
                test: '123' 
            }, '*')
        }
    },
}
</script>
<style lang="scss">
    #app {
        font-size: 100px;
    }
</style>