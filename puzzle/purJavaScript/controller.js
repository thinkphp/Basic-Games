(function() {
            var board = exports.game();

            //set a variable (type Object) called 'elems' which hold a vector of TDs
            var elems = [];

            //set variable called 'you'
            var you = 'Adrian';

            //function initialize of game
            var init = function() {
 
                   //call function setPieces
                   setPieces();           

                   board.on('init',showBoard);

                   board.on('move',showBoard);

                   board.on('shuffle',showBoard);

                   DOMhelp.addEvent(DOMhelp.$('board'),'click',onClick,false);

                   newGame(); 
            };

            //handle the click on the board
            var onClick = function(e) {

                var move = {};

                var target = DOMhelp.getTarget(e);

                if(target.nodeName.toLowerCase() == 'tr' || target.nodeName.toLowerCase() == 'table') {

                       return;
                }
 
                if(!board.isActive()) {

                      alert('Game Over');
 
                      return; 
                }

                for(var i=0;i<3;i++) {

                        for(var j=0;j<3;j++) {

                                if(elems[i][j] == target) {

                                    move[you] = [i,j];

                                }//endif

                        }//endfor

                }//endfor


                if(!board.move(move)) {

                       alert('Invalid move!');

                       return; 
                }
 
            };//end handler for click on the board

            //define function 'setPieces' which get all the TDs 
            //from table and hold them in matrix called 'elems'
            var setPieces = function() {

                     //get object with ID 'board'
                     var board = DOMhelp.$('board');

                     //get all TRs of object 'board'
                     var TRs = board.getElementsByTagName('tr');

                         //for each TR execute
                         for(var i=0;i<TRs.length;i++) {

                                 //push first vector in elems
                                 elems.push([]);

                                 //get all TDs from object TRs[i]
                                 var TDs = TRs[i].getElementsByTagName('td');

                                   //for each TDs execute                              
                                   for(var j=0;j<TDs.length;j++) {

                                           elems[elems.length-1].push(TDs[j]); 
                                   }//endfor

                         }//endfor 

            };//end function setPieces


            //define function showboard which display the pieces on the table
            //@param pieces (Integer Matrix) which holds the current label for TDs
            var showBoard = function(pieces) {

                     for(var i=0;i<3;i++) {

                         for(var j=0;j<3;j++) {

                                 elems[i][j].innerHTML = pieces[i][j];

                                 elems[i][j].style.visibility = 'visible';
 
                         }//endfor

                     }//endfor

                     setHiddenButton();

                     if(!board.isActive()) {

                            var winner = board.getWinner();

                            message(winner + ' won successfully!');
                     }
 
            };//end function showBoard

            var newGame = function() {

                    board.init();
            }


            var setHiddenButton = function() {

                    for(var i=0;i<3;i++) {

                        for(var j=0;j<3;j++) {

                             if(elems[i][j].innerHTML == '0') {

                                    elems[i][j].style.visibility = 'hidden';
                             } 
                        } 
                    }
            }

            var message = function(text) {

                DOMhelp.$('message').innerHTML = text; 
            }  

            DOMhelp.addEvent(DOMhelp.$('shuffle'),'click',function(e){

                     newGame();

                     board.shuffle();

            },false);

      //call function init
      init();
})();//DO EXEC

