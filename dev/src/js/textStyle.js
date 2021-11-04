const FONT_WEIGHT = {
    Thin: 100,
    DemiLight: 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    Bold: 700,
    Black: 900
}

export function textStyleToObject(textStyle) {
    const {
        fontSize,
        letterSpacing,
        lineHeight,
        fontName,
        name,
        paragraphIndent,
        paragraphSpacing
    } = textStyle
    return Object.assign({},{
        name,
        fontSize,
        letterSpacing,
        lineHeight,
        fontName,
        paragraphIndent,
        paragraphSpacing
    })
}

export function toSassFormat(obj) {
    const utilsObj = {}
    const sassObj = {}
    let name = ''
    Object.keys(obj).forEach((key)=>{
        const value = obj[key]
        switch (key) {
            case 'name':
                name = value
                sassObj[name] = {}
                utilsObj[name] = {}
                break
            case 'fontSize':
                if(typeof value !== "number"){
                    console.log('fontSize type',typeof value);
                }
                utilsObj[name]['font-size'] = value
                sassObj[name]['font-size'] = `${value}px`
                break
            case 'lineHeight':
                if(value.unit === 'PIXELS') {
                    const ratio = value.value / utilsObj[name]['font-size']
                    sassObj[name]['line-height'] = +(ratio).toFixed(2)
                } else if(value.unit === 'PERCENT') {
                    sassObj[name]['line-height'] = +(value.value/100).toFixed(2)
                } else if ( value.unit === 'AUTO') {
                    sassObj[name]['line-height'] = 'auto'
                } else {
                    console.error('lineHeight沒發現過的單位', value.unit);
                }
                break
            case 'letterSpacing':
                if(value.unit === 'PIXELS') {
                    sassObj[name]['letter-spacing'] = `${value.value}px`
                } else if(value.unit === 'PERCENT') {
                    sassObj[name]['letter-spacing'] = `${value.value/100}em`
                } else if ( value.unit === 'AUTO') {
                    sassObj[name]['letter-spacing'] = 'auto'
                } else {
                    console.error('letterSpacing沒發現過的單位', value.unit);
                }
            case 'fontName':
                sassObj[name]['font-family'] = `'${value.family}'`
                sassObj[name]['font-weight'] = FONT_WEIGHT[value.style]
                break
            case 'paragraphIndent':
                sassObj[name]['text-indent'] = `${value}px`
                break
        }
    })
    return sassObj
}
