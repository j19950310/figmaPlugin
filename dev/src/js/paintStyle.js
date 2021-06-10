const TYPE = "PAINT"
const SOLID = "SOLID"

export function paintStyleToObject(paintStyle) {
    if (isSingleColorStyle(paintStyle)) {
        const {
            paints, name
        } = paintStyle
        const hex = rgbPercentToHex(paints[0].color)
        return Object.assign({},{name, hex})
    }
}

function isSingleColorStyle(style) {
    return (style.paints.length === 1) && (style.paints[0].type === SOLID)
}

function rgbPercentToHex(rgbObj) {
    const {r, g, b} = rgbObj
    function toBase16(num) {
        return Math.floor(num*255).toString(16).toUpperCase()
    }
    function fillZero(hexColor) {
        return hexColor.length == 1 ? `0${hexColor}` : hexColor
    }
    let red = toBase16(r)
    let green = toBase16(g)
    let blue = toBase16(b)
    return `#${fillZero(red)}${fillZero(green)}${fillZero(blue)}`
}