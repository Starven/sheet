function Note(pitch, duration, position, line, alteration) {
    this.pitch = pitch;
    this.duration = duration;
    this.position = position;
    this.line = line;
    this.connected = false;
    this.connectedNote = {};
    this.connection = "none";
    this.tied = false;
    this.tiedNote = {};
    this.selected = false;
    this.alteration = alteration;
    
}

Note.prototype.render = function(context, canvas, camera) {

    console.log("This was called!");

    context.fillStyle = "rgb(0,0,0)";
    context.beginPath();
    //context.arc(position.x, position.y, 5, 2 * Math.PI, false);
    context.ellipse(camera.x + position.x, camera.y + position.y, 5, 4, Math.PI/180, 0, 2 * Math.PI);
    context.fill();
    context.moveTo(camera.x + position.x - 4, camera.y + position.y);
    context.lineTo(camera.x + position.x - 4, camera.y + position.y + 30);
    if (this.duration == 8){
        //draw tail
        context.lineTo(camera.x + position.x + 6, camera.y + position.y + 12);
    }
   
    context.stroke();
    context.closePath();


}


// notes need to have a width/height based on scale
Note.prototype.mouseOver = function(mx, my) {
    if (mx >= this.position.x - 7.5 && mx <= this.position.x + 7.5
        && my >= this.position.y - 7.5 && my <= this.position.y + 7.5) {
            return true;
        } 
}

function renderNoteHead() {

}
