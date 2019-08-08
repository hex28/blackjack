import React, {Component} from 'react';
import * as engine from './engine';

class BlackJack extends Component {

  state = {
    canDeal: true,
    deckId: null,
    start: false,
    house: [],
    player: [],
    bet: 1,
    doubled: false,
  }

  componentDidMount(){
    engine.init(
      (result)=>{
        this.setState({
          canDeal: false,
          deckId: result.deck_id
        })
      }
    )
  }

  dealCards = (e) => {
    engine.drawCards(this.state.deckId, 4, (result) =>{
      this.setState({
        start: true,
        house: [result.cards[0], result.cards[1]],
        player: [result.cards[2], result.cards[3]]
      }, ()=>{
        setTimeout(()=>{
          this.checkCards(this.state.player, (total)=>{
            if (total === 21){
              alert(total + ' You Win!')
              this.reset('win')
            } else {
              this.checkCards(this.state.house, (total)=>{
                if (total === 21){
                  alert(total + ' You Lose!')
                  this.reset('lose')
                }
              })
            }
          })
        }, 500)
      })
    })
  }

  checkCards = (cards, cb) => {
    let tens = ['KING', 'QUEEN', 'JACK']
    let total = 0;
    let aces = 0;

    for (var i = 0; i < cards.length; i++) {
      if (cards[i].value !== "ACE"){
        if (tens.filter(card => (card === cards[i].value) ? true : false).length === 1){
          total += 10
        } else {
          total += parseInt(cards[i].value)
        }
      } else {
        aces++;
      }
    }

    for (var i = 0; i < aces; i++) {
      if (total + 11 > 21) {
        total += 1
      } else {
        total += 11
      }
    }

    cb(total)

  }

  recursiveCheckCards = (h, ot, result, index) =>{
    this.checkCards(h, (t)=>{
      if (t > 21) {
        alert('You: ' + ot + ' You win!')
        this.reset('win')
      }
      else if (t > ot && t < 21 || t === 21){
        alert ('House: ' + t + ' You lose!')
        this.reset('lose')
      }
      else{
        h.push(result.cards[index])
        this.setState({
          house: h
        })
        setTimeout(()=>{
          return this.recursiveCheckCards(h, ot, result, index + 1)
        }, 200)
      }
    })
  }

  hit = (e) => {
    engine.drawCards(this.state.deckId, 2, (result) =>{
      const house = this.state.house
      const player = this.state.player
      player.push(result.cards[0]);

      this.setState({
        player: player
      }, ()=>{
        let playerTotal;
        let houseTotal;
        this.checkCards(player, (total)=>{
          playerTotal = total;
          setTimeout(()=>{
            if (total === 21 || total > 21){
              if (total > 21){
                alert('You: ' + total.toString() + ' You Lose!')
                this.reset('lose')
              }
              if (total === 21){
                alert('You: ' + total.toString() + ' You Win!')
                this.reset('win')
              }
            }
            else
            {
              setTimeout(()=>{
                this.checkCards(house, (total) =>{
                  houseTotal = total
                  if (total < 15 && houseTotal < playerTotal  ){
                    house.push(result.cards[1]);
                    this.setState({
                      house: house
                    }, ()=>{
                      this.checkCards(house, (total)=>{
                        setTimeout(()=>{
                          if (total > 21){
                            alert('House: ' + total.toString() + ' You Win!')
                            this.reset('win')
                          }
                        }, 100) //setTimeout End
                      }) //checkCards End
                    }) //setState end
                  }
                }) //checkCards end
              }, 100) //setTimeout End
            }
          }, 100)
        })
      })
    })

  }

  stay = (e) => {
    const player = this.state.player
    const house = this.state.house

    engine.drawCards(this.state.deckId, 10, result => {
      this.checkCards(player, (playerTotal)=>{
        this.recursiveCheckCards(house, playerTotal, result, 0, false)
      })
    })

  }

