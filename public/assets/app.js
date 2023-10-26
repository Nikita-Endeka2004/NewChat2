import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import * as firebase from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRICVtLdHOXwFr-hU3-7Tfu0aQLeJjmEU",
  authDomain: "newdata-e5098.firebaseapp.com",
  projectId: "newdata-e5098",
  storageBucket: "newdata-e5098.appspot.com",
  messagingSenderId: "661028746123",
  appId: "1:661028746123:web:94b39815cb0fb24992758e"
};
const app = initializeApp(firebaseConfig);
const db = firebase.getFirestore(app);
const messageCollection = firebase.collection(db, "data");

createApp({
  data(){
    return{
      userName: "Counter" ,
      list: [],
      textMessage: '',
      buttonDisabled: false
    }
  },
  methods: {
    changeUserName(){
      let name = prompt('Your name', this.userName);
      name = name.trim();
      if(name){
        this.userName = name;
        localStorage.setItem('userName', name);
      }
    },
    addMessege(){
      if(this.buttonDisabled){
        return;
      }
      let text = this.textMessage.trim();
      if(!text){
        return;
      }
      let words = text.split(' ');
      let truncatedWords = words.map(word => {
        return word.length > 35 ? word.substring(0, 35) : word;
      });
      
      text = truncatedWords.join(' ');
      let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      time = time.split(' ')[1] + ' (' + time.split(' ')[0].split('/').reverse().join('/') + ')';
      let newMessage = {
        name: this.userName,
        title: text,
        time: time
      }
      firebase.addDoc(messageCollection, newMessage);

      this.textMessage = '';
      this.buttonDisabled = true; // Блокируем кнопку
      console.log(this)
      setTimeout(() => {
        this.buttonDisabled = false; // Разблокируем кнопку через 7 секунд
      }, 7000);
    }
  },
  async mounted(){
    firebase.onSnapshot(messageCollection, async () =>{
      let q = firebase.query(messageCollection, firebase.orderBy('time', 'desc'), firebase.limit(40));
      let result = await firebase.getDocs(q);
      result = result.docs.map ( item => item.data());
      this.list = result;
    });
    let name = localStorage.getItem('userName');
    if(name){
      this.userName= name;
    }
  }
}).mount('#app');