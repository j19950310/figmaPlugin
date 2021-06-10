import { textStyleToObject } from '@/js/textStyle.js';
import { paintStyleToObject } from '@/js/paintStyle.js';
function initFigma() {
    // __html__ or __uiFiles__ 
    figma.showUI(__html__)
    figma.ui.resize(500, 500)
    figma.ui.onmessage = messageHandler.bind({
        catchMissingTypo: catchMissingTypoHandler
    })

    figma.ui.postMessage({
        title: 'init', 
        content: {
            textStyles: figma.getLocalTextStyles().map(textStyleToObject),
            paintStyles: figma.getLocalPaintStyles().map(paintStyleToObject)
        }
    })
}

function messageHandler({title, content}) {
    try {
        this[title](content)
    } catch (error) {
        throw error
        
    }
}
function catchMissingTypoHandler() {
    figma.ui.postMessage({
        title: 'process', 
        content: true
    })
    const textStylesId = figma.getLocalTextStyles().map(style => style.id)
    const missingStyleFonts = figma.currentPage.findAll(n => {
        if(n.type !== "TEXT") return false
        return !n.textStyleId | !textStylesId.includes(n.textStyleId)
    })
    figma.currentPage.selection = missingStyleFonts
    figma.ui.postMessage({
        title: 'process', 
        content: false
    })
}

initFigma()