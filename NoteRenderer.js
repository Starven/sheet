function renderNote(note, value, position, context, canvas, camera, selected, line, preview) {
    //console.log("Note: " + note + " Position: " + position.x + ", " + position.y);
   // console.log("Selected: " + selected);

  


    if (note === "rest") {
        renderRest(value, position, context, canvas, camera, preview);
    } else {
       // console.log("Hitting it");
       // console.log(note);
      // console.log(position);
       // console.log(note.selected);
        if (!selected) {
            if (preview) {
                context.fillStyle = "rgb(239, 151, 43)";
                context.strokeStyle = "rgb(239, 151, 43)";
            } else {
                context.fillStyle = "rgb(0,0,0)";
                context.strokeStyle = "rgb(0,0,0)";
            }
            
        } else {
            context.fillStyle = "rgb(239, 151, 43)";
            context.strokeStyle = "rgb(239, 151, 43)";
        }


        
        context.beginPath();
        //context.arc(position.x, position.y, 5, 2 * Math.PI, false);
        context.ellipse(camera.x + position.x, camera.y + position.y, 9, 7, Math.PI/-5.5, 0, 2 * Math.PI);
        if (value <= 6) {
            context.fill();
        }
        
        
        context.stroke();
        context.closePath();

        //render ledgerbit

        
        if (line.number < 10 || line.number > 18) {

            let posOffset = 0;
           
            if (line.number < 10) {
                for (let n=line.number;n<10;n++) {
                    posOffset = (10 * (n-line.number));
                    //console.log(n);
                    if (n % 2 === 0) {
                        context.beginPath();
                        context.moveTo(camera.x + position.x - 12, camera.y + position.y + posOffset);
                        context.lineTo(camera.x + position.x + 12, camera.y + position.y + posOffset);
                        context.stroke();
                        context.closePath();
                    } 
                }
            }
           
           /* if (line.number % 2 === 0) {
                context.beginPath();
                context.moveTo(camera.x + position.x - 10, camera.y + position.y);
                context.lineTo(camera.x + position.x + 10, camera.y + position.y);
                context.stroke();
                context.closePath();
            } */
            
        }
        
        if (note.alteration > 0) {
            renderSharp(position.x - 20, position.y - 5, context, camera);
        }

        // redo this sorta

        if (value === 3 || value === 1.5 || value === 0.75 || value === 0.375) {

            context.beginPath();
            context.arc(camera.x + position.x + 15, camera.y + position.y, 2, 2 * Math.PI, false);
            //context.ellipse(camera.x + position.x + 2, camera.y + position.y, 3, 5, Math.PI/180, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();

        }

        //bounds rendering

        /*
        context.beginPath();
        context.strokeStyle = "rgb(0,0,255)";
        context.rect(camera.x + position.x - 7.5, camera.y + position.y - 7.5, 15, 15);
        context.stroke();
        context.closePath();

        */
    }
}

function renderRest(value, position, context, canvas, camera, preview) {

    if (preview) {
        context.fillStyle = "rgb(239, 151, 43)";
    } else {
        context.fillStyle = "rgb(0,0,0)";
    }

    if (value === 16) {
        
        context.fillRect(camera.x + position.x, camera.y + position.y, 20, 10);
    } else if (value === 8) {
        context.fillRect(camera.x + position.x, camera.y + position.y-10, 20, 10);
    } else if (value === 4) {
        context.fillRect(camera.x + position.x, camera.y + position.y-20, 5, 40);
    } else if (value === 2) {
        context.fillRect(camera.x + position.x, camera.y + position.y-10, 5, 20);
    } else if (value === 1) {
        context.fillRect(camera.x + position.x, camera.y + position.y-10, 5, 20);
    }
}

function renderStems(note, value, position, context, canvas, camera, selected, preview) {

    //this is just for funs you know
    if (preview) {
        context.strokeStyle = "rgb(239, 151, 43)";
    } else {
        context.strokeStyle = "rgb(0,0,0)";
    }
    
    context.beginPath();
    context.moveTo(camera.x + position.x - 6, camera.y + position.y);
    context.lineTo(camera.x + position.x - 6, camera.y + position.y + 70);
    if (value === 2){
        //draw tail
        context.lineTo(camera.x + position.x + 6, camera.y + position.y + 12);
    }
    context.stroke();
    context.closePath();

}

function renderStem(section, context, canvas, camera, preview) {

    

    if (section.note != "rest") {
        
        //console.log("ahele");
        if (preview) {
            context.strokeStyle = "rgb(239, 151, 43)";
        } else {
            context.strokeStyle = "rgb(0,0,0)";
        }
        context.beginPath();
        if (section.stemDirection === "down") {
            context.moveTo(camera.x + section.notePosition.x - 8, camera.y + section.stemYPositions.y1);
            context.lineTo(camera.x + section.notePosition.x - 8, camera.y + section.stemYPositions.y2);
        } else {
            context.moveTo(camera.x + section.notePosition.x + 8, camera.y + section.stemYPositions.y1);
            context.lineTo(camera.x + section.notePosition.x + 8, camera.y + section.stemYPositions.y2);
        }
        
      //  if (section.value === 0.5 && !section.connected){
            //draw tail
      //      context.lineTo(camera.x + section.notePosition.x + 6, camera.y + section.stemYPositions.y2 + 12);
      //  }

      if (section.connected) {
        if (section.stemDirection === "down") {
            context.lineTo(camera.x + section.connectedNote.x + 20, camera.y + section.connectedNote.y);
        } else {
            context.lineTo(camera.x + section.connectedNote.x + 30, camera.y + section.connectedNote.y);
        }
        

        } else {

            if (section.value < 3) {
                if (section.stemDirection === "up") {
                    context.lineTo(camera.x + section.notePosition.x + 16, camera.y + section.stemYPositions.y2 + 12);
                } else {
                    context.lineTo(camera.x + section.notePosition.x + 6, camera.y + section.stemYPositions.y2 - 12);
                }
            }

            
        }
    context.stroke();
    context.closePath();
    }
}

function renderSharp(posX, posY, context, camera) {

    context.strokeStyle = "rgb(0,0,0)";
    context.beginPath();

    context.moveTo(camera.x + posX, camera.y + posY + 1);
    context.lineTo(camera.x + posX, camera.y +  posY + 16);
    context.moveTo(camera.x + posX + 7.5, camera.y + posY);
    context.lineTo(camera.x + posX + 7.5, camera.y + posY + 15);

    context.moveTo(camera.x + posX - 5, camera.y + posY + 5);
    context.lineTo(camera.x + posX + 12.5, camera.y + posY + 2.5);

    context.moveTo(camera.x + posX - 5, camera.y + posY + 12.5);
    context.lineTo(camera.x + posX + 12.5, camera.y + posY + 10);

    context.stroke();

    context.closePath();
}