'use strict';

function init() {
    createMemes();
    renderGallery();
}

function renderGallery() {
    var strHtml = '';
    var memes = getMemesForDisplay();
    if (!memes.length) strHtml += '<h2>no memes for display<h2>'
    memes.forEach(meme => {
        strHtml += `
        <div class="gallery-item" style="background-image: url(${meme.src});" data-id="${meme.id}" onclick="onGalleryItemClicked(this)"></div>
        `
    });
    document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onGalleryItemClicked(elItem) {
    var meme = getMemeById(elItem.dataset.id);
    openEditor(meme);
}

function onSearchInput(val) {
    filterMemes(val);
    renderGallery();
}

function onAddMeme() {
    document.querySelector('.modal.add-meme').classList.remove('hide');
}

function onSubmitNewMeme(ev, elForm) {
    ev.preventDefault();
    var inputName, inputTags, inputSrc;
    [inputName, inputTags, inputSrc] = [].map.call(elForm.querySelectorAll('input'), function (input) { return input.value });
    inputTags = inputTags.split(',').map(tag => tag.trim());
    createMeme(inputName, inputSrc, ...inputTags);
    document.querySelector('.modal.add-meme').classList.add('hide');
    renderGallery();
}

function openEditor(meme) {
    console.log(meme);
}

function onCloseModal() {
    document.querySelector('.modal').classList.add('hide');
}

function onDisplaySearch() {
    document.querySelector('.search-bar').classList.remove('hidden');
}