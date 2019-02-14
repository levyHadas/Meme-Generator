var gCanvasState = {img: 'img/meme-imgs/patrick.jpg',
                    color: 'black',
                    font: 'Cursive',
                    size: '2rem'}



function setCurrTxtSets(property, value) {
    if (property !== 'size') gCanvasState[property] = value
    else  gCanvasState[property] = value + 'px'
}

function getCanvasState(property) {
    return gCanvasState[property]
}

function getMeme(id){

}

function resetCanvasState() {
    gCanvasState = {img: 'img/meme-imgs/patrick.jpg',
                    color: 'black',
                    font: 'Cursive',
                    size: '2rem'}
}