// Simple strategy is a massive oversimplification
//future update would expand simple strategy 
//future update would complete the input of betting



var myBjApp = {};



myBjApp.pcards = document.getElementById('pcards');
myBjApp.dcards = document.getElementById('dcards');
myBjApp.hitButton = document.getElementById('hit');
myBjApp.stayButton = document.getElementById('stay');
myBjApp.playButton = document.getElementById('play');
myBjApp.textUpdates = document.getElementById('textUpdates');
myBjApp.buttonBox = document.getElementById('buttonBox');
myBjApp.phandtext = document.getElementById('phand');
myBjApp.dhandtext = document.getElementById('dhand');
myBjApp.tracker = document.getElementById('tracker');
myBjApp.newgame = document.getElementById('newgame');
myBjApp.choice = document.getElementById('choice');
//adding betting?
// myBjApp.money = document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
// myBjApp.betting = document.getElementById('betting');
// myBjApp.bet = document.getElementById("bet").disabled = false;
// myBjApp.bet = document.getElementById("bet").max = player.money;

// variables to track hands
myBjApp.playerHand = [];
myBjApp.dealerHand = [];
myBjApp.deck = [];
myBjApp.suits = ['clubs <span class="bold">&#9827</span>', 'diamonds <span class="redcard">&#9830</span>', 'hearts <span class="redcard">&#9829</span>', 'spades <span class="bold">&#9824</span>'];
myBjApp.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
myBjApp.gameStatus = 0; 
myBjApp.wins = 0; 
myBjApp.draws = 0; 
myBjApp.losses = 0; 
myBjApp.games = 0; 

// constructor for cards
function card(suit, value, name) {
    this.suit = suit; // suits
    this.value = value; // face value
    this.name = name; // string name of card
};


var newGame = function () {
    
    myBjApp.newgame.classList.add("hidden");//transition from new game to hit/stay
    
    
    myBjApp.dcards.innerHTML = "";
    myBjApp.dcards.innerHTML = "";
    myBjApp.playerHand = [];
    myBjApp.dealerHand = [];
    myBjApp.gameStatus = 0;

    //New deck
    myBjApp.deck = createDeck();

    // Deal cards to player and dealer
    myBjApp.playerHand.push(myBjApp.deck.pop());
    myBjApp.playerHand.push(myBjApp.deck.pop());

//player betting??--broken currently
    // function bet(outcome) {
    //     var playerBet = document.getElementById("bet").valueAsNumber;
    //     if (outcome === "win") {
    //         player.money += playerBet;
    //     }
    //     if (outcome === "lose") {
    //         player.money -= playerBet;
    //     }
    // }

    // check for player initial blackjack
    if (handTotal(myBjApp.playerHand) === 21)
    {
        myBjApp.wins += 1;
        myBjApp.games += 1;        
        myBjApp.gameStatus = 1; //dealers first card face up
        drawHands();
        myBjApp.textUpdates.innerHTML = "You have Blackjack! Congrats you have won.";
        track();
        myBjApp.gameStatus = 2; 
        return;
    }

    myBjApp.dealerHand.push(myBjApp.deck.pop());
    myBjApp.dealerHand.push(myBjApp.deck.pop());

    // check for dealer initial blackjack    
    if (handTotal(myBjApp.dealerHand) === 21)
    {
        myBjApp.games += 1;
        myBjApp.losses += 1;
        myBjApp.gameStatus = 1; // dealers second card face up
        drawHands();
        myBjApp.textUpdates.innerHTML = "You lost! Dealer has 21, better luck next time!";
        track();
        jsbApp.gameStatus = 2; 
        return;
    }

    // draw additonal cards if neither won on the initial deal
    drawHands();
    advise();
    myBjApp.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    myBjApp.textUpdates.innerHTML = "The cards have been dealt! Good Luck!";
    
};

