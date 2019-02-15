
'use strict';
var gCtx

// initCanvas()
function initEditor(meme) {
    var imgSrc = meme.src
    document.querySelector('.text-input').value = ''
    resetCanvasState()
    initCanvas(imgSrc)
}

function initCanvas(src = 'img/meme-imgs/patrick.jpg') {
    setImg(src)
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    drawImg()
    resizeCanvas(canvas)
    // renderTxt()
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


function renderTxt(txtId, txt) {
    if (txtId === 'top') var elTextPlace = document.querySelector('.top-txt')
    else var elTextPlace = document.querySelector('.bottom-txt')
    elTextPlace.innerText = txt;
    elTextPlace.style.color = getTxtSettings(txtId, 'color')
    elTextPlace.style.font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
}



function onStartTyping() {
    gCtx.beginPath()
}

function onEndTyping(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    var txt = elTxtInput.value
    setTxtSettings(txtId, 'content', txt)
    console.log(gCanvasState)
}

function onTextEdit(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    var txt = elTxtInput.value
    renderTxt(txtId, txt)
    //add text to model
}



function onDisplayChange(elTxtDisplay) {
    var txtId = elTxtDisplay.dataset.id
    var changeType = elTxtDisplay.dataset.type
    var ChangeVal = elTxtDisplay.value
    setTxtSettings(txtId, changeType, ChangeVal)
    submitChange(txtId)
}

function submitChange(txtId) {
    var txt = getCurrTxt(txtId)
    renderTxt(txtId, txt)
}

function getCurrTxt(txtId) {
    if (txtId === 'top') var elTextPlace = document.querySelector('.top-txt')
    else var elTextPlace = document.querySelector('.bottom-txt')
    return elTextPlace.innerText
    //TODO: read this from model and ot from DOM
}

function downloadImg(elLink) {
    addCanvasTxt()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
}

function addCanvasTxt(txtId = 'top') {
    var txt = document.querySelector('.meme-text').innerText
    gCtx.fillStyle = getTxtSettings(txtId, 'color')
    gCtx.font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
    //need to set position and shadow
    //need to get div location
    var xLocation = 30 //left point where text start
    var yLocation = 30 //bottom point where text start
    gCtx.fillText(txt, xLocation, yLocation);
}

function onBackToGallery() {
    document.querySelector('section.editor').classList.add('hide');
    document.querySelector('section.gallery').classList.remove('hide');
}

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();

    document.getElementById('imgData').value = document.querySelector('canvas').toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('uploadedImgUrl', uploadedImgUrl);

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            return response.text()
        })
        .then(onSuccess)
        .catch(function (error) {
            console.error(error)
        })
}




// facebook api
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



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
//move control panel in editor to side in desktop - css container of control panel
//css control panel

//delete line

//change font size to range
//change text lines way of rendering
// add painter