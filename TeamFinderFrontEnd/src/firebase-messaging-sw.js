importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyDpR4P95ehxX3iN0IwLjVM8KFWP6JCN33Q",
    authDomain: "teamfinder-e7048.firebaseapp.com",
    projectId: "teamfinder-e7048",
    storageBucket: "teamfinder-e7048.appspot.com",
    messagingSenderId: "760131924547",
    appId: "1:760131924547:web:9e93ae9834f848699fdaf6",
    measurementId: "G-Q0LNWXCFB6"
});
const messaging = firebase.messaging();