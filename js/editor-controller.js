
'use strict';
var gCtx


initCanvas()

function initCanvas() {
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    resizeCanvas(canvas)
    drawImg()
    renderTxt()
    // setCanvasBgColor(canvas.width, canvas.height)
}

// function setCanvasBgColor(width, height, color = 'white') {
//     gCtx.beginPath()
//     gCtx.fillStyle = color
//     gCtx.fillRect(0, 0, width, height)
//     gCtx.closePath()
// }


function resizeCanvas(canvas) {
    var elCanvasContainer = document.querySelector('.canvas-container')
    canvas.width = elCanvasContainer.offsetWidth
    canvas.height = elCanvasContainer.offsetHeight
}

function drawImg(imgSrc = 'img/meme-imgs/004.jpg') {

    document.querySelector('.canvas-img').src =  imgSrc
    var elImg = document.querySelector('.canvas-img')
    
    var imgObj = new Image();
    imgObj.src= imgSrc;
    var canvas = document.querySelector('#meme-canvas')
    var ratio = imgObj.height / imgObj.width
    imgObj.width = canvas.width
    imgObj.height = imgObj.width*ratio
    var yPos = canvas.height/2 - imgObj.height/2

    gCtx.drawImage(elImg, 0, yPos, imgObj.width, imgObj.height)
}

function renderTxt(txt = '') {
    var elTextPlace = document.querySelector('.meme-text') 
    elTextPlace.innerText = txt;
    elTextPlace.style.color = getCurrTxtSets('color')
    elTextPlace.style.font = `${getCurrTxtSets('size')} ${getCurrTxtSets('font')}`
}

function onStartTyping() {
    gCtx.beginPath()
}

function onTextEdit(txt) {
    renderTxt(txt)
}
function onDisplayChange(elTxtDisplay) {
    var changeType = elTxtDisplay.dataset.type
    var ChangeVal = elTxtDisplay.value
    setCurrTxtSets(changeType, ChangeVal)
    submitChange()
}

function submitChange() {
    var txt = document.querySelector('.meme-text').innerText
    renderTxt(txt) 
}

function downloadImg(elLink) {
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}















// function drawText(txt = '') {
//     gCtx.font = '30px Cursive'
//     gCtx.textAlign = 'left';
//     gCtx.fillStyle = 'red'
//     gCtx.fillText(txt, 30, 30);
//     gCtx.strokeText(txt, 30, 30);
// }
