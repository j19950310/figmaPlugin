<template>
    <div id="app">
        <!-- typo -->
        <div class="title">
            Typo
        </div>
        <div class="button" tabindex="0" @click="copyTypoSCSS">
            Typo SCSS Variables
        </div>
        <div class="button" tabindex="0" @click="copyTypoSnippet">
            Typo VSCode Snippet
        </div>
        <div class="button -no-copy" tabindex="0" @click="catchMissingTypo">
            選取全部未設定Typo的文字
        </div>

        <!-- color -->
        <div class="title">
            Colors
        </div>
        <div class="button" tabindex="0" @click="copyColorSCSS">
            Colors SCSS Variables
        </div>
        <div class="button" tabindex="0" @click="copyColorSnippet">
            Colors VSCode Snippet
        </div>
        <div v-if="process" class="process-loading">
            等等...
        </div>
    </div>
</template>
<script>
import {toSassFormat} from '@/js/textStyle.js';
export default {
    data() {
        return {
            textStyles: [],
            replaceFont: '',
            process: false
        }
    },
    mounted() {
        this.$message.$on('get', ({title,content})=>{
            if (title === 'init') {
                const {textStyles, paintStyles}  = content
                this.textStyles = textStyles
                this.paintStyles = paintStyles
                console.log(paintStyles);
            } else if (title = 'process') {
                this.process = content
            }
        })
    },
    computed: {
        sassTypoObj() {
            return this.textStyles.map(toSassFormat)
        },
    },
    methods: {
        postMessage(data) {
            this.$message.post(data)
        },
        copyToClipboard(str) {
            const el = document.createElement('textarea');
            el.value = str;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        },
        copyTypoSCSS() {
            let str = `$typos:(`
            this.sassTypoObj.forEach((typo)=>{
                const key = Object.keys(typo)[0]
                const content = JSON.stringify(typo[key]).replaceAll('\"','')
                str += `'${key}':${content},`
            })
            str += ');'
            str = str.replaceAll(/\[|\]/gm, '')
            str = str.replaceAll(/\{/gm, '(')
            str = str.replaceAll(/\}/gm, ')')
            str += `

            @mixin typo($index) {
                @each $style-key, $style-value in map-get($typos, #{$index}) {
                    #{$style-key}: #{$style-value};
                }
            }
            `
            this.copyToClipboard(str)
        },
        copyTypoSnippet() {
            const typoNames = this.sassTypoObj.map((typo)=>Object.keys(typo)[0])
            const t = `
                "Typo Select": {
                "scope": "scss, vue",
                "prefix": "typo",
                "body": [
                    "@include typo('\${1|${typoNames.join(',')}|}');",
                ],
                "description": "與figma同步"
            },
            `
            this.copyToClipboard(t)
        },
        copyColorSCSS() {
            let str = `$colors: (`
            this.paintStyles.forEach((color)=>{
                if(color) {
                    str += `'${color.name}':${color.hex},`
                }
            })
            str += ');'
            str += `

                @function color($id) {
                    @return map-get($colors, $id);
                }
            `
            this.copyToClipboard(str)
        },
        copyColorSnippet() {
            const colorNames = this.paintStyles.filter(color=>!!color).map((color)=>color.name)
            const t = `
                "theme color": {
                "scope": "scss, vue",
                "prefix": "color",
                "body": [
                    "color('\${1|${colorNames.join(',')}|}');",
                ],
                "description": "與figma同步"
            },
            `
            this.copyToClipboard(t)
        },
        catchMissingTypo() {
            this.postMessage({title: 'catchMissingTypo'})
        }
    },
}
</script>
<style lang="scss">
    #app {
        font-size: 16px;
        padding: 20px;
    }
    .button {
        margin-bottom: 10px;
        padding: 20px;
        background: #ccc;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        position: relative;
        &:hover {
            background: black;
            color: white;
        }
        &:focus {
            &::after {
                opacity: 1;
            }
        }
        &::after {
            position: absolute;
            right: 20px;
            font-size: 10px;
            content: '已複製';
            opacity: 0;
        }
        &.-no-copy::after {
            display: none;
        }
    }
    .process-loading {
        background-color: #333;
        color: white;
        font-size: 50px;
        display: grid;
        place-items: center;
        position: fixed;
        top: 0;
        left: 0;
        @include size(100%);
    }
</style>