function AudioPlayer(ctx, canvas, camera) {

    this.playing = true;
    this.section = 0; //index

    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.destination = this.context.destination;

    this.ctx = ctx;
    this.canvas = canvas;
    this.camera = camera;

    //list of oscillators? this is temporary!

    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'sine';

    //connect osccilllatoatas and such

    this.gainNode.connect(this.destination);
    this.oscillator.connect(this.gainNode);
    this.oscillator.connect(this.destination);
}

AudioPlayer.prototype.Play = function(sections, index) {

    //sort sections, this will be somewhere else / only done once

    console.log("INDEX: " + index);

  //  this.playing = true;

    var sortedSection = sections.slice(0);
    sortedSection.sort(function(a, b) {
        return a.position.x - b.position.x;
    });

    /*
    console.log("unsorted vs sorted");
    console.log(sections);
    console.log(sortedSection);
    */

    

    this.playNotes(sortedSection[index].notes, sortedSection, index);

}

AudioPlayer.prototype.Stop = function() {
    this.oscillator.stop();
}

AudioPlayer.prototype.setVolume = function(vol) {
    this.gainNode.gain.value = vol;
}

AudioPlayer.prototype.renderPlay = function(section) {
    //this.ctx.begin();
   // this.ctx.fillStyle = "rgb(0,0,255)";
   // this.ctx.fillRect(this.camera.x + section.notePosition.x, this.camera.y + section.notePosition.y, 5, 50);
    //this.ctx.fill();
}

AudioPlayer.prototype.returnSections = function(sections, index) {
    var sortedSection = sections.slice(0);
    sortedSection.sort(function(a, b) {
        return a.position.x - b.position.x;
    });

    return sortedSection;
}

AudioPlayer.prototype.getContext = function() {
    return this.context;
}

AudioPlayer.prototype.getGainNode = function() {
    return this.gainNode;
}

AudioPlayer.prototype.getDestination = function() {
    return this.destination;
}

AudioPlayer.prototype.playNotes = function(notes, sections, index) {


    console.log(sections[index].note + ", " + index);

    if (this.playing) {
        if (sections[index].note != 'rest') {
            

            var osc_list = [];

            for (var n=0;n<notes.length;n++) {

                //TAKE THIS BIT OUT

                sections[index].notes[n].selected = true;

                //


                var os = this.context.createOscillator();
                os.connect(this.gainNode);
                os.connect(this.destination);
                os.type = 'sine';
                os.frequency.setValueAtTime(getFrequency(notes[n].pitch), this.context.currentTime);
                osc_list.push(os);
            }
            
            for (var o=0;o<osc_list.length;o++) {
                osc_list[o].start(this.context.currentTime);
            }
            //os.start(this.context.currentTime);
           // this.gainNode.gain.setTargetAtTime(0, this.context.currentTime + 950 * sections[index].value, 0);
         //  this.gainNode.gain.exponentialRampToValueAtTime(-0.9, this.context.currentTime + 1);

        } 
    
        var nextIndex = index + 1;
        
        var self = this;

        this.renderPlay(sections[index]);

        setTimeout(function() {
            if (sections[index].note != 'rest') {
                for (var o=0;o<osc_list.length;o++) {
                    osc_list[o].stop(this.context.currentTime);
                    
                }

                for (var n=0;n<notes.length;n++) {
                    sections[index].notes[n].selected = false;
                }
               // os.stop(self.context.currentTime);
            }

            if (index < sections.length - 1) {
                // console.log("NANI?");
                self.Play(sections, index+1);
             } else {
                 this.playing = false;
             }

        }, 1000 * sections[index].value);     
    }

   


}

