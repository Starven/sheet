var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


canvas.width = width;
canvas.height = height;

context.fillStyle = "rgb(255,255,255)";
context.fillRect(0,0,canvas.width,canvas.height);

var Measures = [];
var Tracks = [];

var scale = 1.0;

var measureLength = 300;

var camera = {x: canvas.width / 2 - measureLength * 1.5, y: 0};

var measure_over = -1;
var line_over = -1;
var section_over = -1;
var track_over = -1;

var mouse_clicked = false;
var touching = false;
var noteValue = 4;
var alteration = 0;
var insertRest = false;

var currentMeasure = 0;

var notate = true;
var notateRest = false;

var dragging = false;
var dragPos = {x: 0, y: 0};
var clickPos = {x: 0, y: 0};

var moveNotes = false;
var audioPlayer = new AudioPlayer(context, canvas, camera);

this.measuresSelected = [];

const uiColour = "rgb(130, 179, 216)";
const highlightColour = "rgb(239, 151, 43)";

audioPlayer.setVolume(-0.9);

let sheet = new Sheet(canvas, context);

// UI TESTING

var UIElements = createUIElements();

//UI related variables

var renderCanvasInterface = true;

var selectedClef = "treble";
var selectedKeySig = "CMaj";


function createUIElements() {
    let elements = [];

    var newbutton = new UIElement({x: 0, y: 0}, 30, 30, returnImage("newicon.png"), 22, 25, uiColour, "rgb(244, 191, 66)", true);

    newbutton.clicked = function() {
        newFile();
    }

    //POINTER AND NOTE BUTTONS

    var pointerbutton = new UIElement({x: 30, y: 0}, 30, 30, returnImage("pointericon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var notebutton = new UIElement({x: 60, y: 0}, 30, 30, returnImage("noteicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    notebutton.selected = true;
    notebutton.clicked = function() {
        changeNote("true");
        this.selected = true;
        pointerbutton.selected = false;
    }

    pointerbutton.clicked = function() {
        changeNote("false");
        this.selected = true;
        notebutton.selected = false;
    }

    //

    var playbutton = new UIElement({x: 90, y: 0}, 30, 30, returnImage("playicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    playbutton.clicked = function() {
        currentMeasure = 0;
        playMeasure(0);
        this.selected = true;
        stopbutton.selected = false;
    }

    var stopbutton = new UIElement({x: 120, y: 0}, 30, 30, returnImage("buttonstop.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    //NOTE VALUE BUTTONS
    var semibrevebutton = new UIElement({x: 0, y: 30}, 30, 30, returnImage("semibreveicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var minumbutton = new UIElement({x: 30, y: 30}, 30, 30, returnImage("minumicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var crotchetbutton = new UIElement({x: 60, y: 30}, 30, 30, returnImage("crotcheticon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var quaverbutton = new UIElement({x: 90, y: 30}, 30, 30, returnImage("quavericon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var semiquaverbutton = new UIElement({x: 120, y: 30}, 30, 30, returnImage("semiquaver.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    semibrevebutton.clicked = function() {
        noteValue = 16;

        this.selected = true;
        minumbutton.selected = false;
        crotchetbutton.selected = false;
        quaverbutton.selected = false;
        semiquaverbutton.selected = false;
    }

    minumbutton.clicked = function() {
        noteValue = 8;

        this.selected = true;
        semibrevebutton.selected = false;
        crotchetbutton.selected = false;
        quaverbutton.selected = false;
        semiquaverbutton.selected = false;
    }

    crotchetbutton.clicked = function() {
        noteValue = 4;

        this.selected = true;
        semibrevebutton.selected = false;
        minumbutton.selected = false;
        quaverbutton.selected = false;
        semiquaverbutton.selected = false;
    }

    quaverbutton.clicked = function() {
        noteValue = 2;

        this.selected = true;
        semibrevebutton.selected = false;
        minumbutton.selected = false;
        crotchetbutton.selected = false;
        semiquaverbutton.selected = false;
    }

    semiquaverbutton.clicked = function() {

        noteValue = 1;

        this.selected = true;
        semibrevebutton.selected = false;
        minumbutton.selected = false;
        crotchetbutton.selected = false;
        quaverbutton.selected = false;
    }

    crotchetbutton.selected = true;

    //
    var sharpbutton = new UIElement({x: 270, y: 30}, 30, 30, returnImage("sharpicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)

    sharpbutton.clicked = function() {

        if (alteration > 0) {
            alteration = 0;
        } else {
            alteration = 1;
        }
    }

    var flatbutton = new UIElement({x: 300, y: 30}, 30, 30, returnImage("flaticon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)

    

    flatbutton.clicked = function() {

        if (alteration < 0) {
            alteration = 0;
        } else {
            alteration = -1;
        }

    }

    var naturalbutton = new UIElement({x: 330, y: 30}, 30, 30, returnImage("naturalicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true);

    var restbutton = new UIElement({x: 360, y: 30}, 30, 30, returnImage("resticon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)

    restbutton.clicked = function() {
        insertRest = !insertRest;
    }

    var deletebutton = new UIElement({x: 390, y: 30}, 30, 30, returnImage("deleteicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)

    deletebutton.clicked = function() {
        deleteSelected();
    }

    var addmeasurebutton = new UIElement({x: 150, y: 0}, 30, 30, returnImage("addmeasureicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)

    addmeasurebutton.clicked = function() {
        addMeasures();
    }

    var removemeasurebutton = new UIElement({x: 180, y: 0}, 30, 30, returnImage("removemeasureicon.png"), 25, 25, uiColour, "rgb(244, 191, 66)", true)
    //does nothing atm :)

    elements.push(newbutton);
    elements.push(pointerbutton);
    elements.push(notebutton);
    elements.push(playbutton);
    elements.push(semibrevebutton);
    elements.push(minumbutton);
    elements.push(crotchetbutton);
    elements.push(quaverbutton);
    elements.push(semiquaverbutton);
    elements.push(sharpbutton);
    elements.push(flatbutton);
    elements.push(naturalbutton);
    elements.push(restbutton);
    elements.push(deletebutton);
    elements.push(addmeasurebutton);
    elements.push(removemeasurebutton);
    elements.push(stopbutton);

    return elements;

}

//UI ELEMENT FUNCTIONS, NEED TO RE-ORGANISE THIS ENTIRE FILE BUT FOR NOW THEY ARE HERE



function returnImage(filename) {

    let file = new Image;
    file.onload = function() {
        context.drawImage(file, 0, 0, 22, 25);
        renderMeasures();
    }
    file.src = "Resources/" + filename;

    return file;
}


// UI STUFF


function changeNote(n) {

    if (n === 'false') {
        notate = false;
    } else {
        notate = true;
    }
    var note = document.getElementById("note");
    var pointer = document.getElementById("pointer");

    if (notate) {
        if (note.classList.contains("unselected")) {
            note.classList.remove("unselected");
        }
        if (!note.classList.contains("selected")) {
            note.classList.add("selected");
        }

        if (!pointer.classList.contains("unselected")) {
            pointer.classList.add("unselected");
        }
        if (pointer.classList.contains("selected")) {
            pointer.classList.remove("selected");
        }

    } else {

        if (!note.classList.contains("unselected")) {
            note.classList.add("unselected");
        }
        if (note.classList.contains("selected")) {
            note.classList.remove("selected");
        }

        if (pointer.classList.contains("unselected")) {
            pointer.classList.remove("unselected");
        }
        if (!pointer.classList.contains("selected")) {
            pointer.classList.add("selected");
        }
    }
}

//creating one measure

//add initial track



//var firstMeasure = new Measure(0, {beats: 4, value: 4}, "Am", "Treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: 50, y: 100}, true, false, true);
//var secondMeasure = new Measure(1, {beats: 4, value: 4}, "Am", "Treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: 530, y: 100}, false, false, false);



//firstMeasure.setPreviewMeasure(new Measure(firstMeasure.measureNumber, firstMeasure.timeSignature, firstMeasure.keySignature,
    //firstMeasure.clef, firstMeasure.width, firstMeasure.position));

//firstMeasure.previewMeasure = new Measure(firstMeasure.measureNumber, firstMeasure.timeSignature, firstMeasure.keySignature,
        //firstMeasure.clef, firstMeasure.width, firstMeasure.position);

//Measures.push(firstMeasure);
//Measures.push(secondMeasure);

function newFile() {
    Tracks = [];

    Tracks.push(new Track(0, 
        [new Measure(0, {beats: 4, value: 4}, "Am", "treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: 50, y: 100}, true, false, true)]));
    
    Tracks.push(new Track(1, 
        [new Measure(1, {beats: 4, value: 4}, "Am", "bass", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: 50, y: 400}, true, false, true)]));

}

newFile();



function addMeasures() {
    for (var t=0;t<Tracks.length;t++) {
        var offset = Tracks[t].Measures[Tracks[t].Measures.length-1].xOffset + measureLength;
        var clef = Tracks[t].Measures[Tracks[t].Measures.length-1].clef;
        console.log(newMeasure);
        var newMeasure = new Measure(Tracks[t].Measures.length, {beats: Tracks[t].Measures[Tracks[t].Measures.length-1].timeSignature.beats, value: Tracks[t].Measures[Tracks[t].Measures.length-1].timeSignature.value}, "Am", clef, (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: Tracks[t].Measures[Tracks[t].Measures.length-1].position.x + offset + Tracks[t].Measures[Tracks[t].Measures.length-1].marginLeft, y: Tracks[t].Measures[Tracks[t].Measures.length-1].position.y}, false, false, false);
        
        Tracks[t].Measures.push(newMeasure);
    }
   
    renderMeasures();
}


function renderMeasures(){ 

    //refresh page, fix this for later versions

    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0,0,canvas.width, canvas.height);


    for (var t=0;t<Tracks.length;t++) {
        for (var measure=0;measure<Tracks[t].Measures.length;measure++){
            Tracks[t].Measures[measure].render(context, canvas, camera, notate);
        }
    }

    //render UI Bars underneath buttons

    if (renderCanvasInterface) {

    

        context.fillStyle = uiColour;
        context.fillRect(0, 0, canvas.width, 30);

        context.fillStyle = uiColour;
        context.fillRect(0, 30, canvas.width, 30);

        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 60, canvas.width, 3);

        for (var e=0;e<UIElements.length;e++) {
            UIElements[e].render(context, canvas);
        }

    }

    //render test UI

    //pointerButton.render(context, canvas);

   /* for (var measure=0;measure<Measures.length;measure++){
        Measures[measure].render(context, canvas, camera, notate);
    } /*
    //remove after tracks */
}

renderMeasures();

window.addEventListener("resize", function() {

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    renderMeasures();
})

//mousemove

document.addEventListener("keydown", function(e) {

    console.log("KEY: " + e.keyCode);

    
    if (e.keyCode === 37) {
        camera.x -= 10;
        renderMeasures();
    } else if (e.keyCode == 39) {
        camera.x += 10;
        renderMeasures();
    }

    if (e.keyCode === 38) {
        camera.y += 10;
        renderMeasures();
    } else if (e.keyCode === 40) {
        camera.y -= 10;
        renderMeasures();
    }

    if (e.keyCode === 49) {
        noteValue = 16;
    } else if (e.keyCode === 50) {
        noteValue = 8;
    } else if (e.keyCode === 51) {
        noteValue = 4;
    } else if (e.keyCode === 52) {
        noteValue = 2;
    } else if (e.keyCode === 53) {
        noteValue = 1;
    }


    if (e.keyCode === 190) {
        //dot note
        noteValue += (noteValue / 2);
    }

    if (e.keyCode === 38) {
        if (alteration > 0) {
            alteration = 0;
        } else {
            alteration = 1;
        }
    }

    if (e.keyCode === 82) {
        insertRest = !insertRest;
    }
    if (e.keyCode === 80) {
        changeNote("false");
    }
    if (e.keyCode === 78) {
        changeNote("true");
    }
    if (e.keyCode == 70) {
        Tracks[track_over].Measures[measure_over].showSections = !Tracks[track_over].Measures[measure_over].showSections;
    }

    //shit camera controls

    if (e.keyCode === 68) {
        camera.x += 10;
        renderMeasures();
    } else if(e.keyCode === 65) {
        camera.x -= 10;
        renderMeasures();
    }

    if (e.keyCode == 46) {
        //delete notes
        deleteSelected();
    }

    if (e.keyCode === 187) {
        addMeasures();
    }

    if (e.keyCode === 32) {
       // e.preventDefault();
        //audioPlayer.Play(Measures[0].sections, 0);
        currentMeasure = 0;
        playMeasure(0);
        //console.log(Measures[0]);
    }

    if (e.keyCode === 77) {
        addMeasure();
    }

    if (e.keyCode == 67) {
        console.log(measuresSelected.length);
        for (let m=0;m<measuresSelected.length;m++) {
           // Tracks[measuresSelected.track].Measures[measuresSelected.measure].changeClef = true;
           // Tracks[measuresSelected.track].Measures[measuresSelected.measure].clef = "bass";
           
           Tracks[measuresSelected[m].track].Measures[measuresSelected[m].measure].setClef("treble");
            
        }
    }

}, false)

function playMeasure(measure) {
    for (var t=0;t<Tracks.length;t++) {
        var sections = audioPlayer.returnSections(Tracks[t].Measures[measure].sections, 0);
        var audioCtx = audioPlayer.getContext();
        var gainNode = audioPlayer.getGainNode();
        var destination = audioPlayer.getDestination();
        playback(sections, 0, audioCtx, gainNode, destination, t);
    }
   
}

function playback(sections, index, context, gainNode, destination, trackNumber) {

    //console.log(sections);

    if (true) {
        if (sections[index].note != 'rest') {

          //  console.log("yeah this is true");
            
            var osc_list = [];

            for (var n=0;n<sections[index].notes.length;n++) {

                //TAKE THIS BIT OUT

                sections[index].notes[n].selected = true;

                //

                var os = context.createOscillator();
                os.connect(gainNode);
                os.connect(destination);
                os.type = 'sine';
                os.frequency.setValueAtTime(getFrequency(sections[index].notes[n].pitch), context.currentTime);
                osc_list.push(os);
            }
            
            for (var o=0;o<osc_list.length;o++) {
                osc_list[o].start(context.currentTime);
                osc_list[o].stop(context.currentTime + sections[index].value); 
                renderMeasures();
            }
            //os.start(this.context.currentTime);
           // this.gainNode.gain.setTargetAtTime(0, this.context.currentTime + 950 * sections[index].value, 0);
         //  this.gainNode.gain.exponentialRampToValueAtTime(-0.9, this.context.currentTime + 1);

        } 
    
        var nextIndex = index + 1;
        
        var self = this;

        setTimeout(function() {
            renderMeasures();
            if (sections[index].note != 'rest') {
                for (var o=0;o<osc_list.length;o++) {
                   // osc_list[o].stop(context.currentTime); 
                }
                for (var n=0;n<sections[index].notes.length;n++) {
                    sections[index].notes[n].selected = false;
                    
                }
               // os.stop(self.context.currentTime);
            }

            if (index < sections.length - 1) {
                // console.log("NANI?");
               // self.Play(sections, index+1);
              // if (trackNumber === Tracks.length-1) {
                    playback(sections, index+1, context, gainNode, destination, trackNumber);
              // }
             } else {
                 if (currentMeasure < Tracks[0].Measures.length-1) {
                     if (trackNumber === Tracks.length-1) {
                        currentMeasure += 1;
                        playMeasure(currentMeasure);
                     }
                                          
                 }
             }

             renderMeasures();
             

        }, 1000 * sections[index].value);   
        
        renderMeasures();
    }
}



function deleteSelected() {
    //this is fukin shit redo this m80
    
    for (var t=0;t<Tracks.length;t++) {
        for (var m=0;m<Tracks[t].Measures.length;m++) {
            for (var s=0;s<Tracks[t].Measures[m].sections.length;s++) {
                for (var n=0;n<Tracks[t].Measures[m].sections[s].notes.length;n++) {
                   // console.log(Measures[m].sections[s].notes[n]);
                    if (Tracks[t].Measures[m].sections[s].notes[n].selected) {
                      //  console.log(Measures[m].sections[s]);
                      Tracks[t].Measures[m].sections[s].removeNote(n);
                        //console.log(Measures[m].sections[s]);
                        Tracks[t].Measures[m].previewMeasure.setSections(Measures[m].sections);
                        renderMeasures();
                    }
                }
            }
        }
    }
    
}

//move this later

function getTrackOver(x, y) {

    let width = Tracks[0].Measures[0].width;
    let height = Tracks[0].Measures[0].height;

}

function getMeasureOver(x, y) {


}

//move this later

document.addEventListener("mousemove", function(e) {
    e.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    let mx = x;
    let my = y;
    x = x - camera.x;
    y = y - camera.y;
   // console.log("X: " + x + "Y: " + y);

    var hovered = false;

    let UIHover = false; //for mouse icon stuff ay.
    //optimising, not finished

    let tr_over = getTrackOver(x, y);
    let m_over = getMeasureOver(x, y);


    // end optimising

    if (!dragging) {

        //UI hover


        for (let ui=0;ui<UIElements.length;ui++) {
            if (UIElements[ui].mouseOver(mx, my)) {
                UIElements[ui].hovered = true;
                canvas.style.cursor = "pointer";
                UIHover = true;
            } else {
                UIElements[ui].hovered = false;
            }
        }

        //end UI hover check

        for (var t=0;t<Tracks.length;t++) {
            for (var m=0;m<Tracks[t].Measures.length;m++) {
                var over = false;
        
                if (Tracks[t].Measures[m].mouseOver(x, y)) {
                    track_over = t;
                    renderMeasures();
                    
                } else {
                    //Measures[m].hovered = false;
                    renderMeasures();
                    hovered = false;
                }
                if (notate) {
                    for (var l=0;l<Tracks[t].Measures[m].lines.length;l++) {
                      //  renderMeasures();
            
                        if (Tracks[t].Measures[m].lines[l].mouseOver(x, y)) {
                            track_over = t;
                            measure_over = m;
                            line_over = l;
                            section_over = Tracks[t].Measures[m].mouseOverSection(x, y);
                            let restNote = (insertRest) ? "rest" : "note";
                            //Measures[measure_over].mutateSection(Measures[measure_over].previewMeasure.sections[section_over], 1, "note", section_over, Measures[measure_over].lines[line_over], true);
                            if (!hovered && section_over != undefined) {
                                if (!insertRest) {
                                    Tracks[t].Measures[measure_over].previewMeasure.prev(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                   // Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);
                                } else {


                                    Tracks[t].Measures[measure_over].previewMeasure.prev(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                    //Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                }
                                hovered = true;
                            }
                            //Measure[measure_over].previewMeasure.setSections(Measure[measure_over].sections);
            
                        } 
                        Tracks[t].Measures[m].lines[l].render(context, canvas, camera);
                    }
                } else {
                    
                    for (var l=0;l<Tracks[t].Measures[m].lines.length;l++) {
                        if (Tracks[t].Measures[m].lines[l].mouseOver(x, y)) 
                        {
                        
                            track_over = t;
                            measure_over = m;
                            line_over = l;
                            section_over = Tracks[t].Measures[m].mouseOverSection(x, y);
                            console.log("M: " + m + "T: " + t);

                        }
                    }
                }
            
            }
        }
        
    }

    if (dragging) {
        camera.x = camera.x + (x - dragPos.x);
        camera.y = camera.y + (y - dragPos.y);
        canvas.style.cursor = "grab";
    } else {
        if (UIHover) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
        }
        
    }

    if (moveNotes) {

    }

    renderMeasures();
   
    
    //renderPreviewNote();

}, false)

document.addEventListener("mousedown", function(e) {

    e.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var mx = x;
    var my = y;
    x = x - camera.x;
    y = y - camera.y;

    //check UI etc.

    if (my < 60) {
        for (let ui=0;ui<UIElements.length;ui++) {
            if (UIElements[ui].mouseOver(mx, my)) {
                UIElements[ui].clicked();
            }
        }
    }

    


    //end check UI etc.


    if (!mouse_clicked && e.button === 0) {

        if (e.clientX >= rect.left && e.clientX  <= rect.left + rect.width 
        && e.clientY >= rect.top && e.clientY <= rect.top + rect.height) {
            mouse_clicked = true;
           /* if (notate && my > 60) {

                if (Tracks[track_over].Measures[measure_over] != undefined && Tracks[track_over].Measures[measure_over].lines[line_over] != undefined) {
                        mouse_clicked = true;
                       // currentMeasure = measure_over;
                       
                       let restNote = (insertRest) ? "rest" : "note";
                       if (notateRest) {

                            Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                            //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
                       } else {

                            Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                            //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
                       }
                        renderMeasures();
  
                    }
                } */

            if (!notate) {

                clickPos.x = e.clientX;
                clickPos.y = e.clientY;

                for (var m=0;m<Tracks[track_over].Measures.length;m++) {
                    var over = false;
            
                    if (Tracks[track_over].Measures[m].mouseOver(x, y)) {
                        measure_over = m;
                        console.log("MMMMM: " + m);
                        section_over = Tracks[track_over].Measures[measure_over].mouseOverSection(x, y);
                    }
                }

               // if (section_over != undefined && measure_over != undefined && track_over != undefined) {
                    for (var n=0;n<Tracks[track_over].Measures[measure_over].sections[section_over].notes.length;n++) {

                        if (Tracks[track_over].Measures[measure_over].sections[section_over].notes[n].mouseOver(x, y)) {
    
                            /*
                            Measures[measure_over].sections[section_over].removeNote(n);
                            if (Measures[measure_over].sections[section_over].notes.length === 0) {
                                Measures[measure_over].sections[section_over].note = "rest";
                            }
                            Measures[measure_over].previewMeasure.setSections(Measures[measure_over].sections);
                            renderMeasures();
                            */
    
                          //  if (Tracks[track_over].Measures[measure_over].sections[section_over].notes[n].selected = !Tracks[track_over].Measures[measure_over].sections[section_over].notes != undefined) {
                                Tracks[track_over].Measures[measure_over].sections[section_over].notes[n].selected = !Tracks[track_over].Measures[measure_over].sections[section_over].notes[n].selected;
                                moveNotes = true;
                           // }
                            
                        }
                    }
    
    
                    //Tracks[track_over].Measures[measure_over].previewMeasure.setSections(Tracks[track_over].Measure[measure_over].sections);
              //  }

                
                renderMeasures();

            } else {
                console.log("ZIPPIDYDOO");
            }
            
        }  
    }

    if (!dragging && e.button == 1) {
        dragging = true;
        dragPos = {x: x, y: y};
    }

}, false)

document.addEventListener("touchstart", function(e) {

    touching = true;

    touch = e.touches[0];

    var rect = canvas.getBoundingClientRect();
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    var mx = x;
    var my = y;
    x = x - camera.x;
    y = y - camera.y;

    if (!dragging && !notate) {
        dragging = true;
        dragPos = {x: x, y: y};
    }

}, {passive: false})

document.addEventListener("touchmove", function(e) {

   // e.preventDefault();

    touch = e.touches[0];

    

    var rect = canvas.getBoundingClientRect();
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    let mx = x;
    let my = y;
    x = x - camera.x;
    y = y - camera.y;

    let hovered = false;


    if (notate) {

        

        for (var t=0;t<Tracks.length;t++) {
            for (var m=0;m<Tracks[t].Measures.length;m++) {
                var over = false;
        
                if (Tracks[t].Measures[m].mouseOver(x, y)) {
                    track_over = t;
                    measure_over = m;
                    renderMeasures();
                    
                } else {
                    //Measures[m].hovered = false;
                    renderMeasures();
                    hovered = false;
                }
                    for (var l=0;l<Tracks[t].Measures[m].lines.length;l++) {
                      //  renderMeasures();
                        if (Tracks[t].Measures[m].lines[l].mouseOver(x, y)) {
                            track_over = t;
                            measure_over = m;
                            line_over = l;
                            section_over = Tracks[t].Measures[m].mouseOverSection(x, y);
                            let restNote = (insertRest) ? "rest" : "note";
                            //Measures[measure_over].mutateSection(Measures[measure_over].previewMeasure.sections[section_over], 1, "note", section_over, Measures[measure_over].lines[line_over], true);
                            if (!hovered && section_over != undefined) {
                                if (!insertRest) {
                                    Tracks[t].Measures[measure_over].previewMeasure.prev(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                   // Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);
                                } else {


                                    Tracks[t].Measures[measure_over].previewMeasure.prev(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                    //Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

                                }
                                hovered = true;
                            }
                            //Measure[measure_over].previewMeasure.setSections(Measure[measure_over].sections);
            
                        } 
                        Tracks[t].Measures[m].lines[l].render(context, canvas, camera);
                    }
                
            
            }
        }
        
       /* if (section_over != undefined && Tracks[track_over] != undefined) {
            console.log("Phone preview");
          //  if (!insertRest) {
                Tracks[track_over].Measures[measure_over].previewMeasure.prev(Tracks[track_over].Measures[measure_over], noteValue, "note", section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

               // Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);
           // } else {


            //    Tracks[track_over].Measures[measure_over].previewMeasure.prev(Tracks[track_over].Measures[measure_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                //Tracks[t].Measures[measure_over].previewMeasure.preview(Tracks[t].Measures[m], noteValue, restNote, section_over, Tracks[t].Measures[measure_over].lines[line_over], alteration);

           // }
            hovered = true;
        } */
    }


    if (dragging) {
        camera.x = camera.x + (x - dragPos.x);
        camera.y = camera.y + (y - dragPos.y);
        renderMeasures();
    }
})

document.addEventListener("touchend", function(e) {

  //  e.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    let mx = x;
    let my = y;
    x = x - camera.x;
    y = y - camera.y;

    touching = false;

    if (dragging) {
        dragging = false;
    }

    if (notate && my > 60) {

        if (Tracks[track_over].Measures[measure_over] != undefined && Tracks[track_over].Measures[measure_over].lines[line_over] != undefined) {
               // currentMeasure = measure_over;
               
               let restNote = (insertRest) ? "rest" : "note";
               if (notateRest) {

                    Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                    //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
               } else {

                    Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                    //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
               }
               Tracks[track_over].Measures[measure_over].previewMeasure.setSections(Tracks[track_over].Measure[measure_over].sections);

                renderMeasures();

            }
        } else {
            if (Tracks[track_over].Measures[measure_over] != undefined && Tracks[track_over].Measures[measure_over].lines[line_over] != undefined)
            {

               // Tracks[track_over].Measures[measure_over].toggleSelected();
            
            }
        }
})

function addMeasure() {
    var length = Measures.length;
    if (length % 2 == 0) {

      //  Measures.push(new Measure(length + 1, {beats: 4, value: 4}, "Am", "Treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: Measures[0].position.x, y: Measures[length-1].position.y + 100}, true, false, true));
      Measures.push(new Measure(length + 1, {beats: Measures[0].timeSignature.beats, value: 4}, "Am", "Treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: Measures[0].position.x, y: Measures[length-1].position.y + 100}, true, false, true));
        console.log("Measure TIMESIG: " + Measures[0].timeSignature.beats);
    } else {
        Measures.push(new Measure(length + 1, {beats: Measures[0].timeSignature.beats, value: 4}, "Am", "Treble", (measureLength * scale), (measureLength * scale) / (measureLength / 100), {x: Measures[1].position.x, y: Measures[length-1].position.y}, false, false, false));
    }
    renderMeasures();
}

document.addEventListener("mouseup", function(e) {
    e.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var mx = x;
    var my = y;
    x = x - camera.x;
    y = y - camera.y;

    //if (e.button === 1) {
        if (dragging) {
            dragging = false;
        }
    //}

    if (mouse_clicked && e.button == 0) {

        if (notate && my > 60) {

            if (Tracks[track_over].Measures[measure_over] != undefined && Tracks[track_over].Measures[measure_over].lines[line_over] != undefined) {
                   // currentMeasure = measure_over;
                   
                   let restNote = (insertRest) ? "rest" : "note";
                   if (notateRest) {

                        Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                        //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
                   } else {

                        Tracks[track_over].Measures[measure_over].mutateSect(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);

                        //Tracks[track_over].Measures[measure_over].mutateSection(Tracks[track_over].Measures[measure_over].sections[section_over], noteValue, restNote, section_over, Tracks[track_over].Measures[measure_over].lines[line_over], alteration);
                   }
                   Tracks[track_over].Measures[measure_over].previewMeasure.setSections(Tracks[track_over].Measure[measure_over].sections);
                    renderMeasures();

                }
            } else {

                console.log("TRACK: " + track_over);
                console.log("MEASURE: " + measure_over);
                console.log(Tracks[track_over]);
                console.log(Tracks[track_over].Measures[measure_over]);

                if (track_over >= 0 && measure_over >= 0 &&
                     Tracks[track_over] != undefined &&
                      Tracks[track_over].Measures[measure_over] != undefined)
                {
                    Tracks[track_over].Measures[measure_over].toggleSelected();
                    changeSelection(track_over, measure_over);
                }
            }

        mouse_clicked = false;
        moveNotes = false;
    }
    renderMeasures();

}, false)

function changeSelection(t, m) {
    //check if selection is already in the array

    let inArray = false;

    for (let s=0;s<measuresSelected.length;s++) {
        if (measuresSelected.track = t && measuresSelected.measure == m) {
            inArray = true;
            measuresSelected.splice(s, 1);
            break;
        }
    }

    if (!inArray) {
        measuresSelected.push(
            {

                track: t, 
                measure: m

            }
        );
    }
}

function setSelectedClef(clef) {
    this.selectedClef = clef;
}
