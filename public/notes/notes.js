const BASE_URL = 'https://jolken.herokuapp.com/api/';
window.onload = () => {
    loadNotes();
};
function sendReqeust(method, url, data) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = (() => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } 
            else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        });
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
}
function createRequestBody(data) {
    data.title = data.title || 'Note title';
    data.text = data.text || 'Text of my note';
    return ('title=' + data.title.replace(/ /g, "+") + '&body=' + data.text.replace(/ /g, "+"))
}
function loadNotes() {
    notespace = document.querySelector('.notespace');
    sendReqeust('GET', BASE_URL+'notes', {})
    .then((response) => {
        let notes = eval('(' + response + ')');
        notespace.innerHTML = '';
        notes.reverse().forEach(element => {
            createNote(element['_id'], element.title, element.text);
        });
        notespace.innerHTML += '<article class="note noteimg"><i class="fa fa-plus-circle fa-5x cursor" aria - hidden="true" onclick = "addNote()"></i ></article >'
    })
    .catch((err) => {
        console.log(err);
    });
    
}

function createNote(id, title, text) {
    notespace.innerHTML += '<article class="note" id = "' + id + '" ><input value="' + title + '" class="noteTitle"><textarea class="noteText">' + text + '</textarea><div class="controlButtons"><i class="fa fa-trash-o cursor" aria-hidden="true" onclick="deleteNote(this)"></i><i class="fa fa-floppy-o cursor" aria-hidden="true" onclick="saveNote(this)"></i></div></article>'
}

function deleteNote(button) {
    let note = button.parentElement.parentElement;
    let id = note.id;
    sendReqeust('DELETE', BASE_URL+'notes/'+id)
    .then((response) => {
        console.log(response);
        loadNotes();
    })
    .catch((err) => {
        console.error(err);
    });
}
function saveNote(button) {
    let note = button.parentElement.parentElement;
    let id = note.id;
    let data = {};
    data.title = note.querySelector(".noteTitle").value;
    data.text = note.querySelector(".noteText").value;
    sendReqeust('PUT', BASE_URL+'notes/'+id, createRequestBody(data))
    .then((response) => {
        console.log(response);
        loadNotes();
    })
    .catch((err) => {
        console.error(err);
        alert('Can not save note with title: \n'+data.title);
    });
}
function addNote() {
    sendReqeust('POST', BASE_URL + 'notes/', createRequestBody({ 
        'title': 'Note title', 
        'text':'Text of my note'}))
    .then((response) => {
        console.log(response);
        loadNotes();
    })
    .catch((err) => {
        console.error(err);
        alert('Can not create new note');
    }); 
}