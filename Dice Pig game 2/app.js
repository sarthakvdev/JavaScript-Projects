/* GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

   -----------------------------------------------------------------------------

YOUR 3 CHALLENGES
Change the game to follow these rules:

DONE
1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn.
   (Hint: Always save the previous dice roll in a separate variable)
DONE
   2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100.
   (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
NOT-DONE
   3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1.
   (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.) */

var score, roundScore, activeplayer, gamePlaying, prevDice;
var dice1DOM = document.getElementById('dice-1');
var dice2DOM = document.getElementById('dice-2');
init();

 // 'click' is a property of Event Listener, setting event to 'click' and cause to anonymous function 
 document.querySelector('.btn-roll').addEventListener('click', function() {
    if(gamePlaying) {
       // 1. random number
      var dice_1 = Math.floor(Math.random() * 6) + 1;
      var dice_2 = Math.floor(Math.random() * 6) + 1;

      // if(dice === 6 && prevDice === 6) {    //entire score of player is lost as two 6 rolls in a row
      //    nextPlayer();
      // }
      // prevDice = dice;

      //2. Display the result
      dice1DOM.style.display = 'block';
      dice2DOM.style.display = 'block';
      dice1DOM.src = 'dice-' + dice_1 + '.png';
      dice2DOM.src = 'dice-' + dice_2 + '.png';

      //3. The player looses his current score when one of them is a 1.
      if(dice_1 === 1 || dice_2 === 1) {
         nextPlayer();
      } else {
         //add score to roundScore
         roundScore += dice_1 + dice_2;
         document.getElementById('current-' + activePlayer).textContent = roundScore;
      }
    }
 });

 document.querySelector('.btn-hold').addEventListener('click', function() {   
    if(gamePlaying) {
      //Add currentScore to the global score of player
      score[activePlayer] += roundScore;
      document.querySelector('#score-' + activePlayer).textContent = score[activePlayer];

      //get input of Max value from user
      var maxScore = document.getElementById('score-input').value;
      maxScore ? maxScore : maxScore = 20;

      //Check if player won the game
      if(score[activePlayer] >= maxScore) {
         gamePlaying = false;
         document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
         diceDOM.style.display = 'none';
         document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
         document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      } else {
         nextPlayer();
      }
    }
 });

 function nextPlayer() {
   activePlayer === 0 ? activePlayer = 1 : activePlayer = 0; 
   roundScore = 0;
   document.getElementById('current-0').textContent = '0';
   document.getElementById('current-1').textContent = '0';
    
   document.querySelector('.player-0-panel').classList.toggle('active');
   document.querySelector('.player-1-panel').classList.toggle('active');
   
   //hide the dice after turn changes
   dice1DOM.style.display = 'none';
   dice2DOM.style.display = 'none';
}

//New Game button -> It initializes the game from start
document.querySelector('.btn-new').addEventListener('click', init);

function init() {
   gamePlaying = true;
   score = [0, 0];   //index 0 player-1 and index 1 player-2
   roundScore = 0;   //score of each round
   activePlayer = 0; //index of active player

   dice1DOM.style.display = 'none';
   dice2DOM.style.display = 'none';
 
   document.getElementById('score-0').textContent = '0'; //setting the display of all scores to zero
   document.getElementById('score-1').textContent = '0';
   document.getElementById('current-0').textContent = '0';
   document.getElementById('current-1').textContent = '0';
   document.getElementById('name-0').textContent = 'Player 1';
   document.getElementById('name-1').textContent = 'Player 2';

   document.querySelector('.player-0-panel').classList.remove('winner');
   document.querySelector('.player-1-panel').classList.remove('winner');
   document.querySelector('.player-0-panel').classList.remove('active');
   document.querySelector('.player-1-panel').classList.remove('active');
   document.querySelector('.player-0-panel').classList.add('active');   //init the active class to player 1
}