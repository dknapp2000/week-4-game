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

function Fighter (pId, pName, pImg) {
    this.id = pId;
    this.name = pName;
    this.img = pImg;
    this.health = Math.floor(Math.random() * 200) + 100;
    this.attack = Math.floor(Math.random() * 60) + 50;
    this.html = '<span id="' + pId + '" class="character"><img src="' + pImg + '"><span class="charactername">' + pName + '</span></span>';
    this.take_damage = function ( pFrom, pPoints ) {
        if ( roundOver ) { return }
        this.health -= pPoints;
        console.log( pFrom );
        console.log( pFrom.name + " inflicted damage of " + pPoints + " on" + this.name + "!" );
        if ( this.health <= 0 ) { 
            this.health = 0;
            roundOver = true;
        }
    },
    this.update_display = function() {
        var $stats = $("#" + this.id ).parent().next("span");
        $stats.find(".name").text( this.name );
        $stats.find(".health").text( this.health);
        $stats.find(".strength").text( this.attack);
    },
    this.newRound = function() {
        this.health = Math.floor(Math.random() * 200) + 100;
        this.attack = Math.floor(Math.random() * 60) + 50;
    }
}

window.onload = function () {
    'use strict';

    for ( var i = 0; i<players.length; i++ ) {
        var t = new Fighter( players[i][0], players[i][1], players[i][2] );
        p.push( t );
        $("#chooser").append( t.html )
        $("#" + p[i].id ).click( function() {
            console.log( this );
            myPlayerID = $(this).attr("id");
            chosenOne( this.getAttribute( "id" ) );
        } );
    }
};

function chosenOne( selection ) {
    console.log( "My player id is " + myPlayerID );
    
    $("#"+myPlayerID).empty();
    $("#myplayer").append( p[myPlayerID].html);
    
    $(".chooser .character").off("click");
    
    for ( var i = 0; i < players.length; i++ ) {
        $("#" + p[i].id ).click( function() {
            myEnemyID = $(this).attr("id");
            chosenEnemy();
        });
    }
}

function chosenEnemy(  ) {
    $("#myenemy").append( $("#" + myEnemyID).remove() );
    $(".chooser .character").off("click");
    $("#audience").append( $(".chooser .character").remove() );
    $("#selection").animate( { height: "0px", opacity: 0}, 1200 );
    $(".stats").animate( { opacity: 1}, 1000);
    $("#" + myPlayerID).click( attack );
    p[myPlayerID].update_display();
    p[myEnemyID].update_display();
}

function attack() {
    console.log( this );
    p[myEnemyID].take_damage( p[myPlayerID], p[myPlayerID].attack);
    p[myPlayerID].take_damage( p[myEnemyID], p[myEnemyID].attack);
    p[myPlayerID].update_display();
    p[myEnemyID].update_display();
}




