'use strict';

var gMemes = loadFromStorage('gMemes') || [];

function createMeme(name, id, ...tags) {
    var meme = {
        name: name,
        id: id,
        src: id + '.jpg',
        tags: tags
    }
    gMemes.push(meme);
}

function saveMemes() {
    saveToStorage('gMemes', gMemes);
}

function createMemes() {
    if (gMemes.length) return;
    createMeme('Dr. Evil Quotes', 'dr_evil', 'funny')
    createMeme('Look At All These', 'look_at_all_these', 'funny', 'meme')
    createMeme('Ancient Aliens', 'ancient_aliens', 'funny')
}