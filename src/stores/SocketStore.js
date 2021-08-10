import Reflux from 'reflux'

export default Reflux.createStore({
    //lines: [],
    //listenables: Actions,
    
    init() {
        this.websocket = undefined;
        this.wsUri = "ws://localhost:8080/TodoServer/todo";
    },    

    openSocket() {
        this.websocket = new WebSocket(this.wsUri)
        
        this.websocket.onerror = (event) => { 
            console.log("onError: ", event) 
        };
        this.websocket.onopen = (event) => {
            console.log("Here's some text that the server is urgently awaiting!");
        };
        this.websocket.onclose = (event) => {
            console.log("WebSocket is closed now.", event);
        };
        this.websocket.onmessage = (event) => {
            console.log(event.data);
          }
    },

    sendMessage(message) {
        if (this.websocket) {
            this.websocket.send(JSON.stringify(message));
        }
    },
    
    closeSocket() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
 
  });