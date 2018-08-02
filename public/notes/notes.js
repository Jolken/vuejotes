const BASE_URL = 'https://jolken.herokuapp.com/api/';

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
function setIndexes(obj, arr) {
    obj[arr].map((element, index) => {
        element.index = index;
    });
}




function createRequestBody(data) {
    data.title = data.title || 'Note title';
    data.text = data.text || 'Text of my note';
    return ('title=' + data.title.replace(/ /g, "+") + '&body=' + data.text.replace(/ /g, "+"))
}

window.onload = () => {
    var notespace = new Vue({
        el: '#notespace',
        data: {
            notes: [],
        },
        created: function() {
            this.loadNotes();
        },
        methods : {
            loadNotes() {
                sendReqeust('GET', BASE_URL + 'notes', {})
                    .then((response) => {
                        this.notes = [];
                        let notes = eval('(' + response + ')');
                        notes.forEach((note) => {
                            this.pushNote(note);
                        });
                        setIndexes(notespace, 'notes');
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            addNote() {
                sendReqeust('POST', BASE_URL + 'notes/', createRequestBody({
                    'title': 'Note title',
                    'text': 'Text of my note'
                }))
                    .then((response) => {
                        this.pushNote(eval('(' + response + ')'))
                    })
                    .catch((err) => {
                        console.error(err);
                        alert('Can not create new note');
                    }); 
            },
            pushNote(noteData) {
                this.notes.push(
                    new Vue({
                        data() {
                            return {
                                id: noteData._id,
                                text: noteData.text,
                                title: noteData.title,
                                index: 0,
                            }
                        },
                        watch: {
                            text(text) {
                                this.debSave();
                            },
                            title(title) {
                                this.debSave();
                            }
                        },
                        
                        created() {
                            this.debSave = _.debounce(this.saveNote, 1000);
                        },
                        
                        methods: {
                            saveNote() {
                                sendReqeust('PUT', BASE_URL + 'notes/' + this.id, createRequestBody({
                                    title: this.title,
                                    text: this.text,
                                }))
                                    .then((response) => {
                                        console.log(response);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        alert('Can not save note with title: \n' + data.title);
                                    });
                            },
                            deleteNote() {
                                sendReqeust('DELETE', BASE_URL + 'notes/' + this.id)
                                    .then((response) => {
                                        console.log(response);
                                        notespace.notes.splice(this.index, 1);
                                        setIndexes(notespace, 'notes');
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    });

                            },
                        },
                    }));
            },
        },


    });
}
