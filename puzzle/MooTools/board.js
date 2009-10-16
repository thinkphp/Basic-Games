        if(typeof exports === 'undefined') {

                  exports = {}; 
        }

        exports.game = function(game){

                var active,

                    winner,

                    events = {},

                    state = [],

                    sol = [];


                   if(game) init(game);

                /* */
                function initBoard(game){

                    game = game || {}; 

                    winner = game.winner || false;

                    active = game.win ? false: true;

                    //a state for puzzle in one time accidentaly
                    state = game.state || [
                                           ['1','5','6'],
                                           ['2','7','0'],
                                           ['4','8','3']
                                          ];    

                    //solution of puzzle hold in matrix
                    sol = game.sol || [
                                       ['1','2','3'],
                                       ['4','5','6'],
                                       ['7','8','0']
                                      ];

                    fire('init',state);

                };//end function init  


                /* */
                function findCoordsZero() {

                       var i,j,coords = [];

                       for(i=0;i<3;i++) {

                            for(var j=0;j<3;j++) {

                                if(state[i][j] == '0') {
                
                                      coords.push([i,j]);   

                                }//endif

                            }//endfor

                       }//endfor

                    return coords;
                }; 

                /* */
                function canMove(move) {

                         var x = move['Adrian'][0];

                         var y = move['Adrian'][1];

                         var flag = true;

                         switch(state[x][y]) {

                         case state[0][0]: 

                              if(state[x][y+1] != '0' && state[x+1][y] != '0') {flag = false;}

                              break; 

                          case state[0][2]: 

                               if((state[x][y-1]!=0) && (state[x+1][y]!=0)) {flag=false;}
                                
                          break; 

                          case state[2][2]: 

                               if((state[x][y-1]!=0) && (state[x-1][y]!=0)) {flag=false;}
                                
                          break; 

                          case state[2][0]: 

                               if((state[x-1][y]!=0) && (state[x][y+1]!=0)) {flag=false;}
                                
                          break; 

                          case state[1][1]: 

                               if((state[x-1][y]!=0) && (state[x][y+1]!=0) && (state[x+1][y]!=0) && (state[x][y-1]!=0)) {flag=false;}
                                
                          break; 

                          case state[0][1]: 

                               if((state[x][y-1]!=0) && (state[x][y+1]!=0) && (state[x+1][y]!=0)) {flag=false;}
                                
                          break; 

                          case state[1][2]: 

                               if((state[x-1][y]!=0) && (state[x+1][y]!=0) && (state[x][y-1]!=0)) {flag=false;}
                                
                          break; 

                          case state[2][1]: 

                               if((state[x][y+1]!=0) && (state[x][y-1]!=0) && (state[x-1][y]!=0)) {flag=false;}
                                
                          break; 

                          case state[1][0]: 

                               if((state[x-1][y]!=0) && (state[x+1][y]!=0) && (state[x][y+1]!=0)) {flag=false;}
                                
                          break; 

                         }

                    return flag;

                }//end function canMove

                /* Function which accomplish the movement of the piece and check if a obvious move or not */
                function moveOnBoard(move) {

                         var EMPTY;

                         var findZero = findCoordsZero();

                         var zx = findZero[0][0], zy = findZero[0][1];

                         if(!canMove(move)) {return false;}

                         var i = move['Adrian'][0], j = move['Adrian'][1];

                         var EMPTY = state[zx][zy]; 

                         state[zx][zy] = state[i][j];

                         state[i][j] = EMPTY;  

                         checkBoard();

                         if(window.console) {console.log('board > '+ active);}

                         fire('move',state);

                 return true;

                };//end function move


                /* */
                function checkBoard() {

                    var contor = 0;
 
                        for(var i=0;i<3;i++) {

                            for(var j=0;j<3;j++) {

                                  if(state[i][j] == sol[i][j]) {

                                       contor++;

                                  }//endif

                            }//endfor

                        }//endfor

                    if(contor == 9) {winner = 'Adrian'; active = false;}

                  return active;

                };//end function checkBoard 

                /* */
                function on(e,fn) {

                         events[e] = fn;
                };

                /* */
                function fire(e,args) {

                         if(events[e]) {

                              events[e](args); 
                         } 
                };

               /* */
               function getWinner() {
                     
                     return winner;  

               };//end function

               /* */
               function isActive() {

                     return active; 

               };//end function


               /* */
               function getState() {

                     return state; 

               };//end function
             

               function shufflePieces() {

                   var arr = [],k = 0;

                       for(var i=0;i<3;i++) {

                             for(var j=0;j<3;j++) {

                                   arr[k++] = state[i][j];  

                             }//endfor

                       }//endfor

                       var x = arr.length,aux;

                       while(x) {

                          y = Math.floor(Math.random()*x);

                          aux = arr[--x];

                          arr[x] = arr[y];

                          arr[y] = aux;

                       }//end while          

                       k = 0;

                       for(var i=0;i<3;i++) {

                             for(var j=0;j<3;j++) {

                                   state[i][j] = arr[k++];  

                             }//endfor

                       }//endfor

                       fire('shuffle',state);
 
               }//end function shufflePieces


           return {

                   init: initBoard,

                   on: on, 

                   fire: fire, 

                   move: moveOnBoard,

                   getState: getState,

                   isActive: isActive,

                   getWinner: getWinner,

                   shuffle: shufflePieces

                  };
                         
        };
