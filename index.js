var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

var file_tab = document.getElementById("file-tab");
var edit_tab = document.getElementById("edit-tab");

var file_button = document.getElementById("file");
var edit_button = document.getElementById("edit");

var new_sheet = document.getElementById("new");

var pointer_button = document.getElementById("pointer");
var note_button = document.getElementById("note");

var add_measure_button = document.getElementById("add_measure");

var semiquaver_button = document.getElementById("semiquaver_button");
var quaver_button = document.getElementById("quaver_button");
var crotchet_button = document.getElementById("crotchet_button");
var minim_button = document.getElementById("minim_button");
var semibreve_button = document.getElementById("semibreve_button");

var gear_button = document.getElementById("gear_button");
var sidebar = document.getElementById("sidebar");
var measure_content = document.getElementById("measure-content");
var sheet_content = document.getElementById("sheet-content");
var tabs = document.getElementById("canvas-wrapper");

var sidebar_title = document.getElementById("sidebar-title");
var sidebar_composer = document.getElementById("sidebar-composer");

var sheets = [];
var activeSheet = 0;

sheets.push(new Sheet(canvas, context, "New Sheet", "Unknown"));

updateSidebarTitle();

sheets[activeSheet].newFile();

function UIChangeTab(tab) {
    if (tab == "file") {

        if (file_tab.classList.contains("hidden")) {
            file_tab.classList.remove("hidden");
            file_button.classList.add("filebutton-selected");
        }

        edit_tab.classList.add("hidden");
        edit_button.classList.remove("filebutton-selected");

    } else if (tab == "edit") {

        if (edit_tab.classList.contains("hidden")) {
            edit_tab.classList.remove("hidden");
            edit_button.classList.add("filebutton-selected");
        }

        file_tab.classList.add("hidden");
        file_button.classList.remove("filebutton-selected");

    }
}

window.addEventListener("resize", function() {

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    sheets[activeSheet].resize(width, height);
})

document.addEventListener("keydown", function(e) {
    console.log(e.keyCode);
    sheets[activeSheet].keyInput(e);
})


canvas.addEventListener("mousemove", function(e) {
    
    sheets[activeSheet].mouseMove(e.clientX, e.clientY);

})

canvas.addEventListener("mousedown", function(e) {

    e.preventDefault();

    sheets[activeSheet].inputNote(e.clientX, e.clientY, e, false);
})

canvas.addEventListener("mouseup", function(e) {
    sheets[activeSheet].mouseUp();
})

canvas.addEventListener("touchmove", function(e) {
    
    let touch = e.touches[0];

    console.log("ayybb");

    sheets[activeSheet].mouseMove(touch.pageX, touch.pageY);
})

canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();

    let touch = e.touches[0];

    sheets[activeSheet].inputNote(touch.pageX, touch.pageY, e, true);
})

canvas.addEventListener("touchend", function(e) {

    let touch = e.touches[0];

    sheets[activeSheet].mouseUp();
})


//UI Event Listeners

file_button.addEventListener("click", function() {

    UIChangeTab("file");

})

edit_button.addEventListener("click", function() {

    UIChangeTab("edit");

})

new_sheet.addEventListener("click", function() {

    sheets.push(new Sheet(canvas, context, "New Sheet", "Unknown"));
    sheets[sheets.length-1].newFile();

    updateSheetTabs();


   /* sheets[activeSheet].newFile();
    sheets[activeSheet].renderMeasures();*/

});

pointer_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].notate = false;
    }
    
    toggleNotation(false);
})

note_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].notate = true;
    }
    toggleNotation(true);
})

add_measure_button.addEventListener("click", function() {
    sheets[activeSheet].addMeasures();
})

semiquaver_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].noteValue = 1;
    }
    
    selectNoteButton(1);
})

quaver_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].noteValue = 2;
    }
    selectNoteButton(2);
})

crotchet_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].noteValue = 4;
    }
    selectNoteButton(4);
})

minim_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].noteValue = 8;
    }
    selectNoteButton(8);
})

semibreve_button.addEventListener("click", function() {
    for (let s=0;s<sheets.length;s++) {
        sheets[s].noteValue = 16;
    }
    selectNoteButton(16);
})

