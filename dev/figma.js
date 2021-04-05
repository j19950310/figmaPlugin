// __html__ or __uiFiles__ 
figma.showUI(__html__)
figma.ui.onmessage = (message) => {
    console.log(message);
}
figma.on("selectionchange", () => { console.log("changed") })
