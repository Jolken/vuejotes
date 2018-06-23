var APIURL = 'https://agile-badlands-99964.herokuapp.com/api/notes/';
window.onload = () => {
    loadNotes();
};
function loadNotes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', APIURL, false);
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
    xhr.open('DELETE', APIURL+id);
    xhr.send();
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
}

function addNote() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', APIURL, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send({'body': '', 'title': ''});
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
}