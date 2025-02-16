// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');

// Google Authentication
const provider = new GoogleAuthProvider();

loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            loginScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
});

logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        loginScreen.classList.remove('hidden');
        chatScreen.classList.add('hidden');
    }).catch((error) => {
        console.error("Error during sign-out:", error);
    });
});

// Sending Messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        newMessageRef.set({
            text: message,
            sender: auth.currentUser.displayName,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

// Receiving Messages
const messagesRef = ref(database, 'messages');
onChildAdded(messagesRef, (data) => {
    const messageData = data.val();
    displayMessage(messageData.text, messageData.sender);
});

function displayMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${sender}: ${text}`;
    if (sender === auth.currentUser.displayName) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
      }
