//const BASE_URL = 'https://jolken.herokuapp.com/api/';
const BASE_URL = 'http://127.0.0.1:5000/';
function sendReqeust(method, url, data) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/json");
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




function createRequestBody(data, valName1, valName2) {
    data[valName1] = data[valName1] || 'Note title';
    data[valName2] = data[valName2] || 'Text of my note';
    return (valName1 + '=' + data[valName1].replace(/ /g, "+") + '&'+valName2+'=' + data[valName2].replace(/ /g, "+"))
}

window.onload = () => {
    var notespace = new Vue({
        el: '#notespace',
        data: {
            notes: [],
            token: '',
        },
        created: function() {
            this.loadNotes();
        },
        methods : {
            loadNotes() {
                sendReqeust('POST', BASE_URL + 'api/notes/', {})
                    .then((response) => {
                        console.log(response);
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
                sendReqeust('PUT', BASE_URL + 'api/notes/', createRequestBody({
                    'title': 'Note title',
                    'text': 'Text of my note'
                }, 'title', 'text'))
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
                                sendReqeust('PUT', BASE_URL + 'api/notes/' + this.id, createRequestBody({
                                    title: this.title,
                                    text: this.text,
                                }, 'title', 'text'))
                                    .then((response) => {
                                        console.log(response);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        alert('Can not save note with title: \n' + data.title);
                                    });
                            },
                            deleteNote() {
                                sendReqeust('DELETE', BASE_URL + 'api/notes/' + this.id)
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
    var login = new Vue({
        el: '#user',
        data() {
            return {
                'username': 'stranger',
                'token': '',
                'img': 'https://i.ytimg.com/vi/R51hIY7swcQ/maxresdefault.jpg',
                'logged': false,
            }
        },

        created() {
        },

        methods: {
            login() {
                sendReqeust('POST', BASE_URL + 'auth/login/', createRequestBody({ 'password': '123', 'username': 'su' }, 'password', 'username'))
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log({ 'err': err });
                    })
            },
            register() {

            },
            changePassword() {

            }
        },
        


    });
    console.log(document.cookie);
}
