
// __html__ or __uiFiles__ 
figma.showUI(__html__)
figma.ui.resize(500, 900)
figma.ui.onmessage = (message) => {
    const { title, content } = message
    const { id, textStyleId } = content
    switch (title) {
        case 'setTextStyleById':
            const single = figma.currentPage.findOne(n => n.id === id)
            setAllTextStyleId(single, textStyleId)
            break;
        case 'setAllTextStyleByNode':
            const target = figma.currentPage.findOne(n => n.id === id)
            if (target) {
                const nodeList = figma.currentPage.findAll(n => compareIsSameTextStyle(n, target))
                nodeList.forEach(node => {setAllTextStyleId(node, textStyleId)})
            } else {
                throw new Error(`找不到id為 ${id} 的 node`)
            }
        break;
        default:
        break;
    }
    selectionChange()
}
figma.ui.postMessage({
    title: 'textStyles',
    content: figma.getLocalTextStyles().map(style => {
        const {name, id} = style
        return {name, id}
    })
})

figma.on("selectionchange", selectionChange)

function selectionChange() {
    figma.ui.postMessage({
        title: 'selectionChange',
        content: figma.currentPage.selection.map(convertSelectionInfo)
    })
}


function convertSelectionInfo (selected) {
    const {type, name, id} = selected
    const obj = {type, name, id}
    if (type === 'TEXT') {
        const {
            textStyleId,
            fontName,
            fontSize,
            letterSpacing,
            lineHeight,
            paragraphSpacing,
            characters
        } = selected
        Object.assign(obj,{ 
            characters,
            textStyleId,
            fontName,
            fontSize,
            letterSpacing,
            lineHeight,
            paragraphSpacing
        })
        // stringifyFontProp
    }
    return obj
}

function stringifyFontProp(textNode) {
    const {
        // textStyleId,
        fontName,
        fontSize,
        letterSpacing,
        lineHeight,
        paragraphSpacing
    } = textNode

    return JSON.stringify({
        // textStyleId,
        fontName,
        fontSize,
        letterSpacing,
        lineHeight,
        paragraphSpacing
    });
}

function setAllTextStyleId(node, id) {
    const END = node.characters.length
    node.setRangeTextStyleId(0, END, id)
}

function compareIsSameTextStyle(n1, n2) {
    // if(n1.textStyleId || n2.textStyleId) return false // figma BUG
    return stringifyFontProp(n1) === stringifyFontProp(n2)
}