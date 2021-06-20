const UI_WIDTH = 300
const UI_HEIGHT = 500
const FILL_UI_HEIGHT = 75
// __html__ or __uiFiles__ 
function init() {
    figma.showUI(__html__)
    figma.ui.resize(UI_WIDTH, UI_HEIGHT)
    figma.ui.onmessage = messageHandler.bind({
        REPLACE_IMAGE: replaceFillImage
    })

    figma.on("selectionchange", selectionchange)
    selectionchange(getSelections())
}

function messageHandler(data) {
    if (!data.title | !data.content) { return }
    if(this[data.title]) {
        this[data.title](data.content)
    } else {
        throw new Error(`未註冊${data.title}這Function`)
    }
}

function postMessage(data) {
    figma.ui.postMessage(data)
}

function selectionchange() {
    // postMessage({title: 'selectionchange', content: getSelections()})
    invertImages(getSelections()).then((data) => {
        const fillNum = data.length
        const height = Math.max(FILL_UI_HEIGHT * fillNum + 100, UI_HEIGHT)
        figma.ui.resize(UI_WIDTH, Math.min(height, 1000))

        postMessage({
            title: 'SELECT_IMAGES',
            content: data
        })
    })
}

function getSelections() {
    return figma.currentPage.selection
}

function invertImages(selections) {
    const list = [...selections]
    const promiseList = []
    function mapGetImage(node) {
        if (node.fills) {
            node.fills.forEach(async (paint) => {
                if (paint.type === 'IMAGE') {
                    const hash = paint.imageHash
                    promiseList.push(requestFillImage(hash, node.id))
                }
            })
        }
        if (!node.children) return
        const childrenNum = node.children.length
        for (let index = 0; index < childrenNum; index++) {
            mapGetImage(node.children[index])
        }
    }
    list.map(mapGetImage)
    return Promise.all(promiseList)
}

async function requestFillImage(hash, id) {
    const image = figma.getImageByHash(hash)
    const bytes = await image.getBytesAsync()
    return {hash, bytes, id}
}

function replaceFillImage(data) {
    let currentSelections = getSelections()
    data.from.forEach((fillObj, fromIndex) => {
        const node = figma.getNodeById(fillObj.id)
        const nodeFills = [...node.fills]
        const fillIndex = nodeFills.findIndex(fill => {
            if (!fill.imageHash) return false
            return fill.imageHash === fillObj.hash
        })
        if(fillIndex !== -1) {
            const newPaint = JSON.parse(JSON.stringify(node.fills[fillIndex]))
            const hash = figma.createImage(data.to[fromIndex].buffer).hash
            newPaint.imageHash = hash
            nodeFills.splice(fillIndex, 1, newPaint)
            node.fills = nodeFills
            currentSelections = currentSelections.filter(selectNode => selectNode !== node)
        }
    })
    // 排除, 刷新
    figma.currentPage.selection = currentSelections
}

init()