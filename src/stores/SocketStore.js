import Reflux from 'reflux'
import TodoStore from './TodoStore';

export default Reflux.createStore({
    //lines: [],
    //listenables: Actions,
    
    init() {
        this.websocket = undefined;
        this.wsUri = "ws://localhost:8080/todo-server/todo";
    },    

    openSocket() {
        if (!this.websocket) {
            this.websocket = new WebSocket(this.wsUri)
            
            this.websocket.onerror = (event) => { 
                console.log("onError: ", event) 
            };
            this.websocket.onopen = (event) => {
                console.log("Socket open! ", event);
            };
            this.websocket.onclose = (event) => {
                console.log("WebSocket is closed now.", event);
                this.websocket = undefined
            };
            this.websocket.onmessage = (event) => {
                console.log("socket store received ", event.data);
                const message = JSON.parse(event.data);
                TodoStore.onMessageReceived(message);
            }
        }

    },

    sendMessage(message) {
        if (this.websocket) {
            this.websocket.send(JSON.stringify(message));
        }
    },
    
    closeSocket() {
        console.log("close socket")
        if (this.websocket) {
            console.log("close socket2")
            this.websocket.close();
        }
    }
 
  });