gear_button.addEventListener("click", function() {
    toggleSidebar();
})

sidebar_title.addEventListener("input", function() {

    sheets[activeSheet].title = sidebar_title.value;
    document.getElementById("tab-span-" + activeSheet).textContent = sheets[activeSheet].title;
    sheets[activeSheet].renderMeasures();

})

sidebar_composer.addEventListener("input", function() {

    sheets[activeSheet].composer = sidebar_composer.value;
    sheets[activeSheet].renderMeasures();

})

function selectNoteButton(noteValue) {
    semiquaver_button.classList.remove("toolbar_selected");
    quaver_button.classList.remove("toolbar_selected");
    crotchet_button.classList.remove("toolbar_selected");
    minim_button.classList.remove("toolbar_selected");
    semibreve_button.classList.remove("toolbar_selected");

    if (noteValue == 1) {
        semiquaver_button.classList.add("toolbar_selected");
        console.log("addddin");
    } else if (noteValue == 2) {
        quaver_button.classList.add("toolbar_selected");
    } else if (noteValue == 4) {
        crotchet_button.classList.add("toolbar_selected");
    } else if (noteValue == 8) {
        minim_button.classList.add("toolbar_selected");
    } else if (noteValue == 16) {
        semibreve_button.classList.add("toolbar_selected");
    }
}

function toggleNotation(notate) {
    pointer_button.classList.remove("toolbar_selected");
    note_button.classList.remove("toolbar_selected");

    if (notate) {
        note_button.classList.add("toolbar_selected");
    } else {
        pointer_button.classList.add("toolbar_selected");
    }
}

function toggleSidebar() {

    if (sidebar.classList.contains("sidebar-hidden")) {
        sidebar.classList.remove("sidebar-hidden");
        tabs.classList.remove("tabs-left");
        //sidebar_content.classList.remove("hidden");
    } else {
        sidebar.classList.add("sidebar-hidden");
        tabs.classList.add('tabs-left');
        //sidebar_content.classList.add("hidden");
    }
}

function updateSheetTabs() {

    let wrapper = document.getElementById("sheet-tabs");
    wrapper.innerHTML = "";

    for (let t=0;t<sheets.length;t++) {

        //sheet-tab-wrapper-column

        let stwc = document.createElement("div");
        stwc.classList.add("sheet-tab-wrapper-column");

        //sheet-tab &| sheet-tab-selected

        let tab = document.createElement("div");
        tab.classList.add("sheet-tab");
        tab.id = "tab-" + t;
        if (t == activeSheet) {
            tab.classList.add("sheet-tab-selected");
        }

        tab.onclick = function(ev) {
            ev.stopPropagation();
            updateActiveSheet(t);
            
        }

        //span for text

        let span = document.createElement("span");
        span.textContent = sheets[t].title;
        span.id = "tab-span-" + t;
        
        //close tab button

        let closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("close-tab");
        closeButton.id = "ct-" + t;
        closeButton.onclick = function(ev) {
            ev.stopPropagation();
            removeSheet(t);
        }

        tab.appendChild(span);
        tab.appendChild(closeButton);
        stwc.appendChild(tab);
        wrapper.appendChild(stwc);

    }

}

function updateSidebarTitle() {
    sidebar_title.value = sheets[activeSheet].title;
    sidebar_composer.value = sheets[activeSheet].composer;
    document.getElementById("tab-span-" + activeSheet).textContent = sheets[activeSheet].title;
    
}

function updateActiveSheet(s) {
    activeSheet = s;
    sheets[s].renderMeasures();
    updateSidebarTitle();

    // update tab styles

    for (let t=0;t<sheets.length;t++) {
        if (t != activeSheet) {
            document.getElementById("tab-" + t).classList.remove("sheet-tab-selected");
        } else {
            document.getElementById("tab-" + t).classList.add("sheet-tab-selected");
        }
    }
}

function removeSheet(s) {

    if (sheets.length > 1) {

        sheets.splice(s, 1);
        updateSheetTabs();

        if (s == 0) {
            updateActiveSheet(0);
        } else {
            updateActiveSheet(s-1);
        }
    } 
}

document.body.requestFullscreen();
