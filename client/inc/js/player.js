/*
    file: js/player.js
    desc: player functions
*/

var player = {
    //start
    start: function() {
        if( localStorage.getItem( 'pkrusset_save' ) )
            data.player = JSON.parse( localStorage.getItem( 'pkrusset_save' ) );

        //load our map/etc
        setTimeout( function() { map.loadFile( data.player.map, function() {
            move.moveTo( data.player.xpos, data.player.ypos );
            loader.hide();
        }) }, 500 );

        //bind save link
        $( 'a.pkrusset_save' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            player.save();
        });
        $( 'a.pkrusset_new' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            player.new();
        });

        //no pokemon?
        if( data.player.pokemon.length == 0 )
            player.newChoose();

        return true;
    },

    //save
    save: function() {
        localStorage.setItem( 'pkrusset_save', JSON.stringify( data.player ) );
        pkrusset.log( 'Player saved' );
        return true;
    },

    //new game
    new: function() {
        if( prompt( 'Please type in "CONFIRM" to continue, ALL data will be deleted' ) != 'CONFIRM' ) return false;

        localStorage.removeItem( 'pkrusset_save' );
        window.location = window.location;
    },

    //new game
    newChoose: function() {
        $( 'body' ).append( '\
            <div id="overlay"><div class="wrap">\
                <div class="tab team">\
                    <h2>Please choose your first Pokemon</h2>\
                    <a href="#" class="choose_first_pokemon" data-pokemon="1"><img src="inc/img/pokemon/front/1.png" /><strong>Bulbasaur</strong><span>Level 10</span></a>\
                    <a href="#" class="choose_first_pokemon" data-pokemon="4"><img src="inc/img/pokemon/front/4.png" /><strong>Charmander</strong><span>Level 10</span></a>\
                    <a href="#" class="choose_first_pokemon" data-pokemon="7"><img src="inc/img/pokemon/front/7.png" /><strong>Squirtle</strong><span>Level 10</span></a>\
                </div>\
            </div></div><!--end overlay-->\
        ' );

        //bind the links
        $( '.choose_first_pokemon' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            $( '#overlay .tab' ).html( '<img src="inc/img/loader.gif" />' );

            //get pokemon id
            var pkid = $( ev.target ).parent().attr( 'data-pokemon' );
            //send command to the server
            network.send( 'choose_first_pokemon', { pokemon_id: pkid }, function( d ) {
                data.player.pokemon[0] = d;
                $( '#overlay' ).remove();
            });
        });
    }
};

pkrusset.addStart( player.start );