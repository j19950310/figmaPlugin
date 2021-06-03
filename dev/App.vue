<template>
    <div id="app">
        <main>
            <div style="display: flex">
                <label for="replace"></label>
                <input type="text" v-model="replaceFont" id="replace">
            </div>
            <div v-if="selectFontObj" class="selection-block-now" :style="selectFontStyle">
                {{ selectFontObj.characters }}
            </div>
            <div v-else class="selection-block-now">
                請選擇一個字體單位
            </div>
            <div v-if="selectFontObj && !selectFontObj.textStyleId" class="font-style-alert">
                此字體尚未歸納TextStyle !
            </div>
            <div class="font-style-button__list">
                <div 
                    v-for="style in textStyles" :key="style.id"
                    :class="{'-active': chooseStyleId === style.id}"
                    @click="chooseStyleId = style.id"
                    class="font-style-button" 
                >{{ style.name }}</div>
            </div>
            <div v-if="selectFontObj && chooseStyleId" class="font-style-request">
                <div @click="setStyle(true)" v-if="!selectFontObj.textStyleId" class="font-style-request__button">*取代畫面上所有<br>與此單位設定雷同的字體</div>
                <div @click="setStyle(false)" class="font-style-request__button">設定此字體為 {{ chooseStyleName }}</div>
            </div>
        </main>
    </div>
</template>
<script>
export default {
    data() {
        return {
            textStyles: [],
            replaceFont: '',
            selectFontObj: null,
            chooseStyleId: null,
        }
    },
    mounted() {
        this.bindFigmaMessageEvents()
    },
    computed: {
        selectFontStyle() {
            if (!this.selectFontObj) return {}
            const {
                fontFamily,
                fontWeight,
                fontSize,
                letterSpacing,
                lineHeight,
            } = this.selectFontObj

            return {
                fontFamily,
                fontWeight: fontWeight.toLowerCase(),
                fontSize: `${fontSize}px`,
                letterSpacing,
                lineHeight: `${lineHeight}px`,
            }
        },
        chooseStyleName() {
            const findStyle  = this.textStyles.find(style => (style.id === this.chooseStyleId))
            if (findStyle) return findStyle.name
            return '**請選擇**'
        },
    },
    methods: {
        bindFigmaMessageEvents() {
            this.$message.$on('get', (data)=>{
                const {title} = data
                if (title === 'textStyles') {
                    this.textStyles = data.content
                } else if (title === 'selectionChange') {
                    this.selectionHandler(data)
                }
            })
        },
        message(title, content) {
            this.$message.post({title, content})
        },
        selectionHandler(data) {
            const selections = data.content
            if (selections.length === 1) {
                const {
                    id,
                    textStyleId,
                    fontName: {family: fontFamily, style: fontWeight},
                    fontSize,
                    letterSpacing: {value: letterSpacing},
                    lineHeight: {value: lineHeight = 'auto'},
                    characters,
                    paragraphSpacing
                } = selections[0]
                this.selectFontObj = {
                    id,
                    textStyleId,
                    fontFamily,
                    fontWeight,
                    fontSize,
                    letterSpacing,
                    lineHeight,
                    characters,
                    paragraphSpacing
                }
                this.chooseStyleId = textStyleId || null
            } else {
                this.selectFontObj = null
            }
        },
        setStyle(isAll) {
            if (this.chooseStyleId) {
                const title = isAll ? 'setAllTextStyleByNode' : 'setTextStyleById'
                this.message(title, {
                    id: this.selectFontObj.id,
                    textStyleId: this.chooseStyleId
                })
            }
        }
    },
}
</script>
<style lang="scss">
    #app {
        font-size: 16px;
    }
    main {
        padding: 20px;
    }

    .selection-block-now {
        padding: 10px;
        border-radius: 10px;
        border: 1px dashed #ccc; 
    }

    .font-style {
        &-alert {
            color: red;
            margin-top: 20px;
            font-size: 14px;
        }
        &-button {
            background-color: #ccc;
            border-radius: 10px;
            margin-bottom: 10px;
            padding: 10px;
            font-weight: bold;
            cursor: pointer;
            &.-active {
                background-color: #9999FF;
            }
            &:hover {
                background-color: #000;
                color: #fff;
            }
            &__list {
                padding: 20px;
            }
        }
        &-request {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            &__button {
                display: flex;
                align-items: center;
                justify-content: center;
                &:first-child {
                    margin-right: 10px;
                }
                background-color: #ccc;
                border-radius: 10px;
                margin-bottom: 10px;
                padding: 10px;
                font-weight: bold;
                cursor: pointer;
                flex: 1 1 auto;
                width: 100px;
                text-align: center;
                &:hover {
                    background-color: #000;
                    color: #fff;
                }
            }
        }
    }
</style>