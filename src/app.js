/**
 * 
 */

var data = [];
var el = document.getElementById('postListContainer');

firebase.initializeApp(config);
var dbRef = firebase.database().ref().child('postList');

dbRef.on('value',snap => {
    data = snap.val();
    $.createtemplate(el, data);
});