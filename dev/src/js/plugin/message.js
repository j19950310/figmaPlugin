import Vue from 'vue'
const message = new Vue({
    methods: {
        get(e) {
            const { pluginMessage: data } = e.data
            this.$emit('get', data)
        },
        post(data) {
            parent.postMessage({ pluginMessage: data }, '*')
        }
    }
})

onmessage = message.get

export default function (Vue, options) {
    Vue.prototype.$message = message
}