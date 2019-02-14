
'use strict';
var gCtx


// initCanvas()
function initEditor(meme) {
    var imgSrc = meme.src
    resetCanvasState()
    initCanvas(imgSrc)
}

function initCanvas(src = 'img/meme-imgs/patrick.jpg') {
    setCanvasState('img', src)
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    drawImg()
    resizeCanvas(canvas)
    renderTxt()
}


function drawImg() {
    var imgSrc = getCanvasState('img')
    document.querySelector('.canvas-img').src =  imgSrc
    var elImg = document.querySelector('.canvas-img')
    var canvas = document.querySelector('#meme-canvas')
    elImg.onload = function(){
        gCtx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    }
}


function resizeCanvas(canvas) {
    var elCanvasContainer = document.querySelector('.canvas-container')
    setCanvasContainerSize(elCanvasContainer)
    canvas.width = elCanvasContainer.offsetWidth
    canvas.height = elCanvasContainer.offsetHeight
}

function setCanvasContainerSize(elCanvasContainer) {
    var imgSrc = getCanvasState('img')
    var imgObj = new Image();
    imgObj.src= imgSrc;
    //we want to make the img as big as we can, will still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height/imgObj.width : imgObj.width/imgObj.height
    elCanvasContainer.style.height = `${elCanvasContainer.clientWidth*ratio}px`
}


function renderTxt(txt = '') {
    var elTextPlace = document.querySelector('.meme-text') 
    elTextPlace.innerText = txt;
    elTextPlace.style.color = getCanvasState('color')
    elTextPlace.style.font = `${getCanvasState('size')} ${getCanvasState('font')}`
}

function onStartTyping() {
    gCtx.beginPath()
}

function onTextEdit(txt) {
    renderTxt(txt)
    //add text to model
}

function onDisplayChange(elTxtDisplay) {
    var changeType = elTxtDisplay.dataset.type
    var ChangeVal = elTxtDisplay.value
    setCanvasState(changeType, ChangeVal)
    submitChange()
}

function submitChange() {
    var txt = document.querySelector('.meme-text').innerText
    //TODO: take txt from model instead of dom
    renderTxt(txt) 
}

function downloadImg(elLink) {
    addTextToCanvas()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
}

function addTextToCanvas() {
    var txt = document.querySelector('.meme-text').innerText
    gCtx.font = `${getCanvasState('size')} ${getCanvasState('font')}`
    gCtx.fillStyle = getCanvasState('color')
    //need to set position and shadow
    //need to get div location
    var xLocation = 30 //left point where text start
    var yLocation = 30 //bottom point where text start
    gCtx.fillText(txt, xLocation, yLocation);
}


// reset input text when new pic
// add more text
// move text
//Align left, right, center


// navigation + hide show
// add share
// shadow 

// render fonts to select from js
//move control panel in editor to side in desktop - css container of control panel
//css control panel

//delete line

//change font size to range
//change text lines way of rendering
// add painter