var createDeck = function () {
    var deck = [];
    // creating a loop for values of cards to build the deck
    for (var a = 0; a < myBjApp.suits.length; a++) {
        for (var b = 0; b < myBjApp.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (myBjApp.values[b] + " of " + myBjApp.suits[a] + " (" + cardValue + ")");
            }
            else
            {
                cardTitle += (myBjApp.values[b] + " of " + myBjApp.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(myBjApp.suits[a], cardValue, cardTitle);
            deck.push(newCard);
            

        }
    }
    
    deck = shuffle(deck);
    
    
    return deck;
};

// show player and dealer hands
var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(myBjApp.playerHand);
    var dtotal = handTotal(myBjApp.dealerHand);
    htmlswap += "<ul>";
    for (var i = 0; i < myBjApp.playerHand.length; i++)
    {
        htmlswap += "<li>" + myBjApp.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    myBjApp.pcards.innerHTML = htmlswap;
    myBjApp.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; // update player hand total
    if (myBjApp.dealerHand.length == 0)
    {
        return;
    }

    // clear string and swap to dealer if stay has been pressed
    htmlswap = "";
    if (myBjApp.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        myBjApp.dhandtext.innerHTML = "Dealer's Hand (" + myBjApp.dealerHand[1].value + " + hidden card)"; // hidden value while face down
    }
    else
    {
        myBjApp.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; // update dealer hand total
    }
    
    for (var i = 0; i < myBjApp.dealerHand.length; i++) {
        
         if (myBjApp.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + myBjApp.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    myBjApp.dcards.innerHTML = htmlswap;
    

};

// total value of the current hand
var handTotal = function (hand) {
    
    var total = 0;
    var aceFlag = 0; // are there any aces
    for (var i = 0; i < hand.length; i++) {
        
        total += hand[i].value;
        if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
    }
    // each ace will equal 10, unless doing so results in a busted hand
    
    for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }
    
    return total;
}

// new shuffle
var shuffle = function (deck) {
    
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    return Math.floor(Math.random() * (max - min)) + min;
    
}

 

var deckPrinter = function (deck) {
    for (var i = 0; i < deck.length; i++)
    {
        console.log(deck[i].name);
    }
    return
}

// The loop for the game begins when new game is hit
myBjApp.playButton.addEventListener("click", newGame);

// When hit button is pressed
myBjApp.hitButton.addEventListener("click", function () {
    // disable if game has concluded
    if (myBjApp.gameStatus === 2)
    {
        console.log("Can not do, as game has concluded.");
        return;
    }

    // deal a card to the player
    myBjApp.playerHand.push(myBjApp.deck.pop());
    drawHands();
   

    var handVal = handTotal(myBjApp.playerHand);
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }
    else if (handVal === 21)
    {
        victory();
        advise();
        return;
    }
    advise();
    myBjApp.textUpdates.innerHTML = "Hit or stay?</p>";
    return;      
});

// When Stay button is pressed
myBjApp.stayButton.addEventListener("click", function stayLoop() {
    
    
    if (myBjApp.gameStatus === 2)
    {    //disabled if game has already concluded
        console.log("Cannot do as game has concluded");
        return;
    }
    else if (myBjApp.gameStatus === 0) //Stay was pressed
    {
        
        myBjApp.buttonBox.classList.add("hidden"); // removing hit and stay buttons
        var handVal = handTotal(myBjApp.dealerHand);
        myBjApp.gameStatus = 1; // stay loop active
        advise(); 
        myBjApp.textUpdates.innerHTML = "The Dealer reveals their 'Trap Card'";
        drawHands();
        setTimeout(stayLoop, 750); //stay loop returned
    }
    else if (myBjApp.gameStatus === 1) {    

    // If dealer has less than 17, hit---***** part of simple strat that needs updated******
    var handVal = handTotal(myBjApp.dealerHand);
    if (handVal > 16 && handVal <= 21) // dealer will stay and game will conclude
    {
        drawHands();
        
        var playerVal = handTotal(myBjApp.playerHand);
        if (playerVal > handVal)
        {            
            victory();
            return;
        }
        else if (playerVal < handVal)
        {            
            bust();
            return;
        }
        else
        {            
            tie();
            return;
        }
    }
    if (handVal > 21)
    {
        victory();
        return;
    }
    else //dealer will hit
    {
        myBjApp.textUpdates.innerHTML = "Dealer hits!";
        myBjApp.dealerHand.push(myBjApp.deck.pop());
        drawHands();
        setTimeout(stayLoop, 750);
        return;
    }   
    }
});

var victory = function () {
    myBjApp.wins += 1;
    myBjApp.games += 1;
    var explanation = "";
    myBjApp.gameStatus = 2; //Game is over
    var playerTotal = handTotal(MyBjApp.playerHand);
    var dealerTotal = handTotal(myBjApp.dealerHand);
    if (playerTotal === 21)
    {
        explanation = "You have 21!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    myBjApp.textUpdates.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var bust = function () {
    myBjApp.games += 1;
    myBjApp.losses += 1;
    var explanation = "";
    myBjApp.gameStatus = 2; //game has concluded
    var playerTotal = handTotal(myBjApp.playerHand);
    var dealerTotal = handTotal(myBjApp.dealerHand);
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    myBjApp.textUpdates.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var tie = function () {    
    myBjApp.games += 1;
    myBjApp.draws += 1;
    var explanation = "";
    myBjApp.gameStatus = 2; //game has concluded
    var playerTotal = handTotal(myBjApp.playerHand);
    myBjApp.textUpdates.innerHTML = "It's a push at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

// the win/loss/tie counter
var track = function () {
    myBjApp.tracker.innerHTML = "<p>Wins: " + myBjApp.wins + " Draws: " + myBjApp.draws + " Losses: " + myBjApp.losses + "</p>";
    myBjApp.newgame.classList.remove("hidden");
    myBjApp.buttonBox.classList.add("hidden");
}

// checking player for ace/ adding soft input
var softCheck = function (hand) {    
    var total = 0;
    var aceFlag = 0; // how many aces
    for (var i = 0; i < hand.length; i++) {
        
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // each ace equals 11 unless resulting in a busted hand
    
    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true; // the hand can be soft
        }
    }    
    return false; // the hand can no longer be soft and is considered hard
}

var advise = function () {
    
    if (myBjApp.gameStatus > 0)
    {
        myBjApp.choice.innerHTML = "";
        return;
    } 
    var playerTotal = handTotal(myBjApp.playerHand);
    var soft = softCheck(myBjApp.playerHand);
    console.log("Soft: " + soft);
    var dealerUp = myBjApp.dealerHand[1].value;
    // counting dealers ace as 11, *****needs updating to better evaluate simple strat
    if (dealerUp === 1)
    {
        dealerUp = 11;
    }

    // provide advice on over simplified strat
    if (playerTotal <= 11 && !soft)
    {
        myBjApp.choice.innerHTML = "Hit!";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp <= 6 && !soft)
    {
        myBjApp.choice.innerHTML = "Stay";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp >= 7 && !soft)
    {
        myBjApp.choice.innerHTML = "Hit!";
    }
    else if (playerTotal >= 17 && playerTotal <= 21 && !soft)
    {
        myBjApp.choice.innerHTML = "Stay";
    }
    else if (playerTotal >= 12 && playerTotal <= 18 && soft)
    {
        myBjApp.choice.innerHTML = "Hit!";
    }
    else if (playerTotal >= 19 && playerTotal <= 21 && soft)
    {
        myBjApp.choice.innerHTML = "Stay";
    }
    else
    {
        myBjApp.choice.innerHTML = "Massive error, unexpected scenario, idk";
        console.log("Error: Player's hand was " + playerTotal + " and dealer's faceup was " + dealerUp + ".");
    }
    return;
}