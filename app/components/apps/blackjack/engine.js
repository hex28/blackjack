export function init(callback){

    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      callback(result)
    });

}

export function drawCards(deckId, num, cb){
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`)
  .then((response) => {
    return response.json();
  })
  .then((result) => {
    cb(result)
  });
}

export function shuffleCards(deckId, cb){

  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
  .then((response) => {
    return response.json();
  })
  .then((result) => {
  });
}
