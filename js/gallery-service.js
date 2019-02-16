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
    createMeme('Dr. Evil Quotes', 'img/meme-imgs/dr_evil.jpg', 'funny', 'sarcastic', 'movie', 'doctor', 'austin', 'powers')
    createMeme('Look At All These', 'img/meme-imgs/look_at_all_these.jpg', 'funny', 'sarcastic', 'movie', 'happy', 'dancing', 'dance', 'field')
    createMeme('Ancient Aliens', 'img/meme-imgs/ancient_aliens.jpg', 'funny', 'tv', 'interview')
    createMeme('African Kids Dancing', 'img/meme-imgs/african_kids_dancing.jpg', 'happy', 'win', 'success', 'dance', 'cute', 'baby')
    createMeme('Evil Toddler', 'img/meme-imgs/evil_toddler.jpg', 'funny', 'cute', 'kid', 'child')
    createMeme('Hecht', 'img/meme-imgs/hecht.jpg', 'חיים', 'הכט', 'haim', 'שלא', 'יעבדו', 'עליכם', 'israel', 'hebrew', 'tv', 'celebrity')
    createMeme('Leo', 'img/meme-imgs/leo.jpg', 'happy', 'movie', 'cheers', 'leonardo', 'dicaprio', 'great', 'gatsby', 'celebrity')
    createMeme('Laughing Obama', 'img/meme-imgs/obama.jpg', 'happy', 'politics', 'president', 'celebrity', 'usa', 'american')
    createMeme('One Does Not Simply', 'img/meme-imgs/one_does_not_simply.jpg', 'movie', 'lord', 'rings', 'boromir')
    createMeme('Oprah', 'img/meme-imgs/oprah.jpg', 'oprah', 'tv', 'celebrity')
    createMeme('Patrick', 'img/meme-imgs/patrick.jpg', 'tv', 'laughing', 'star', 'trek', 'celebrity')
    createMeme('Putin', 'img/meme-imgs/putin.jpg', 'president', 'russian', 'celebrity')
    createMeme('Success Baby', 'img/meme-imgs/success_baby.jpg', 'success', 'win', 'baby', 'cute')
    createMeme('Angry Trump', 'img/meme-imgs/angry_trump.jpg', 'angry', 'politics', 'president', 'celeb', 'usa', 'american')
    createMeme('What If I Told You', 'img/meme-imgs/what_if_i_told_you.jpg', 'movie', 'morpheus', 'matrix')
    createMeme('Condescending Wonka', 'img/meme-imgs/wonka.jpg', 'movie', 'sarcastic', 'charlie', 'chocolate', 'factory')
    createMeme('X Everywhere', 'img/meme-imgs/x_everywhere.jpg', 'movie', 'toy', 'story', 'woody', 'buzz', 'scared')
}

function getMemesForDisplay() {
    return gMemes.filter(meme => meme.display);
}

function getMemeById(id) {
    return gMemes.find(meme => meme.id === id);
}

function getMemeNameList() {
    var list = [];
    gMemes.forEach(meme => list.push(meme.name));
    return list;
}

function filterMemes(val) {
    var regex = new RegExp(val, 'i');
    if (!val) gMemes.forEach(meme => meme.display = true);
    else gMemes.forEach(meme => {
        if (regex.test(meme.name) || meme.tags.some(tag => regex.test(tag))) meme.display = true;
        else meme.display = false;
    });
}

function getTagsMap() {
    var tags = [];
    gMemes.forEach(meme => {
        tags.push(meme.name);
        tags.push(...meme.tags);
    });
    tags = tags.reduce((acc, tag) => {
        if (!acc[tag]) acc[tag] = 1;
        else acc[tag]++;
        return acc;
    }, {})
    return tags;
}