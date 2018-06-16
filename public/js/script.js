window.onload = () => {
//https://agile-badlands-99964.herokuapp.com/api/notes
    var notespace = document.getElementById("notespace");
    var createNote = (title, text) => {
        notespace.innerHTML += '<div class="note"><header class="noteheader"><input type="text" value="'+ title +'"></header><textarea>'+ text +'</textarea></div>';
    };
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://agile-badlands-99964.herokuapp.com/api/notes', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        var notes = xhr.response;
    }
    console.log(notes);



};