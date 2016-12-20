/* game.js - This is the javascript for the Jedi Fight Club games 
 */

var players = [ [ "0", "Darth Honeydew", "assets/images/Bunsen.jpeg" ],
                [ "1", "Darth Tats", "assets/images/darth_toast.jpg" ],
                [ "2", "Darth Toast", "assets/images/darth_skull.jpg" ],
                [ "3", "Darth Dad", "assets/images/darth_dad.jpg" ],
                [ "4", "Dark Helmet", "assets/images/dark_helmet.jpg" ]
              ];
var p = [];
var myPlayerID;
var myEnemyID;
var roundOver = false;
var game;

function Game() {
    this.maxRounds = players.length;
    this.gameOver = false;
    this.roundOver = false;
    this.attackIncrement = 1;
    this.round = 1;
    showVanquished();
    hideDefender();
}

function Fighter (pId, pName, pImg) {
    this.id = pId;
    this.name = pName;
    this.img = pImg;
    this.whiteHat = false;
    this.reset = function() {
        this.health = Math.floor(Math.random() * 200) + 100;
        this.attack = Math.floor(Math.random() * 15) + 10;
    };
    this.reset();
    this.html = '<span id="' + pId + '" class="character"><img src="' + pImg + '"><span class="charactername">' + pName + '</span><span class="playerstats">H=' + this.health + '<br>S=' + this.attack + '</span></span>';
    this.take_damage = function ( pGame, pFrom, pPoints ) {
        if ( pGame.roundOver ) { return }
        this.health -= pPoints;
        messageAppend( pFrom.name + " inflicted damage of " + pPoints + " on " + this.name + "!" );
        if ( this.health <= 0 ) { 
            this.health = 0;
            pGame.roundOver = true;
        } else {
            if ( this.whiteHat ) { this.attack += game.attackIncrement; }
        }
    },
    this.update_display = function() {
        var $stats = $("#" + this.id ).parent().next("span");
        $stats.find(".name").text( this.name );
        $stats.find(".health").text( this.health);
        $stats.find(".strength").text( this.attack);
    }
}

window.onload = function () {
    'use strict';

    game = new Game();
    game.round = 1;

    messageAppend( "Choose your champion!");

    for ( var i = 0; i<players.length; i++ ) {
        var t = new Fighter( players[i][0], players[i][1], players[i][2] );
        p.push( t );
        $("#chooser").append( t.html )
        $("#" + p[i].id ).click( function() {
            myPlayerID = $(this).attr("id");
            chosenOne( this.getAttribute( "id" ) );
        } );
    }

    $("#resetbtn").on("click", playAgain );
};

function newRound() {
    game.round++;
    game.roundOver = false;
}

function chosenOne( ) {
    console.log( "My player id is " + myPlayerID );
    
    p[myPlayerID].whiteHat = true;
    // $("#"+myPlayerID).empty();
    $("#myplayer").append( $(".chooser #" + myPlayerID).remove() );
    
    $(".chooser .character").off("click");
    
    for ( var i = 0; i < players.length; i++ ) {
        $("#" + p[i].id ).click( function() {
            myEnemyID = $(this).attr("id");
            chosenEnemy();
        });
    }
    $("#myplayer span").off("click");  // Unclick the champ
    message( "Now, choose your oponent.")

}

function chosenEnemy(  ) {
    showDefender();
    clickStop();
    $("#myenemy").append( $("#" + myEnemyID).remove() );
    $(".chooser .character").off("click");
    showOnlookers();
    $("#audience").append( $(".chooser .character").remove() );
    $("#selection").animate( { height: "0px", opacity: 0}, 700 );
    $(".stats").animate( { opacity: 1}, 500);
    $("#" + myPlayerID).click( attack );
    p[myPlayerID].update_display();
    p[myEnemyID].update_display();
    message( "Click on your champion to attack!")
}

function attack() {
    console.log( this );
    message("");
    p[myEnemyID].take_damage( game, p[myPlayerID], p[myPlayerID].attack);
    p[myPlayerID].take_damage( game, p[myEnemyID], p[myEnemyID].attack);
    p[myPlayerID].update_display();
    p[myEnemyID].update_display();
    if ( game.gameOver ) {
        if ( p[myPlayerID] === 0 ) {  // Loser
            gameLost();
        } else { 
            gameWon( game );
        }
    }
    if ( game.roundOver ) {
        console.log( p[myPlayerID] );
        console.log( p[myEnemyID] );
        if ( p[myPlayerID].health === 0 ) { 
            gameLost() 
        } else {
            $("#" + myEnemyID).animate( { opacity: .2 }, 500 );
            message( p[myEnemyID].name + " has been defeated!<br>Who will be next?")
            nextRound( game );
        }
    }
}

function nextRound() {
    showVanquished();
    game.roundOver = false;
    game.round++;
    p[myPlayerID].reset();
    $(".character").off("click");
    $(".stats").animate( { opacity: 0}, 500);
    $("#selection").animate( { height: "170px", opacity: 1}, 700 );
    $("#chooser").append( $("#audience .character").remove() );
    $("#defeated").append( $("#" + myEnemyID).remove() );
    $(".chooser .character").on( "click",  function() {
        myEnemyID = $(this).attr("id");
        chosenEnemy();
    });
    if ( $(".chooser .character").length === 0 ) {
        gameOver();
    }
    $("#round").text( game.round );
}

function hideDefender() {
    $("myenemy").css("display", "none");
}

function showDefender() {
    $("myenemy").css("display", "block");
}

function gameOver() {
    if ( p[myPlayerID].health === 0 ) { 
        gameLost();
    } else {
        gameWon();
    }
}
function gameWon() {
    $(".character").off("click");
    console.log( "Game over." );
    $("#selection").animate( { height: "0px", opacity: 0}, 700 );
    $(".defenderzone").animate( { height: "0px", opacity: 0}, 700 );
    message("<h1>You WON!</h1>")
    messageAppend("<button id='again'>Press this bad boy to play again</button>");
    $("#again").on("click", playAgain );
}

function playAgain() {
    $("#again").off("click");
    location.reload();
}

function gameLost() {
    $(".character").off("click");
    console.log( "Game over." );
    $("#selection").animate( { height: "0px", opacity: 0}, 700 );
    // $(".defenderzone").animate( { height: "0px", opacity: 0}, 700 );
    message("<h1>You Lost!</h1><br>");
    messageAppend("<br><button id='again'>Press this bad boy to play again</button>");
    $("#" + p[myPlayerID].id).animate( { opacity: 0 }, 4000 );
    $("#again").on("click", playAgain );
}

function showOnlookers() {
    $(".vanquishedzone").css( "display", "none" );
    $(".bystanders").css( "display", "block" );
}

function showVanquished() {
    $(".bystanders").css( "display", "none" );
    $(".vanquishedzone").css( "display", "block" );
}

function clickStop() {
    for ( var i = 0; i<p.length; i++ ) {
        $("#" + i ).off("click");
    }
}

function messageClear() {
    $("message").text("");
}

function message( pMessage ) {
    $("#message").html( pMessage );
}

function messageAppend( pMessage ) {
    $("#message").html( $("#message").text() + "<br>" + pMessage );
}
