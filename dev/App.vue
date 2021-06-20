<template>
    <div id="app">
        <div class="fill-list">
            <fill 
                v-for="fill in fills" 
                :key="fill.hash"
                :content="fill.bytes"
            ></fill>
            <div v-if="fills.length > 0" class="fill-list__upload" @click="updateFillImage">替換</div>
        </div>
        <div class="file-upload">
            <draggable v-model="imageList">
                <transition-group>
                    <div 
                        v-for="(image, index) in imageList" :key="index"
                        :class="{'-unpaired': index >= fills.length }"
                        class="file-upload__item" 
                    >
                        <upload-image :content="image.url"/>
                        <div class="file-upload__item-remove" @click="removeUpload(index)">x</div>
                    </div>
                </transition-group>
            </draggable>
            <input class="file-upload__input" 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                id="input" 
                @change="fileUpload" 
                multiple>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import fill from '@/component/fill'
import image from '@/component/image'

export default {
    components: {fill, uploadImage: image, draggable},
    data() {
        return {
            fills: [],
            replaceFont: '',
            imageList: []
        }
    },
    computed: {
        willReplaceFill() {
            const num = Math.min(this.fills.length,this.imageList.length)
            if (num === 0) return null

            return {
                from: this.fills.slice(0, num),
                to: this.imageList.slice(0, num),
            }
        }
    },
    mounted() {
        this.$message.$on('get',this.getDataHandler)
    },
    methods: {
        getDataHandler(data) {
            if(!data) return
            if (data.title === 'SELECT_IMAGES') {
                this.selectImages(data.content)
            }
        },
        postMessage(data) {
            this.$message.post(data)
        },
        selectImages(content) {
            this.fills = content
        },
        fileUpload(e) {
            const files = this.$refs.fileInput.files
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const dataImage = {}
                const urlReader = new FileReader()
                const bufferReader = new FileReader()

                urlReader.onload = (e)=> {
                    dataImage.url = e.target.result
                };
                bufferReader.onload = (e)=> {
                    const buffer = e.target.result
                    dataImage.buffer = new Uint8Array(buffer)
                    this.imageList.push(dataImage)
                };
                urlReader.readAsDataURL(file);
                bufferReader.readAsArrayBuffer(file);
            }
        },
        removeUpload(index) {
            this.imageList.splice(index, 1)
        },
        updateFillImage() {
            const content = this.willReplaceFill
            this.postMessage({title:'REPLACE_IMAGE', content })
        }
    },
}
</script>
<style lang="scss">
$p-t: 50px;
#app {
    font-size: 100px;
    position: relative;
    display: flex;
}
.fill-list {
    flex: 0 0 50%;
    padding-top: $p-t;
    position: relative;
    &__upload {
        color: black;
        border: 1px solid;
        background-color: #ddd;
        font-size: 24px;
        line-height: 1.5;
        position: absolute;
        top: 0;
        left: 20px;
        cursor: pointer;
        &:hover {
            background-color: #ccc;
        }
    }
}
.file-upload {
    flex: 0 0 50%;
    padding-top: $p-t;
    position: relative;
    &__input {
        @include size(100%, 50px);
        position: absolute;
        top: 0;
        left: 0;
    }
    &__item {
        cursor: grab;
        position: relative;
        &:hover {
            .file-upload__item-remove {
                opacity: 1;
            }
        }
        &.-unpaired {
            filter: grayscale(80%);
            opacity: 0.3;
        }
        .image {
            margin: 0 auto;
        }
        &-remove {
            opacity: 0;
            position: absolute;
            z-index: 1;
            cursor: pointer;
            @include size(45px);
            display: flex;
            justify-content: center;
            transform: translateY(-50%);
            border: 1px solid black;
            align-items: center;
            right: 4px;
            top: 50%;
            background-color: #fff;
            border-radius: 50%;
            font-size: 24px;
            line-height: 2;
        }
    }
}
</style>