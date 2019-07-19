function renderClef(clefText, context, canvas, position, width, height, camera) {

    var clef = new Image;
    clef.onload = function() {
        context.drawImage(clef, camera.x + position.x, camera.y + position.y, width, height);
        
    }

    if (clefText === "treble") {
        clef.src = "Resources/trebleclef.svg";
    }
    else if (clefText === "bass"){
        clef.src = "Resources/bassclef.svg";
    } else {
        clef.src = "Resources/trebleclef.svg";
    }

    return clef;

}