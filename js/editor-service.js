var gCurrTxtSets = {color: 'black',
                        font: 'Cursive',
                        size: '2rem'}



function setCurrTxtSets(property, value) {
    if (property !== 'size') gCurrTxtSets[property] = value
    else  gCurrTxtSets[property] = value + 'px'
}

function getCurrTxtSets(property) {
    return gCurrTxtSets[property]
}