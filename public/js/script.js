const BASE_URL = 'https://agile-badlands-99964.herokuapp.com/api/'
window.onload = () => {
    loadNotes();
};
function loadNotes() {
    notespace.innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', BASE_URL+'notes', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var notes = eval('(' + xhr.response + ')');;
    }
    notes.reverse().forEach(element => {
        createNote(element['_id'], element.title, element.text);
    });
}

function createNote(id, title, text) {
    notespace.innerHTML += '<div class="note" id="' + id + '"><header class="noteheader"><input type="text" value="' + title + '" class="noteTitle"><button onclick="deleteNote(this)">DEL</button><button onclick="saveNote(this)">Save</button></header><textarea class="noteText">' + text + '</textarea></div>';
}

function deleteNote(button) {
    var note = button.parentElement.parentElement;
    var id = note.id;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', BASE_URL+'notes/'+id, false);
    xhr.send();
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
    loadNotes()
}
function saveNote(button) {
    let note = button.parentElement.parentElement;
    let data = {};
    data.title = note.querySelector(".noteTitle").value;
    data.text = note.querySelector(".noteText").value;
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', BASE_URL + 'notes/'+note.id, false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(createNoteBody(data.title, data.text));
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
    loadNotes()
}
function addNote() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', BASE_URL+'notes', false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(createNoteBody());
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
    loadNotes();
}
function createNoteBody(title = 'Note title', text = 'Text of my note'){
    return ('title=' + title.replace(/ /g, "+") + '&body=' + text.replace(/ /g, "+"))
}