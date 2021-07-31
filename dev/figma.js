const SHOW_UI = 'SHOW_UI'
const MISSING_TYPO = 'MISSING_TYPO'
const IMAGE = 'IMAGE'
const INSTANCE = 'INSTANCE'
const COMPONENT = 'COMPONENT'
const COMPONENT_SET = 'COMPONENT_SET'
const TEXT = 'TEXT'
const HIDE = 'HIDE'
const VECTOR = 'VECTOR'
const RECTANGLE = 'RECTANGLE'
const POLYGON = 'POLYGON'
const LINE = 'LINE'
const ELLIPSE = 'ELLIPSE'
const STAR = 'STAR'

const uiOption = {
    width: 120,
    height: 500
}
// __html__ or __uiFiles__ 
// figma.showUI(__html__) // 純Figma Code

// console.log(figma.command);
function init() {
    commandHandler(figma.command)
}

function commandHandler(command) {
    switch (command) {
        case SHOW_UI: 
            figma.showUI(__html__)
            initUiListener()
        break
        case MISSING_TYPO: 
            catchMissingTypoHandler()
        break
        case INSTANCE:
            selectAllNodeType(INSTANCE)
        break
        case COMPONENT:
            selectAllNodeType(COMPONENT)
        break
        case COMPONENT_SET:
            selectAllNodeType(COMPONENT_SET)
        break
        case VECTOR:
            selectAllNodeType(VECTOR)
        break
        case RECTANGLE:
            selectAllNodeType(RECTANGLE)
        break
        case POLYGON:
            selectAllNodeType(POLYGON)
        break
        case LINE:
            selectAllNodeType(LINE)
        break
        case ELLIPSE:
            selectAllNodeType(ELLIPSE)
        break
        case STAR:
            selectAllNodeType(STAR)
        break
        case TEXT:
            selectAllNodeType(TEXT)
        break
        case IMAGE:
            selectAllImage()
        break
        case HIDE:
            selectAllHide()
        break
        default:
        break;
    }

    if (figma.command !== SHOW_UI) {
        figma.closePlugin()
    }
}

function select(arr) {
    figma.currentPage.selection = arr || []
}

function selectAllNodeType(type, selections = figma.currentPage.selection) {
    let targetSelect = null
    if (selections.length === 0) {
        targetSelect = figmaFindAllType(type)
    } else {
        targetSelect = searchSelectionsAllNodeType(type, selections)
    }
    select(targetSelect)
}

function selectAllImage() {
    const selections = [...figma.currentPage.selection]
    let targetSelect = []
    if (selections.length === 0) {
        targetSelect = figma.currentPage.findAll(node => hasImageFill(node.fills))
    } else {
        function mapSearch(node) {
            if(hasImageFill(node.fills)) {
                targetSelect.push(node)
            } else if (node.children) {
                node.children.forEach(mapSearch)
            }
        }
        while(selections.length > 0) {
            const searchNode = selections.shift()
            mapSearch(searchNode)
        }
    }
    select(targetSelect)
}

function selectAllHide() {
    const selections = [...figma.currentPage.selection]
    let targetSelect = []
    if (selections.length === 0) {
        targetSelect = figma.currentPage.findAll(node => (!node.visible))
    } else {
        function mapSearch(node) {
            if(!node.visible) {
                targetSelect.push(node)
            } else if (node.children) {
                node.children.forEach(mapSearch)
            }
        }
        while(selections.length > 0) {
            const searchNode = selections.shift()
            mapSearch(searchNode)
        }
    }
    select(targetSelect)
}

function figmaFindAllType(type) {
    return figma.currentPage.findAll(n => n.type === type)
}

function searchSelectionsAllNodeType(type, selections) {
    const searchArr = [...selections]
    const targets = []
    function mapSearch(node) {
        if(node.type === type) {
            targets.push(node)
        } else if (node.children) {
            node.children.forEach(mapSearch)
        }
    }

    while(searchArr.length > 0) {
        const searchNode = searchArr.shift()
        mapSearch(searchNode)
    }

    return targets
}

function hasImageFill(fills) {
    if (!fills || !Array.isArray(fills)) return false
    return !!fills.find(fill => fill.type === IMAGE)
}

function catchMissingTypoHandler() { // TODO
    let selections = figma.currentPage.selection
    const textStylesId = figma.getLocalTextStyles().map(style => style.id)
    const missingStyleFonts = figma.currentPage.findAll(n => {
        if(n.type !== "TEXT") return false
        return !n.textStyleId | !textStylesId.includes(n.textStyleId)
    })
    if (selections.length === 0) {
        targetSelect = figmaFindAllType(type)
    } else {
        targetSelect = searchSelectionsAllNodeType(type, selections)
    }
    select(targetSelect)
    select(missingStyleFonts)
}

init()

// -----UI------
function initUiListener() {
    figma.ui.on('message', commandHandler)
    figma.ui.resize(uiOption.width, uiOption.height)
}
