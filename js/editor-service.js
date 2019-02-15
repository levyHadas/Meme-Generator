
var gCanvasState
resetCanvasState()


function setImg(src) {
    gCanvasState.img = src
}

function getImgSrc() {
    return gCanvasState.img
}

function setTxtSettings(id, property, value) {
    var currTxt = findTxtById(id)
    if (property !== 'size') currTxt[property] = value
    else  currTxt[property] = value + 'px'
}

function getTxtSettings (id, property) {
    var currTxt = findTxtById(id)
    return currTxt[property]
}

function findTxtById(id) {
    return gCanvasState.txt.find( (temp) => temp.id === id)

}

function resetCanvasState() {
    gCanvasState = {img: 'img/meme-imgs/patrick.jpg',
                    txt: [createTxtData('top'), createTxtData('bottom')]}       
}

function createTxtData(id) {
    return { id: id,
            content: '',
            color: 'white',
            font: 'impact',
            size: '3rem'}
}