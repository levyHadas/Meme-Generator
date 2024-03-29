'use strict';
var gCanvasState
resetCanvasModel()

function resetCanvasModel() {
    gCanvasState = {img: 'img/meme-imgs/patrick.jpg',
                    txt: [createTxtData('1'), createTxtData('2')]}       
}

function createTxtData(id) {
    return { id: id,
            content: '',
            color: 'white',
            font: 'impact',
            size: '3rem',
            align:'center',
            visible: true,
            default: true}
}

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

function getTxt(txtId) {
    return getTxtSettings(txtId, 'content')
}

function findTxtById(id) {
    var txt = gCanvasState.txt.find( (temp) => temp.id === id)
    return txt

}

function getVisibaleTxtId() {
    var visibleTxt = gCanvasState.txt.find(txt => txt.visible)
    if(!visibleTxt) return null
    return visibleTxt.id
}
function getHiddenTxtId() {
    var hiddenTxt = gCanvasState.txt.find(txt => (!txt.visible) && txt.default)
    if (!hiddenTxt) return null
    return hiddenTxt.id
}

function addTxtToModel() {
    var id = '' + (gCanvasState.txt.length + 1)
    gCanvasState.txt.push(createTxtData(id))
}

function deleteTxt(id) {
    var txts = gCanvasState.txt
    var idxToRemove = txts.findIndex(txt => txt.id === id)
    gCanvasState.txt.splice(idxToRemove,1)
    console.log(gCanvasState)
}

