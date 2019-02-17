'use strict';
var gCtx
var gNumOfTxtLines = 2
var gDragState = {isDragging: false, clickPos: {x: 0, y: 0}, dragStartPos: {left: 0, top: 0}}
var gInFocusTxtId

function initEditor(meme) {
    var elTxts = document.querySelectorAll('.meme-txt')
    elTxts.forEach(txt => txt.classList.remove('hidden'))
    var imgSrc = meme.src
    var txts = document.querySelectorAll('.meme-txt')
    txts.forEach((txt) => txt.innerText = '')
    resetCanvasState()
    initCanvas(imgSrc)
    setInFocusTxt('1')
}

function setInFocusTxt(txtId) {
    var eTxt = document.querySelector(`.meme-txt[data-id="${txtId}"]`)
    eTxt.focus()
    gInFocusTxtId = txtId
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
    setRelativeHeights()
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

function setRelativeHeights() {
    var elCanvasContainer = document.querySelector('.canvas-container')
    var containerHeight = elCanvasContainer.offsetHeight
    document.querySelector('[data-id="2"]').style.top = (0.85 * containerHeight) + 'px' 
    document.querySelector('.flex-container').style.height = (containerHeight) + 'px'
}


function renderTxt(txtId, txt = null) {
    if (txtId === '1') var elTextPlace = document.querySelector('[data-id="1"]')
    else var elTextPlace = document.querySelector('[data-id="2"]')
    if (txt) elTextPlace.innerText = txt;
    elTextPlace.style.color = getTxtSettings(txtId, 'color');
    elTextPlace.style.font = `${getTxtSettings(txtId, 'size')}/100% ${getTxtSettings(txtId, 'font')}`;
    elTextPlace.style.height = getTxtSettings(txtId, 'size');
    elTextPlace.style.textAlign = getTxtSettings(txtId, 'align');
}


function onEndTyping(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    var txt = elTxtInput.innerText
    setTxtSettings(txtId, 'content', txt)
}

function onTxtEdit(elTxtInput) {
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
        var font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
        gCtx.font = font
        gCtx.fillStyle = getTxtSettings(txtId, 'color')
        gCtx.shadowColor = '#000000'
        gCtx.shadowBlur = 1;
        gCtx.textBaseline = 'bottom'
        var xLocation = elTxts[i].offsetLeft
        var yLocation = elTxts[i].offsetTop + elTxts[i].offsetHeight - 55 //padding
        if (getTxtSettings(txtId, 'align') === 'center') xLocation += elTxts[i].offsetWidth / 2 - getTxtWidth(txt, font) / 2
        else if (getTxtSettings(txtId, 'align') === 'right') xLocation += elTxts[i].offsetWidth - getTxtWidth(txt, font)
        gCtx.fillText(txt, xLocation, yLocation);
        console.log(gCtx);

    }
}

function onDelete() {
    var elTxt = document.querySelector(`.meme-txt[data-id="${gInFocusTxtId}"]`)
    elTxt.classList.add('hidden')
    elTxt.innerText = ''
    setTxtSettings(gInFocusTxtId, 'content','')
    //set focus to remaining text
    if (gInFocusTxtId === '1') setInFocusTxt('2') 
    else setInFocusTxt('1') 
}

function onAdd() {
    if (gInFocusTxtId === '1') var newTxtId ='2' 
    else var newTxtId ='1' 
    var elTxt = document.querySelector(`.meme-txt[data-id="${newTxtId}"]`)
    elTxt.classList.remove('hidden')
    setInFocusTxt(newTxtId)
}

function getTxtWidth(txt, font) {
    var canvas = document.querySelector('#help-canvas')
    var ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.fillText(txt, 0, 0);
    return ctx.measureText(txt).width
}

function moveTxt(direction) {
    var txt = document.querySelector(`.meme-txt[data-id="${gInFocusTxtId}"]`)
    switch (direction) {
        case 'left':
            var currPos = txt.offsetLeft
            txt.style.left = currPos - 4 + 'px'
            break
        case 'right':
            var currPos = txt.offsetLeft
            txt.style.left = currPos + 4 + 'px'
            break
        case 'up':
            var currPos = txt.offsetTop
            txt.style.top = currPos - 4 + 'px'
            break
        case 'down':
            var currPos = txt.offsetTop
            txt.style.top = currPos + 4 + 'px'
            break
    }
}

function onStartDrag(ev, el) {
    console.log('start drag');
    // debugger;
    gDragState.isDragging = true;
    gDragState.dragStartPos.left = el.offsetLeft;
    gDragState.dragStartPos.top = el.offsetTop;
    gDragState.clickPos.x = ev.clientX;
    gDragState.clickPos.y = ev.clientY;
}

function onDrag(ev, el) {
    // console.log('drag');
    // debugger;
    if (gDragState.isDragging) {
        var xChange = ev.clientX - gDragState.clickPos.x;
        var yChange = ev.clientY - gDragState.clickPos.y;
        // console.log((el.offsetTop - yChange) + '');
        
        el.style.top = (gDragState.dragStartPos.top + yChange) + 'px';
        el.style.left = (gDragState.dragStartPos.left + xChange) + 'px';
        
        // console.log(xChange);
    }
}

function onStopDrag(el) {
    console.log('stop drag');

    gDragState.isDragging = false;
}

function allowDrop(ev) {
    ev.preventDefault();
}






//TODO: arrange functions in logical order






//Move Text with arrows
//change font size to range
//add painter
//more than 2 text



function onBackToGallery() {
    document.querySelector('section.editor').classList.add('hide');
    document.querySelector('section.gallery').classList.remove('hide');
}