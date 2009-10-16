 /* DOM HELP */
      DOMhelp = {

            addEvent: function(elem,evType,fn,useCapture) {

                    if(elem.addEventListener) {

                            elem.addEventListener('click',fn,useCapture);

                    } else if(elem.attachEvent) {

                            var r = elem.attachEvent('on'+evType,fn);

                         return r;

                    } else {

                         elem['on'+evType] = fn;
                    }
            },

            getTarget: function(e) {

                    var target = window.event ? window.event.srcElement : e ? e.target : null;

                    if(!target) {return false;}

                    while(target.nodeType != 1 && target.nodeName.toLowerCase() != 'body') {

                          target = target.parentNode;
                    }

               return target;
            },

            $: function(id) {return document.getElementById(id);} 
      };   