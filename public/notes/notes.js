//const BASE_URL = 'https://jolken.herokuapp.com/api/';
const BASE_URL = 'http://127.0.0.1:5000/';
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

function readCookie(cookieName) {
    var re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (cookieName && sMatch) return unescape(sMatch[1]);
    return '';
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
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
                                        alert('Can not save note with title: \n' + this.title);
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
                'isHidden': true
            }
        },

        created() {
            token = readCookie('token');
        },

        methods: {
            showConrolMenu(){

            },
            login() {
                sendReqeust('POST', BASE_URL + 'auth/login/', createRequestBody({ 'password': '123', 'username': 'su' }, 'password', 'username'))
                    .then((response) => {
                        this.token = eval('(' + response + ')').token;
                        this.logged = true;
                        deleteCookie('token');
                        setCookie('token', this.token, {expires: 10800, path : '/'});
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
