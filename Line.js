
var HOVER_COLOUR = "rgb(228, 228, 228)";
var STANDARD_COLOUR = "rgb(228, 228, 228)";

function Line(beats, position, width, ledger, note, sharpNote, flatNote, number) {
    this.groupings = []; //[[]] array, eg. 4/4 has 4 positions (main) RENAME TO GROUPINGS
    this.groupingDimensions = [];
    this.noteCount = 0;
    this.colour = STANDARD_COLOUR;
    this.position = position;
    this.width = width;
    this.height = 5;
    this.ledger = ledger;
    this.number = number;
    this.bounds = {x1: this.position.x, x2: this.position.x + this.width,
        y1: this.position.y - this.height, y2: this.position.y + this.height};

    this.note = note;
    this.sharpNote = sharpNote;
    this.flatNote = flatNote;

    for (var beat=0;beat<beats;beat++) {
        this.groupings.push([]);
    }

    this.setGroupingDimensions();
}

Line.prototype.addNote = function(pos, note) {

    this.groupings[pos].push(note);
    //this.groupingDimensions[pos].used = true;
   // this.groupingDimensions[pos].note = this.groupings[pos].length-1;
    this.noteCount += 1;
}

Line.prototype.setWidth = function(width) {
    this.width = width;
}

Line.prototype.render = function(context, canvas, camera) {
    if (!this.ledger) {
        context.beginPath();
        context.strokeStyle = "rgba(44, 44, 44, 1)";
        context.moveTo(camera.x + this.position.x, camera.y + this.position.y);
        context.lineTo(camera.x + this.position.x + this.width, camera.y + this.position.y);
        context.stroke();
        context.closePath();
       // context.fillStyle = "rgb(228, 228, 228)";
       // context.fillRect(this.position.x, this.position.y, this.width, 1);
    }
    
   // context.strokeStyle = "rgb(255,0,0)";
    //context.rect(this.position.x, this.position.y - 5, this.width, 10);
    //context.stroke();
}

Line.prototype.mouseOver = function(mx, my) {
    
    //console.log("MX: " + mx + " MY: " + my);
   // console.log(this.position.x, this.position.y);

    if (mx >= this.position.x && mx <= (this.position.x + this.width)
    && my >= this.position.y - 5 && my <= this.position.y + 5) {
       // this.colour = HOVER_COLOUR;
        return true;
    } else {
       // this.colour = STANDARD_COLOUR;
        return false;
    }

}


Line.prototype.setGroupingDimensions = function() {

    var section_width = this.width / this.groupings.length;

    for (var b=0;b<this.groupings.length;b++) {
        this.groupingDimensions.push([]);
    }
    

    for (let gd = 0;gd<this.groupings.length;gd++) {
        this.groupingDimensions[gd].push(new LineGrouping(1, false, 0, {x: (this.position.x + (gd + 1) * section_width - section_width / 2), y: this.position.y}, section_width));
    }
    //this.groupingDimensions[0].push(new LineGrouping(1, false, 0, {x: (this.position.x + 1 * section_width - section_width / 2), y: this.position.y}, section_width));
  //  this.groupingDimensions[1].push(new LineGrouping(1, false, 0, {x: (this.position.x + 2 * section_width - section_width / 2), y: this.position.y}, section_width));
   /// this.groupingDimensions[2].push(new LineGrouping(1, false, 0, {x: (this.position.x + 3 * section_width - section_width / 2), y: this.position.y}, section_width));
    //this.groupingDimensions[3].push(new LineGrouping(1, false, 0, {x: (this.position.x + 4 * section_width - section_width / 2), y: this.position.y}, section_width));
}

Line.prototype.divideGrouping = function(area, pos, type) {

    //area = which note section was clicked
    //pos = position/aka is the new note to be inserted before or after the area
    //group = which group was selected

    var div = this.groupingDimensions[area].length;

    if (div === 0) {
        if (type === "triplet") {
            div = 3;
        } else if(type === "crotchet") {
            div = 1;
        } else if (type === "quaver") {
            div = 2;
        } else if (type === "semi-quaver") {
            div = 4;
        } else if (type === "16th") {
            div = 8;
        }
    } else {
        //idunno

        if (div == 1) {
            if (type == "quaver") {
                //
            }
        }
    }

    

    this.groupingDimensions[area] = [];

}

Line.prototype.renderNotes = function(context, canvas) {

    for (var gd=0;gd<this.groupingDimensions.length;gd++) {
        for (let g=0;g<this.groupingDimensions[gd].length;g++) {
           // console.log(this.groupings[gd][g]);
           if (this.groupings[gd][g] != undefined) {
            this.groupings[gd][g].render(context, canvas, this.groupingDimensions[gd][g].position);
           }
        }
    }

} 

//grouping

function LineGrouping(value, used, note, position, width) {

    this.value = value; //1/0.5/0.25/0.125 etc.
    this.used = used; //true/false
    this.note = note; //note index
    this.position = position;
    this.width = width;
    
}