
'use strict';
var gCtx
var gNumOfTxtLines = 2
var gInFocusTxtId = '1'

function initEditor(meme) {
    var imgSrc = meme.src
    var txts = document.querySelectorAll('.meme-txt')
    txts.forEach((txt) => txt.innerText = '  ')
    resetCanvasState()
    initCanvas(imgSrc)
    document.querySelector('.meme-txt.txt-1').focus()
}

function setInFocusTxtId(txtContainer) {
    gInFocusTxtId = txtContainer.firstElementChild.dataset.id
}

function initCanvas(src = 'img/meme-imgs/patrick.jpg') {
    setImg(src)
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    drawImg()
    resizeCanvas(canvas)
}


function drawImg() {
    var imgSrc = getImgSrc()
    document.querySelector('.canvas-img').src = imgSrc
    var elImg = document.querySelector('.canvas-img')
    var canvas = document.querySelector('#meme-canvas')
    elImg.onload = function () {
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
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    //we want to make the img as big as we can, will still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height / imgObj.width : imgObj.width / imgObj.height
    elCanvasContainer.style.height = `${elCanvasContainer.clientWidth * ratio}px`
}


function renderTxt(txtId, txt = null) {
    if (txtId === '1') var elTextPlace = document.querySelector('.txt-1')
    else var elTextPlace = document.querySelector('.txt-2')
    if (txt) elTextPlace.innerText = txt;
    elTextPlace.style.color = getTxtSettings(txtId, 'color');
    elTextPlace.style.font = `${getTxtSettings(txtId, 'size')}/100% ${getTxtSettings(txtId, 'font')}`;
    elTextPlace.style.height = getTxtSettings(txtId, 'size');
}


function onEndTyping(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    var txt = elTxtInput.innerText
    setTxtSettings(txtId, 'content', txt)
}

function onTextEdit(elTxtInput) {
    document.querySelector('.editable-txt').style.border = 'none'
    var txtId = elTxtInput.dataset.id
    renderTxt(txtId)
}

function onDisplayChange(elTxtDisplay) {
    var changeType = elTxtDisplay.dataset.type
    var ChangeVal = elTxtDisplay.value
    setTxtSettings(gInFocusTxtId, changeType, ChangeVal)
    submitChange(gInFocusTxtId)
}

function submitChange(txtId) {
    var txt = getTxt(txtId)
    renderTxt(txtId, txt)
}

function getTxt(txtId) {
    return getTxtSettings(txtId, 'content')
}

function downloadImg(elLink) {
    addCanvasTxt()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/png');
    elLink.href = imgContent
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
}

function resizeCanvasForDownload(canvas) {
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    canvas.width = imgObj.width
    canvas.height = imgObj.height
}

function addCanvasTxt() {
    var elTxts = document.querySelectorAll('.meme-txt')
    for (let i = 0; i < gNumOfTxtLines; i++) {
        var txtId = (i + 1) + ''
        var txt = getTxt(txtId)
        gCtx.fillStyle = getTxtSettings(txtId, 'color')
        gCtx.font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
        gCtx.shadowColor = '#000000'
        gCtx.shadowBlur = 1;
        var xLocation = elTxts[i].offsetLeft
        var yLocation = elTxts[i].offsetTop + elTxts[i].offsetHeight
        gCtx.fillText(txt, xLocation, yLocation);
    }
}

function onDelete(elTxt) {
    elTxt.parentElement.style.display= 'none'
    setTxtSettings(elTxt.dataset.id, 'content')
}






//Hadas:
// reset input text when new pic - done
// add more text
// move text
//Align left, right, center

// Yanai
// navigation + hide show
// add share
// shadow 
// render fonts to select from js



// move control panel in editor to side in desktop - css container of control panel
// css control panel

//delete line

//change font size to range
//change text lines way of rendering
// add painter







































// function dragStart(event) {
//     event.dataTransfer.setData("Text", event.target.id);
//   }
// function allowDrop(event) {
//     event.preventDefault();
//   }

//   function drop(event) {
//     event.preventDefault();
//     var data = event.dataTransfer.getData("Text");
//     console.log(data)
//     // event.target.appendChild(document.getElementById(data));
//   }

// function onBackToGallery() {
//     document.querySelector('section.editor').classList.add('hide');
//     document.querySelector('section.gallery').classList.remove('hide');
// }