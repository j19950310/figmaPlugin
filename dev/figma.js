// __html__ or __uiFiles__ 
figma.showUI(__html__)
figma.ui.resize(500, 500)
figma.ui.onmessage = (message) => {
    console.log(message);
}

figma.ui.postMessage({title: '項目', content: '資料'})

