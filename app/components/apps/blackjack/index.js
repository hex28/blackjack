import React, {Component} from 'react';
import BlackJack from './blackjack';

const Score = ({score}) => {

    return (
      <div className="fixed" style={{top:'25px', right: '25px'}}>
        <div class="rounded overflow-hidden shadow-lg mt-2">
          <div class="px-4 py-1">
            <div class="font-bold text-xl">{`Score: ${score}`}</div>
          </div>
        </div>
      </div>
    );

};

class BlackJackConstructor extends Component{

  state = {
    score: 0,
  }

  handleScore = (num) => {
    let currScore = this.state.score + num;
    this.setState({
      score: currScore
    })
  }

  getScore = () => {
    return this.state.score
  }

  render () {

    return (
      <div class="flex-1 pl-16 pr-16">
        <div className={null}>
          <Score score={this.state.score} />
        </div>
        <BlackJack handleScore={this.handleScore} getScore={this.getScore} />
      </div>
    )
  }

};

export default BlackJackConstructor;
