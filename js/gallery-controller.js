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
        <div class="shadow">
        <div class="gallery-item" style="background-image: url(${meme.src});" data-id="${meme.id}" onclick="onGalleryItemClicked(this)"></div>
        </div>
        `
    });
    document.querySelector('.img-gallery').innerHTML = strHtml;
}

function onGalleryItemClicked(elItem) {
    document.querySelector('.gallery').classList.add('hide');
    document.querySelector('.editor').classList.remove('hide');
    var meme = getMemeById(elItem.dataset.id);
    initEditor(meme);
}

function onSearchInput(val) {
    renderAutocomplete(val);
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

function onCloseModal() {
    //close all modals
    [].forEach.call(document.querySelectorAll('.modal'), (modal => modal.classList.add('hide')));
}

function onDisplaySearch() {
    document.querySelector('.search-input-container').classList.toggle('hidden');
    document.querySelector('.search-return').classList.remove('hide');
    [].forEach.call(document.querySelectorAll('.gallery .top-bar button'), (button => button.classList.add('hidden-on-mobile')));
    document.querySelector('.search-return').classList.remove('hidden-on-mobile');
}

function onSearchReturn() {
    document.querySelector('.search-input-container').classList.toggle('hidden');
    document.querySelector('.search-return').classList.add('hide');
    [].forEach.call(document.querySelectorAll('.gallery .top-bar button'), (button => button.classList.remove('hidden-on-mobile')));
}

function onOpenTagModal() {
    var elTagsModal = document.querySelector('.modal.tags');
    var tagsMap = getTagsMap();
    var strHtml = '';
    for (var tag in tagsMap) {
        strHtml += `<div class="tags-item" onclick="onTagClicked('${tag}')" style="display: inline-block; font-size: ${(tagsMap[tag] + 3) * 3}px">${tag}</div>`
    }
    elTagsModal.querySelector('.tags-area').innerHTML = strHtml;
    elTagsModal.classList.remove('hide');
}

function onTagClicked(tag) {
    onCloseModal();
    document.querySelector('.search-bar').classList.remove('hidden');
    document.querySelector('.search-bar input').value = tag;
    onSearchInput(tag);
}

function renderAutocomplete(val) {
    var elAutoComp = document.querySelector('.autocomplete');
    if (!val) elAutoComp.classList.add('hide');
    else elAutoComp.classList.remove('hide');
    var regex = new RegExp('^' + val, 'i');
    var strHtml = '';
    var memeNames = getMemeNameList();
    memeNames = memeNames.filter(memeName => {
        return regex.test(memeName);
    });
    memeNames.sort((memeName1, memeName2) => {
        return memeName1 > memeName2 ? 1 : -1;
    })
    memeNames.forEach(memeName => {
        strHtml += `<hr><div class="autocomplete-item">${memeName}</div>`
    });
    elAutoComp.innerHTML = strHtml;
}