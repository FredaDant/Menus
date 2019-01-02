
        var idIncrement = 1;
        var charsTyped = [];
        var id_target = document.getElementById("body");
        var id_save = id_target.getAttribute("id") ;
        var oldElement  =  document.getElementById("hidden");
        //document.addEventListener('keydown',checkKeyPressed, false);
        document.getElementById('body').addEventListener('keypress',checkKeyPressed, false);
        /* Function to create input areas on the form when button clicked */
        function myFunction(elemnt_id) {
            var i;
            var dateOfMenu = document.getElementById(elemnt_id);
            var paragraph = document.createElement("P");

            document.body.insertBefore(paragraph, dateOfMenu);
            var x = document.createElement("INPUT");
            x.setAttribute("type", "text");
            //x.setAttribute("value", "");
            x.setAttribute("id", elemnt_id + "_" + idIncrement);
            x.style.width = "300px"
            idIncrement+=1;
            document.body.insertBefore(x, dateOfMenu);
        }
        function checkKeyPressed(e) {
            // save event so it does not go out of scope this may not be necessary due to 
            // ham fisted coding so far
            var myEvent = e;


            if (id_save == "body") {
                id_save = myEvent.target.getAttribute("id");
                //console.log(id_save);
            }

            // this is about bubbling ??
            if (myEvent.target !== myEvent.currentTarget){
                //console.log(myEvent.currentTarget.getAttribute("id"));
                //console.log("next is target");
                //console.log(myEvent.target.getAttribute("id"));

                    
                if(id_save !==  myEvent.target.getAttribute("id") ) {
                        // should be here if focus moves from text box to another
                    console.log("Should get here if text box changes")
                    document.getElementById(id_save).setAttribute("value", charsTyped);
                    charsTyped = [];

                     


                }
                    var charCode = typeof myEvent.which == "number" ? myEvent.which : myEvent.keyCode;


                    console.log(String.fromCharCode(charCode));
                    if (charCode) {
                        charsTyped.push(String.fromCharCode(charCode));
                        console.log(charsTyped);

                    }
                }
            }
            function tstFuncion(){
                
                var form = document.createElement("form", {action: "createMenu",
                    method: "POST",
                    style: "display: inline"});
                
                for (let i = 0; i < document.body.childNodes.length; i++) {
                   // var x = document.body.childNodes[i].getAttribute("id");
                  //  console.log(x);
                 
                  
                /*  if(i < 2){
                      
                    //alert( document.body.childNodes[i].textContent); 
                    var x = document.body.childNodes[i].nodeName;
                    alert( document.body.childNodes[i].nodeType);
                    alert(x);
                  }*/
                   if(document.body.childNodes[i].nodeType === 1 && document.body.childNodes[i].nodeName === "LABEL")
                   {
                        x = document.body.childNodes[i].getAttribute("id");
                     //   alert(x);
                        //nwNode =  document.body.childNodes[i].cloneNode(true);
                        nwLabel = document.createElement("label");
                        nwLabel.setAttribute("id", x);
                        nwLabel.setAttribute("value",  x + " Menu");
                        nwLabel.innerText = x;
                        form.appendChild(nwLabel);
                        var paragraph = document.createElement("P");
                        form.appendChild(paragraph);

                    }
                    if(document.body.childNodes[i].nodeType === 1 && document.body.childNodes[i].nodeName === "INPUT")
                    {
                        nwNode =  document.body.childNodes[i].cloneNode(true);
                        form.appendChild(nwNode);
                        var paragraph = document.createElement("P");
                        form.appendChild(paragraph);


                    }
                    

                   
                   /* if(x==="LABEL") {
                        x = document.body.childNodes[i].getAttribute("id");
                        alert(x); 
                    }
                    if(x==="INPUT")  {
                        alert("Hi");
                        alert(document.body.childNodes[i].value);
                        x = document.body.childNodes[i].getAttribute("id");
                        if(x)
                        {
                            alert(x);
                        }
                        else {
                            alert("WTF");
                        }
                        
                    }*/
                   
                   
               // } // end of if
                
                }
                document.body.appendChild(form);
                form.submit();
            }

            