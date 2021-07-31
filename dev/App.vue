<template>
    <div id="app">
        <div 
            class="button" 
            v-for="(text, key) in selectors"
            :class="'-' + key"
            @click="postMessage(key)"
            :key="key">
            {{text}}
        </div>
    </div>
</template>
<script>
const MISSING_TYPO   = "缺少字級"
const INSTANCE       = "零組件"
const COMPONENT      = "組件"
const COMPONENT_SET  = "群組組件"
const TEXT           = "文字"
const HIDE           = "隱藏"
const IMAGE          = "含有圖片"
const RECTANGLE      = "矩形"
const POLYGON        = "三角形"
const LINE           = "線段"
const ELLIPSE        = "圓形"
const STAR           = "星形"
export default {
    data() {
        return {
            selectors: {MISSING_TYPO,INSTANCE,COMPONENT,COMPONENT_SET,TEXT,HIDE,IMAGE,RECTANGLE,POLYGON,LINE,ELLIPSE,STAR}
        }
    },
    mounted() {
        
    },
    methods: {
        postMessage(key) {
            parent.postMessage({ pluginMessage: key }, '*')
        }
    },
}
</script>
<style lang="scss">
    #app {
        @include size(100%);
        font-size: 16px;
        line-height: 1.2;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
    }
    .button {
        padding: 4px 5px;
        background-color: #ddd;
        text-align: center;
        border-radius: 4px;
        margin: 5px;
        font-weight: bold;
        cursor: pointer;
        --hover: #aaa;
       

        &.-INSTANCE {
            $color-now: rgb(128,104,255);
            background-color: lighten($color-now, 20%);
            --hover: rgb(128,104,255);
        }
        &.-COMPONENT,&.-COMPONENT_SET  {
            $color-now: rgb(123,100,255);
            background-color: lighten($color-now, 10%);
            --hover: rgb(123,100,255);
        }
        &:hover {
            background-color: var(--hover);
        }
    }
</style>