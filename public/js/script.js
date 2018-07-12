<<<<<<< HEAD
const BASE_URL = 'https://agile-badlands-99964.herokuapp.com/api/'
=======
var APIURL = 'https://agile-badlands-99964.herokuapp.com/api/notes/';
>>>>>>> 62a3cf36bed729ad16187d0f087a15aabf6f05f2
window.onload = () => {
    loadNotes();
};
function loadNotes() {
    notespace.innerHTML = '';
    var xhr = new XMLHttpRequest();
<<<<<<< HEAD
    xhr.open('GET', BASE_URL+'notes', false);
=======
    xhr.open('GET', APIURL, false);
>>>>>>> 62a3cf36bed729ad16187d0f087a15aabf6f05f2
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var notes = eval('(' + xhr.response + ')');;
    }
    notes.forEach(element => {
        createNote(element['_id'], element.title, element.text);
    });
}

function createNote(id, title, text) {
    notespace.innerHTML += '<div class="note" id="' + id + '"><header class="noteheader"><input type="text" value="' + title + '"><button onclick="deleteNote(this)">DEL</button></header><textarea>' + text + '</textarea></div>';
}

function deleteNote(element) {
    var id = element.parentElement.parentElement.id;
    var xhr = new XMLHttpRequest();
<<<<<<< HEAD
    xhr.open('DELETE', BASE_URL+'notes/'+id, false);
=======
    xhr.open('DELETE', APIURL+id);
>>>>>>> 62a3cf36bed729ad16187d0f087a15aabf6f05f2
    xhr.send();
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
}
<<<<<<< HEAD
function addNote() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', BASE_URL+'notes', false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send({
        'body' : 'Text of my note',
        'title' : 'Note title'
    });
=======

function addNote() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', APIURL, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send({'body': '', 'title': ''});
>>>>>>> 62a3cf36bed729ad16187d0f087a15aabf6f05f2
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
}