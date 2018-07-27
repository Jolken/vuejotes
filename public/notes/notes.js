const BASE_URL = 'https://jolken.herokuapp.com/api/notes';
window.onload = () => {
    loadNotes();
};
function loadNotes() {
    notespace = document.querySelector('.notespace');
    document.innerHTML = '<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', BASE_URL + 'notes', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var notes = eval('(' + xhr.response + ')');;
    }
    notespace.innerHTML = '';
    notes.reverse().forEach(element => {
        createNote(element['_id'], element.title, element.text);
    });
    notespace.innerHTML += '<article class="note noteimg"><i class="fa fa-plus-circle fa-5x cursor" aria - hidden="true" onclick = "addNote()"></i ></article >'
}

function createNote(id, title, text) {
    notespace.innerHTML += '<article class="note" id = "' + id + '" ><input value="' + title + '" class="noteTitle"><textarea class="noteText">' + text + '</textarea><div class="controlButtons"><i class="fa fa-trash-o cursor" aria-hidden="true" onclick="deleteNote(this)"></i><i class="fa fa-floppy-o cursor" aria-hidden="true" onclick="saveNote(this)"></i></div></article>'
}

function deleteNote(button) {
    var note = button.parentElement.parentElement;
    var id = note.id;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', BASE_URL + 'notes/' + id, false);
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
    xhr.open('PUT', BASE_URL + 'notes/' + note.id, false);
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
    xhr.open('POST', BASE_URL + 'notes', false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(createNoteBody());
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
    loadNotes();
}
function createNoteBody(title = 'Note title', text = 'Text of my note') {
    return ('title=' + title.replace(/ /g, "+") + '&body=' + text.replace(/ /g, "+"))
}