  doubleDown = (e) => {
    engine.drawCards(this.state.deckId, 11, result => {
      const house = this.state.house
      const player = this.state.player
      let playerTotal;
      player.push(result.cards[0]);
      this.setState({
        bet: this.state.bet * 2,
        doubled: true
      }, ()=>{
        setTimeout(()=>{
          this.setState({
            player: player,
          }, ()=>{
            this.checkCards(player, (total)=>{
              playerTotal = total;
              if (total === 21 || total > 21){
                if (total > 21){
                  alert('You: ' + total.toString() + ' You Lose!')
                  this.reset('lose')
                }
                if (total === 21){
                  alert('You: ' + total.toString() + ' You Win!')
                  this.reset('win')
                }
              } else {
                this.recursiveCheckCards(house, playerTotal, result, 0)
              }
            })
          })
        }, 200)
      })
    })
  }

  reset = (win) => {

    switch (win) {
      case 'win':
        this.props.handleScore(this.state.bet * 2)
        break;
      case 'lose':
        this.props.handleScore(-this.state.bet)
        break;
    }

    engine.shuffleCards(this.state.deckId)
    this.setState({
      start: false,
      canDeal: false,
      bet: this.state.doubled ? this.state.bet / 2 : this.state.bet,
      doubled: false
    })
  }

  handleBet = (e) => {
    let bet = e.target.value;
    if (e.target.value < 0){
      bet = 1
    }
    if (this.props.getScore() < e.target.value){
      bet = 1
    }
    this.setState({
      bet: bet
    })
  }

  render () {

    const {canDeal, start, house, player} = this.state

    return (
      <div className="flex flex-row w-4/5 margin-center text-center">
        <div className="w-4/5 margin-center rounded overflow-hidden shadow-lg mt-2 mr-4">
          <div className="px-6 py-4">
            <div className="font-bold text-4xl mb-2">{'Black Jack'}</div>
            <div className="mb-4">
                <div className={(house.length < 5) ? "flex flex-col margin-center w-1/2" : "flex flex-col w-1/2"  }>
                  <div className="flex w-1/2">
                    {house.map(cards =>
                      <img src={cards.images.png} className="w-3/5" />
                    )}
                  </div>
                </div>
                {
                  <div className="flex flex-col margin-center w-1/2">
                    <div className="font-bold text-3xl mb-2">House</div>
                    <div style={{border: '2px solid #000'}}></div>
                    <div className="font-bold text-3xl mt-2 mb-1">My Cards</div>
                  </div>
                }
                <div className={(player.length < 5) ? "flex flex-col margin-center w-1/2" : "flex flex-col w-1/2"  }>
                  <div className="flex w-1/2">
                    {player.map(cards =>
                      <img src={cards.images.png} className="w-3/5" />
                    )}
                  </div>
                </div>
            </div>
            {/* <div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 mr-2"
                onClick={this.dealCards}
                disabled={canDeal}
                >
                Deal
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                onClick={()=>{console.log(this.state.canDeal)}}
                disabled={canDeal}
                >
                Double Down
              </button>
            </div> */}
          </div>
        </div>
        <div className="w-1/5 margin-center mt-2">

          <div className="shadow-lg rounded overflow-hidden mb-4">
            <div className="px-6 py-4">
              <div className="flex flex-col pt-8">
                {
                  !start ?
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 mr-2"
                    onClick={this.dealCards}
                    disabled={canDeal}
                    >
                    Deal
                  </button>
                  :
                  <React.Fragment>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 mr-2"
                      onClick={this.hit}
                      disabled={canDeal}
                      >
                      Hit
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                      onClick={this.stay}
                      disabled={canDeal}
                      >
                      Stay
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                      onClick={this.doubleDown}
                      disabled={canDeal}
                      >
                      Double Down
                    </button>
                  </React.Fragment>
                }
              </div>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex flex-col pt-8">
                <React.Fragment>
                  <div className="mr-2 text-lg mb-4">
                    Place Your Bet and Deal to Begin
                  </div>
                  <div className="margin-center">
                    <input
                      class="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                      name="bet"
                      id="bet"
                      type="number"
                      onChange={this.handleBet}
                      value={this.state.bet}
                      style={{width: '60px', padding: '10px'}}
                      disabled={this.state.start}
                     />
                  </div>
                </React.Fragment>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
};

export default BlackJack;
