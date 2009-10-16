(function() {
            //grab object board
            var board = exports.game();

            //set a variable (type Object) called 'elems' which hold a vector of TDs
            var elems = [];

            //set variable called 'you'
            var you = 'Adrian';

            //get object loggetr
            var logger = $('logger');
 
            //hold in fx an object Fx for animation logger box
            var fx = new Fx.Morph(logger,{duration: 1200});

            var nrMoves = 0;

            var hidden,running = false; 

            var tr =  Fx.Transitions.Back.easeInOut;


            //Function that make the initialization of the puzzle
            var init = function() {
 
                   //call function setPieces
                   setPieces();

                   //set positions
                   setPos();

                   //attach a handler for event 'init'
                   board.on('init',showBoard);

                   //attach a handler for event 'move'
                   board.on('move',slidePiece);

                   //attach a handler for event 'shuffle'
                   board.on('shuffle',showBoard);

                   //attach a handler board object that fires when we clicks
                   $('board').addEvent('click',onClick); 

                   //start new game
                   newGame(); 

                   $('moves').set('text',0);

                   resetCounter(); 

                   focusBoard();
            };

            var setPos = function() {

                var board = $('board');

                var spans = $$('#board span');

                    spans.setStyle('position','absolute');

                for(var i=0;i<3;i++) {

                    for(var j=0;j<3;j++) {

                            elems[i][j].setStyles({'left':j*100,'top':i*100});
                    }
                }  

            } 

            //Function which make the focus piece
            var focusBoard = function() {

                   //grab the object board that have the id 'board'
                   var board = $('board');
 
                   //get all tds from board
                   var tds = board.getElements('span');

                       //for each td add events handlers
                       tds.each(function(td){

                           //add handler for type of events mouseover and mouseout
                           td.addEvents({

                                         'mouseover': function(e) {
 
                                             if(!(this.get('html') == '0')) {
    
                                                  this.morph({'background-color':'#BABABA','borderColor':'#888888','color':'#ffff00'});
                                             }
                                         },

                                         'mouseleave':function(e) {
 
                                                  this.morph({'background-color':'#ccc','borderColor':'#333','color':'#ffffdd'});
                                         }

                                      });//end addEvents
                       });//end each      
               
            }

            //handle the click on the board
            //@param e (Object Event) using Event Delegation
            var onClick = function(e) {

                //set object move
                var move = {};

                //get target
                var target = e.target;

                if(running) {

                      burn('Running');
 
                      return; 
                }

                //if the board is not active then game over and it must shuffle the pieces for new game
                if(!board.isActive()) {

                      burn('Game Over! <br/> Shuffle Pieces!');
 
                      return; 
                }

                //If we clicked on the TR or TABLE then there is a empty box and return false
                if(target.nodeName.toLowerCase() == "div") {

                    burn('Empty piece!');

                    return;

                 }

                //finds the coords(x,y) of the matrix object board
                for(var i=0;i<3;i++) {

                        for(var j=0;j<3;j++) {

                                if(elems[i][j] == target) {

                                    move[you] = [i,j];

                                }//endif

                        }//endfor

                }//endfor


                //with then object {'Adrian':[x,y]} sent as parameter we make a move on the board
                // if object is following: 'Adrian':[1,1] we move at the middle of board (center)
                if(!board.move(move)) {

                       burn('Invalid move!');

                       return; 

                } else {

                       nrMoves++;

                       if(nrMoves == 1) { startCounter(); } 

                       $('moves').set('text',nrMoves);
                }
 
            };//end handler for click on the board

            //define function 'setPieces' which grab all the TDs 
            //from table and hold them in matrix called 'elems'
            var setPieces = function() {

                     //get object with ID 'board'
                     var board = $('board');

                     //get all TRs of object 'board'
                     var TRs = board.getElements('div');

                         //for each TR execute
                         TRs.each(function(tr){

                                 //push first vector in elems
                                 elems.push([]);

                                 //get all TDs from object tr
                                 var TDs = tr.getElements('span');

                                     //for each td from tr execute
                                     TDs.each(function(td){

                                           elems[elems.length-1].push(td); 

                                     });
                         });

            };//end function setPieces

             var slidePiece = function(pieces) {

                 if(pieces['Adrian']) { 

                         running = true;

                         var x = pieces['Adrian'][0], y = pieces['Adrian'][1];

                         var piece = elems[x][y], z = pieces['Adrian'][2];

                         var fx = new Fx.Tween(piece,{duration: 500, 

                                                 transition: tr,
  
                                                 onComplete: function() { 

                                                            showBoard(board.getState());

                                                            hidden.tween(pieces['p'],pieces['z']);

                                                            running = false;}
                                               });

                                   fx.start(pieces['pos'],pieces['px']);  
                  }//endif

             };//end function


            //define function showboard which display the pieces on the table
            //@param pieces (Integer Matrix) which holds the current label for TDs
             var showBoard = function(pieces) { 

                     //for each TRs
                     for(var i=0;i<3;i++) {

                         //for each TDs
                         for(var j=0;j<3;j++) {

                                 //set the appropriate value from backend matrix state
                                 elems[i][j].set('html',pieces[i][j]);

                                 elems[i][j].setStyle('visibility','visible');
 
                         }//endfor

                     }//endfor

                     //called function
                     setHiddenButton();


                     //if the boad is not available then we have the winner!
                     if(!board.isActive()) {

                            var winner = board.getWinner();

                            stopCounter();

                            burn(winner + ' Won! <br/> Congratulations!');

                            message(winner + ' won successfully!');
                     }
 
            };//end function showBoard


            /* set empty button */
            var setHiddenButton = function() {

                    for(var i=0;i<3;i++) {

                        for(var j=0;j<3;j++) {

                             if(elems[i][j].innerHTML == '0') {

                                 elems[i][j].setStyle('visibility','hidden');

                                 hidden = elems[i][j];

                             }//endif

                        }//endfor

                    }//endfor

            };//end function setHiddenButton

            /* Function which display a messange in div with id 'message' */
            //@param text (String) text to update on then messange logger 
            var message = function(text) {

                $('message').set('html',text); 
            }  

            /* Attach a handler button with id 'shuffle' at type of the event 'click'*/
            //@param e (Object Event) 
            $('shuffle').addEvent('click',function(e){ 

                     stopCounter();

                     nrMoves = 0; 

                     burn('Shuffle Pieces!');

                     newGame();

                     board.shuffle();

            });

          //Function that accomplish an animation with logger box
          //@param text (String) text up-to-date
          var burn = function(text) { 

              //set up the logger text
              logger.set('html',text);

              //called method for animation
              fx.start({

                'background-color': ['#fff36f', '#fff'],

                'opacity': [1, 0]
 
              });  

          };//end function burn

          //Fuction start new game
          var newGame = function() {

               $('message').set('html','');

               $('moves').set('text',0);

               board.init();

          };//end function



          /* starts Attach Timer */

          var interval; 

          var currentCounter = new Hash({msec: 0,sec: 0,min: 0});

          var timerCount = function() { 

              if(this.sec <= 9) {

                     $('time_sec').set('text','0'+this.sec);

              } else {

                     $('time_sec').set('text',this.sec);
             }

              var currentmsec = this.msec++;

                  if(currentmsec == 60) { 

                        ++this.sec;
 
                        this.msec = 0; 
                  }

                  if(this.sec == 60) { 
                       
                       this.min++;

                       if(this.min <= 9) {  

                               $('time_min').set('text','0'+this.min);

                       } else {

                               $('time_min').set('text',this.min);
                       }

                       this.sec = 0;
                  }


                  if(currentmsec <= 9) {

                      $('time_msec').set('text','0'+currentmsec);

                  } else {

                      $('time_msec').set('text',currentmsec);
                  }

          }  

          var startCounter = function() {

                    resetCounter();

                    interval = timerCount.periodical(10,currentCounter);
          }            

          var stopCounter = function() {

                    $clear(interval);

		    $('timer').highlight('#EFE02F');

          }

          var resetCounter = function() { 

                    $clear(interval);

		    $('timer').highlight('#EFE02F');

                    currentCounter.set('msec',0);

                    currentCounter.set('sec',0);

                    currentCounter.set('min',0);

                    $('time_msec').set('text','0'+currentCounter.msec);

                    $('time_sec').set('text','0'+currentCounter.sec);

                    $('time_min').set('text','0'+currentCounter.min);     

          };

          /* ends Attach Timer */

      //init called
      init();

})();//DO EXEC

