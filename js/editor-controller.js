//Comment regaring text lines - Since support for more than 2 text boxes was added at a later time,
//there is a different behaviour for the 2 initial boxes and the extra ones
//Ideally - all should be rendered at init and at add and all should be removed completely when deleted

'use strict';
var gCtx
var gNumOfTxtLines = 2
var gDragState = { isDragging: false, clickPos: { x: 0, y: 0 }, dragStartPos: { left: 0, top: 0 } }
var gInFocusTxtId


function onBackToGallery() {
    document.querySelector('section.editor').classList.add('hide');
    document.querySelector('section.gallery').classList.remove('hide');
}

function initEditor(meme) {
    var imgSrc = meme.src
    resetCanvasModel() //reset modal
    resetTxtBoxs()
    setInFocusTxt('1')  
    initCanvas(imgSrc)
}

function resetTxtBoxs() {
    var elTxtBoxs = document.querySelectorAll('.meme-txt')
    elTxtBoxs.forEach(txt => txt.classList.remove('hidden'))
    elTxtBoxs.forEach((txt) => {
        txt.innerText = ''
        txt.style.top = ''
        txt.style.left = ''
        setDragEvents(txt)
    })

    var elAddedTxtBoxs = document.querySelectorAll('.extra-box')
    elAddedTxtBoxs.forEach(box => box.outerHTML = '')
}

function setDragEvents(txt) {
    txt.addEventListener("touchstart", function () { onStartDrag(event, txt) }, false);
    txt.addEventListener("touchend", function () { onStopDrag() }, false);
    txt.addEventListener("touchmove", function () { onDrag(event, txt) }, false);
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
    gCtx.scale(1, 1);
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
}

function setCanvasContainerSize(elCanvasContainer) {
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    //we want to make the img as big as we can, while still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height / imgObj.width : imgObj.width / imgObj.height
    var height = elCanvasContainer.clientWidth * ratio
    elCanvasContainer.style.height = `${height}px`
    return height
}


function onTxtEdit(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    renderTxt(txtId)
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

//Since support for more than 2 text boxes was added at a later time,
//there is a different behaviour for the 2 initial boxes and the extra ones
//Ideally - all should be rendered at init and at add and all should be removed completely when deleted
function onDelete(inFocusId = gInFocusTxtId) {
    var elTxt = document.querySelector(`.meme-txt[data-id="${inFocusId}"]`)
    if (inFocusId > 2) { //if this is an extra txt box, remove the element
        elTxt.outerHTML = ''
        deleteTxt(inFocusId)
    } else { //if it's initial txt box, just hide it
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

//When adding a text, first put one of the defualt text boxes back if these were removed
function onAdd() {
    var hiddenTxtId = getHiddenTxtId()
    if (hiddenTxtId) {
        setTxtSettings(hiddenTxtId, 'visible', true)
        var elTxt = document.querySelector(`.meme-txt[data-id="${hiddenTxtId}"]`)
        elTxt.classList.remove('hidden')
        setInFocusTxt(hiddenTxtId)
    } else {
        //If it's third text box, add a new element
        addExtraTxtBox()
    }
}

function addExtraTxtBox() {
    console.log(gCanvasState)
    var txtId = '' + (gCanvasState.txt.length + 1)
    var elTxts = document.querySelectorAll('.meme-txt')
    elTxts = Array.from(elTxts)
    var strHtml = ''

    elTxts.forEach(txt => strHtml += txt.outerHTML)

    strHtml += `<div contenteditable="true" class="meme-txt extra-box" data-id="${txtId}" oninput="onTxtEdit(this)" 
    onmousedown="onStartDrag(event, this)" onmouseup="onStopDrag()" onmousemove="onDrag(event, this)" 
    onmouseout="onStopDrag()" onblur="onEndTyping(this)" onclick="setInFocusTxt(this.dataset.id)"></div>`

    strHtml += document.querySelector('#meme-canvas').outerHTML;
    
    document.querySelector('.canvas-container').innerHTML = strHtml

    var elTxtBoxs = document.querySelectorAll('.meme-txt')
    elTxtBoxs.forEach((txt) => {
        setDragEvents(txt)
    })
    addTxtToModel()
    initCanvas(getImgSrc())
    setInFocusTxt(txtId)
    renderTxt(txtId)
}

// For moving text with keyboard arrows
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
//moving the text - 4 px at a time
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

function downloadImg(elLink) {
     //we use divs for editing the text, so before download we need to write the text on the canvas:
    addCanvasTxt()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/png');
    elLink.href = imgContent
    // Now remove the canvas text and re draw the image
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
    
}

// Take txt and styles from the div and write text on the canvas itself
function addCanvasTxt() {
    var elTxts = document.querySelectorAll('.meme-txt')
    for (let i = 0; i < elTxts.length; i++) {
        var txtId = (i + 1) + ''
        var txt = getTxt(txtId)
        var font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
        gCtx.font = font
        gCtx.fillStyle = getTxtSettings(txtId, 'color')
        gCtx.strokeStyle = 'black';
        gCtx.lineWidth = 2
        gCtx.textBaseline = 'bottom'
        var xLocation = elTxts[i].offsetLeft
        var yLocation = elTxts[i].offsetTop + elTxts[i].clientHeight
        if (getTxtSettings(txtId, 'align') === 'center') xLocation += elTxts[i].offsetWidth / 2 - getTxtWidth(txt, font) / 2
        else if (getTxtSettings(txtId, 'align') === 'right') xLocation += elTxts[i].offsetWidth - getTxtWidth(txt, font)
        gCtx.strokeText(txt, xLocation, yLocation)
        gCtx.fillText(txt, xLocation, yLocation);
    }
}
// To get the accurate text siaze, I paint in on a help canvas(hidden) and measure it there
function getTxtWidth(txt, font) {
    var canvas = document.querySelector('#help-canvas')
    var ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.fillText(txt, 0, 0);
    return ctx.measureText(txt).width
}


// Drag
function onStartDrag(ev, el) {
    gDragState.isDragging = true;
    gDragState.dragStartPos.left = el.offsetLeft;
    gDragState.dragStartPos.top = el.offsetTop;
    gDragState.clickPos.x = ev.clientX || ev.touches[0].clientX;
    gDragState.clickPos.y = ev.clientY || ev.touches[0].clientY;
}
function onDrag(ev, el) {
    ev.preventDefault();
    if (gDragState.isDragging) {
        var clientX = ev.clientX || ev.touches[0].clientX;
        var clientY = ev.clientY || ev.touches[0].clientY;
        var xChange = clientX - gDragState.clickPos.x;
        var yChange = clientY - gDragState.clickPos.y;
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


//we didn't want the color picker design, so when clicking this color button, it opens a color picker
function onChangeColor() {
    document.querySelector('.color-picker').click();
}


// Mobile settings menu
function onShowSettingContainer(ev) {
    ev.stopPropagation();
    document.querySelector('.setting-container').classList.remove('remove-on-mobile');
}

function onHideSettingContainer(ev) {
    ev.stopPropagation();
    document.querySelector('.setting-container').classList.add('remove-on-mobile');
}










//not in use:


// function resizeCanvasForDownload(canvas) {
//     var imgSrc = getImgSrc()
//     var imgObj = new Image();
//     imgObj.src = imgSrc;
//     canvas.width = imgObj.width
//     canvas.height = imgObj.height
// }


