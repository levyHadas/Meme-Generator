'use strict';
var gCtx
var gNumOfTxtLines = 2
var gDragState = { isDragging: false, clickPos: { x: 0, y: 0 }, dragStartPos: { left: 0, top: 0 } }
var gInFocusTxtId

function initEditor(meme) {
    var imgSrc = meme.src
    resetCanvasState()
    resetTxtBoxs()
    initCanvas(imgSrc)
    setInFocusTxt('1')
}

function resetTxtBoxs() {
    var elTxts = document.querySelectorAll('.meme-txt')
    elTxts.forEach(txt => txt.classList.remove('hidden'))
    elTxts.forEach((txt) => txt.innerText = '')
    var elTxtBoxs = document.querySelectorAll('.custom-box')
    elTxtBoxs.forEach(box => box.outerHTML = '')
}

function setInFocusTxt(txtId) {
    var elTxts = document.querySelectorAll(`.meme-txt`)
    elTxts.forEach((txt) => txt.classList.remove('focus'))

    var elTxt = document.querySelector(`.meme-txt[data-id="${txtId}"]`)
    elTxt.classList.add('focus')
    elTxt.focus()

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
    var img = new Image()
    img.src = imgSrc
    var canvas = document.querySelector('#meme-canvas')
    img.onload = function () {
        gCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
}

function resizeCanvas(canvas) {
    var elCanvasContainer = document.querySelector('.canvas-container')
    var containerHeight = setCanvasContainerSize(elCanvasContainer)
    canvas.width = elCanvasContainer.offsetWidth;
    canvas.height = containerHeight;
    setRelativeHeights(containerHeight)
}

function setCanvasContainerSize(elCanvasContainer) {
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    //we want to make the img as big as we can, will still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height / imgObj.width : imgObj.width / imgObj.height
    var height = elCanvasContainer.clientWidth * ratio
    elCanvasContainer.style.height = `${height}px`
    return height
}

function setRelativeHeights(containerHeight) {
    // document.querySelector('[data-id="2"]').style.top = (0.85 * containerHeight) + 'px'
    // document.querySelector('.flex-container').style.height = (containerHeight) + 'px'
}


function renderTxt(txtId, txt = null) {
    var elTextPlace = document.querySelector(`[data-id="${txtId}"]`)
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
    for (let i = 0; i < elTxts.length; i++) {
        var txtId = (i + 1) + ''
        var txt = getTxt(txtId)
        var font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
        gCtx.font = font
        gCtx.fillStyle = getTxtSettings(txtId, 'color')
        gCtx.shadowColor = '#000000'
        gCtx.shadowBlur = 1;
        gCtx.textBaseline = 'bottom'
        var xLocation = elTxts[i].offsetLeft
        var yLocation = elTxts[i].offsetTop + elTxts[i].clientHeight
        if (getTxtSettings(txtId, 'align') === 'center') xLocation += elTxts[i].offsetWidth / 2 - getTxtWidth(txt, font) / 2
        else if (getTxtSettings(txtId, 'align') === 'right') xLocation += elTxts[i].offsetWidth - getTxtWidth(txt, font)
        gCtx.fillText(txt, xLocation, yLocation);
    }
}

function onDelete(inFocusId = gInFocusTxtId) {
    var elTxt = document.querySelector(`.meme-txt[data-id="${inFocusId}"]`)
    if (inFocusId > 2) { //if this is a custom txt box, remove it
        elTxt.outerHTML = ''
        deleteTxt(inFocusId)
    } else {
        elTxt.classList.add('hidden')
        elTxt.classList.remove('focus')
        elTxt.innerText = ''
        setTxtSettings(inFocusId, 'content', '')
        setTxtSettings(inFocusId, 'visible', false)
    }
    //set focus to displayed text
    var remainTxtId = getVisibaleTxtId()
    if (remainTxtId) setInFocusTxt(remainTxtId)

}



function onAdd() {
    var hiddenTxtId = getHiddenTxtId()
    if (hiddenTxtId) {
        console.log(hiddenTxtId)
        setTxtSettings(hiddenTxtId, 'visible', true)
        var elTxt = document.querySelector(`.meme-txt[data-id="${hiddenTxtId}"]`)
        elTxt.classList.remove('hidden')
        setInFocusTxt(hiddenTxtId)
    } else {
        addCustomTxtBox()
        //on delete if class is not-defualt ----> remove it entierly and don't hide
    }
}

function addCustomTxtBox() {
    var txtId = '' + (gCanvasState.txt.length + 1)
    var elTxts = document.querySelectorAll('.meme-txt')
    elTxts = Array.from(elTxts)
    var strHtml = ''
    
    elTxts.forEach(txt => strHtml += txt.outerHTML)

    strHtml += `<div contenteditable="true" class="meme-txt custom-box" data-id="${txtId}" oninput="onTxtEdit(this)" 
    onmousedown="onStartDrag(event, this)" onmouseup="onStopDrag()" onmousemove="onDrag(event, this)" 
    onmouseout="onStopDrag()" onblur="onEndTyping(this)" onclick="setInFocusTxt(this.dataset.id)"></div>`
    
    strHtml += document.querySelector('#meme-canvas').outerHTML
    
    document.querySelector('.canvas-container').innerHTML = strHtml
    
    setNewTxt()
    initCanvas(getImgSrc())
    setInFocusTxt(txtId)
    renderTxt(txtId)

    console.log(gInFocusTxtId)

}

function getTxtWidth(txt, font) {
    var canvas = document.querySelector('#help-canvas')
    var ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.fillText(txt, 0, 0);
    return ctx.measureText(txt).width
}

function OnKeyMove(ev) {
    switch (ev.code) {
        case 'ArrowLeft':
            moveTxt('left')
            break
        case 'ArrowRight':
            moveTxt('right')
            break
        case 'ArrowUp':
            moveTxt('up')
            break
        case 'ArrowDown':
            moveTxt('down')
            break
    }
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
    gDragState.isDragging = true;
    gDragState.dragStartPos.left = el.offsetLeft;
    gDragState.dragStartPos.top = el.offsetTop;
    gDragState.clickPos.x = ev.clientX;
    gDragState.clickPos.y = ev.clientY;
}

function onDrag(ev, el) {
    if (gDragState.isDragging) {
        var xChange = ev.clientX - gDragState.clickPos.x;
        var yChange = ev.clientY - gDragState.clickPos.y;
        el.style.top = (gDragState.dragStartPos.top + yChange) + 'px';
        el.style.left = (gDragState.dragStartPos.left + xChange) + 'px';
    }
}

function onStopDrag() {
    gDragState.isDragging = false;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function onBackToGallery() {
    document.querySelector('section.editor').classList.add('hide');
    document.querySelector('section.gallery').classList.remove('hide');
}





//TODO: arrange functions in logical order





//make in focus element always border focus
//change font size to range
//add painter
//more than 2 text


