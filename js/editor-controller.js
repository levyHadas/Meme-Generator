
'use strict';
var gCtx


// initCanvas()

function initCanvas(src = 'img/meme-imgs/patrick.jpg') {
    setCurrTxtSets('img', src)
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    drawImg()
    resizeCanvas(canvas)
    renderTxt()
}



function resizeCanvas(canvas) {
    var elCanvasContainer = document.querySelector('.canvas-container')
    setCanvasContainerSize(elCanvasContainer)
    canvas.width = elCanvasContainer.offsetWidth
    canvas.height = elCanvasContainer.offsetHeight
}
function setCanvasContainerSize(elCanvasContainer) {
    var imgSrc = getCurrTxtSets('img')
    var imgObj = new Image();
    imgObj.src= imgSrc;
    //we want to make the img as big as we can, will still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height/imgObj.width : imgObj.width/imgObj.height
    elCanvasContainer.style.height = `${elCanvasContainer.clientWidth*ratio}px`
  
}

function drawImg() {
    gCtx.fillText('jfaskfnajksnfdkjnaskjdnfkjsandflkjnaskjnfkjladsnjfnkjsnfl', 30, 30);

    var imgSrc = getCurrTxtSets('img')
    document.querySelector('.canvas-img').src =  imgSrc
    var elImg = document.querySelector('.canvas-img')
    var canvas = document.querySelector('#meme-canvas')
    elImg.onload = function(){
        gCtx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    }
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
    addTextToCanvas()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
}

function addTextToCanvas() {
    var txt = document.querySelector('.meme-text').innerText
    gCtx.font = `${getCurrTxtSets('size')} ${getCurrTxtSets('font')}`
    gCtx.fillStyle = getCurrTxtSets('color')
    //need to set position and shadow
    gCtx.fillText(txt, 30, 30);
}
