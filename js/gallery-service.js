'use strict';

var gMemes = loadFromStorage('gMemes') || [];

function createMeme(name, src, ...tags) {
    var regex = /[^\/]+$/;
    var meme = {
        name: name,
        id: regex.exec(src)[0],
        src: src,
        tags: tags,
        display: true
    }
    gMemes.push(meme);
}

function saveMemes() {
    saveToStorage('gMemes', gMemes);
}

function createMemes() {
    if (gMemes.length) return;
    createMeme('Dr. Evil Quotes', 'img/meme-imgs/dr_evil.jpg', 'funny')
    createMeme('Look At All These', 'img/meme-imgs/look_at_all_these.jpg', 'funny', 'meme')
    createMeme('Ancient Aliens', 'img/meme-imgs/ancient_aliens.jpg', 'funny')
}

function getMemesForDisplay() {
    return gMemes.filter(meme => meme.display);
}

function getMemeById(id) {
    return gMemes.find(meme => meme.id === id);
}

function filterMemes(val) {
    var regex = new RegExp(val, 'i');
    if (!val) gMemes.forEach(meme => meme.display = true);
    else gMemes.forEach(meme => {
        if (regex.test(meme.name) || meme.tags.some(tag => regex.test(tag))) meme.display = true;
        else meme.display = false;
    });
}