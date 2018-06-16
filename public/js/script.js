window.onload = () => {
//https://agile-badlands-99964.herokuapp.com/api/notes
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://agile-badlands-99964.herokuapp.com/api/notes', false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        alert(xhr.responseText);
    }



};