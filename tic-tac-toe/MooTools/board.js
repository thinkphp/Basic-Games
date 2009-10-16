
      if(typeof(exports) === 'undefined') {

          exports = {};
      }   

      exports.Board = function(game) {

              var active,

                  events = {},

                  history,

                  state,
      
                  turn,

                  winner,

                  solinvec;

              if(game) {

                init(game);
              }

              function init(game) {

                  game = game || {};

                  active = game.win ? false : true;

                  history = game.history || [];

                  state = game.state || [
                                         ['','',''],
                                         ['','',''],
                                         ['','','']
                                        ];

                  turn = game.turn || 'x';

                  winner = game.win || null;

                  solinvec = game.solinvec || []; 

                  fire('init',state);

              };//end function init

               
              var check = function() {

                   var coords = [
                                 [[0,0],[0,1],[0,2]],
                                 [[1,0],[1,1],[1,2]],
                                 [[2,0],[2,1],[2,2]],
                                 [[0,0],[1,0],[2,0]],
                                 [[0,1],[1,1],[2,1]],
                                 [[0,2],[1,2],[2,2]],
                                 [[0,0],[1,1],[2,2]],
                                 [[0,2],[1,1],[2,0]]
                                ];

                   function match(coords) {
                            
                           var x = coords[0][0];
                           var y = coords[0][1];

                           var piece = state[x][y];

                               if(!piece) {return;}

                           for(var i=1;i<coords.length;i++) {
   
                                   x = coords[i][0];   
                                   y = coords[i][1];

                                   if(state[x][y] != piece) {return false;}

                           }//end for

                       return piece;
                   };

                   return function() {

                       var found, i;   

                          for(i=0;i<coords.length;i++) {

                                  var found = match(coords[i]);

                                      if(found) {

                                           winner = found;

                                           solinvec = coords[i];

                                        return active = false;

                                      }//endif                             
                          }//endfor

                          if(history.length >= 9) {active = false}

                       return active;
                   };

              }();


              function move(move) {

                       //if it's not your move then return false
                       if(!(turn in move)) {return false;}

                       var x = move[turn][0];

                       var y = move[turn][1];

                       var next, push = {};

                       //if the component is buzy then invalide move
                       if(state[x][y] != '') return false;                        

                       push[turn] = [x,y];

                       history.push(push);

                       state[x][y] = turn;

                       next = check();

                       fire('move',state); 

                       if(next) turnChange();
 
                 return true;

              };//end function move               


 
              /*
                Toggle the turn between 'x' and '0' 
              */
              function turnChange() {

                      turn = (turn == 'x') ? '0' : 'x'; 

                      fire('turn',turn);

              };//end function 



              /*
               Fire a custom event
               @param (String) e    - the name of the event to fire
               @param (String) args - the arguments to pass in
              */
              function fire(e,args) {

                       if(events[e]) {

                           events[e](args);
                       }

              };//end function fire



              /*
                Attach a handler listener to a custom event
                @param (String) e - the name of the event
                @param (String) fn - the function to call when the event is fired
              */
              function on(e, fn) {

                      events[e] = fn;

              };//end function on



              /*
                Function which return true if the board is still active and false if the board is inactive
                @return (Boolean) true or false
              */
              function isActive() {

                 return active;    

              };//end function

              /*
                @return (Array<Move>) the array of paste moves
              */
              function getHistory() {

                 return history;

              };//end function


              /*
                @return the array state game
              */
              function getState() {

                 return state;

              }//end function


              /*
                @return the array solution in vector game
              */
              function getSolinvec() {

                 return solinvec;

              }//end function



              function getWinner() {

                 return winner;

              };//end function


              function getTurn() {

                 return turn; 

              };//end function


              /*
                Function which get the avaible moves remains in board
                @return (Array) [i,j] coords
              */
              function getMoves() {

                 var moves = [];

                     for(var i=0;i<state.length;i++) {

                             for(var j=0;j<state[i].length;j++) {

                                     if(!state[i][j]) {

                                          moves.push([i,j]); 

                                     }//endif
                             }//endfor

                     }//endfor

                  //return coords[i,j]
                  return moves;

              };//end function


              return{
                     init: init,

                     move: move,

                     on: on,

                     fire: fire, 

                     getMoves: getMoves,

                     getTurn: getTurn,

                     getWinner: getWinner,

                     getState: getState,

                     getSolinvec: getSolinvec,

                     getHistory: getHistory, 

                     isActive: isActive
                    };
      }; 
