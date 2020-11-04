/* GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

var score, roundScore, activeplayer, gamePlaying;
var diceDOM = document.querySelector('.dice');
// var playerName1;

askPlayerName();

//getElementBy method is faster than querySelector

 // 'click' is a property of Event Listener, setting event to 'click' and cause to anonymous function 
 document.querySelector('.btn-roll').addEventListener('click', function() {
    if(gamePlaying) {
       // 1. random number
      var dice = Math.floor(Math.random() * 6) + 1;
      
      //2. Display the result
      var diceDOM = document.querySelector('.dice');
      diceDOM.style.display = 'block';
      diceDOM.src = 'dice-' + dice + '.png';

      //3. If dice value is 1, roundScore will be zero and next players turn will come
      if(dice !== 1) {
         //add score to roundScore
         diceDOM.style.disply = 'block';
         roundScore += dice;
         document.getElementById('current-' + activePlayer).textContent = roundScore;
      } else {
         nextPlayer();
      }
    }
 }); 

 document.querySelector('.btn-hold').addEventListener('click', function() {   
    if(gamePlaying) {
      //Add currentScore to the global score of player
      score[activePlayer] += roundScore;
      document.querySelector('#score-' + activePlayer).textContent = score[activePlayer];

      //Check if player won the game
      if(score[activePlayer] >= 20) { 
         gamePlaying = false;
         document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
         diceDOM.style.display = 'none';
         document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
         document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      } else {
         //Next Player
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
   diceDOM.style.display = 'none'; //hide the dice after turn changes
}

// Button to Re-Start the Game
// document.querySelector('.btn-new').addEventListener('click', init(playerName1));

// Function that asks the name of players and assign to the DOM
function askPlayerName() {
   document.querySelector('.wrapper').style.display = 'none'; // Hiding till we get player 1 name

   document.getElementById('submit-name').addEventListener("click", () => {
      document.querySelector('.wrapper').style.display = 'block';
      document.querySelector('.initials').style.display = 'none';
      init(document.getElementById('input-fname-1').value, document.getElementById('input-fname-2').value);
      // Hiding the name asking Panel
      
   });
   
   document.addEventListener("keypress", event => { 
      if(event.keyCode === 13 || event.which === 13) {
         document.querySelector('.wrapper').style.display = 'block';
         init(document.getElementById('input-fname-1').value, document.getElementById('input-fname-2').value);
         // Hiding the name asking Panel
         document.querySelector('.initials').style.display = 'none';
      }
  });
}

function init(playerName1, playerName2) {
   // playerName1 = playerName;

   gamePlaying = true;
   score = [0, 0];   //index 0 player-1 and index 1 player-2
   roundScore = 0;   //score of each round
   activePlayer = 0; //index of active player
   
   diceDOM.style.display = 'none';    //Hiding dice image before starting that game

   document.getElementById('score-0').textContent = '0'; //setting the display of all scores to zero
   document.getElementById('score-1').textContent = '0';
   document.getElementById('current-0').textContent = '0';
   document.getElementById('current-1').textContent = '0';
   document.getElementById('name-0').textContent = playerName1;
   document.getElementById('name-1').textContent = playerName2;
   
   document.querySelector('.player-0-panel').classList.remove('winner');
   document.querySelector('.player-1-panel').classList.remove('winner');
   document.querySelector('.player-0-panel').classList.remove('active');
   document.querySelector('.player-1-panel').classList.remove('active');
   document.querySelector('.player-0-panel').classList.add('active');   //init the active class to player 1
}