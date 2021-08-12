import Reflux from 'reflux';
import SocketStore from './SocketStore';
import moment from 'moment';

export default Reflux.createStore({
    
    init() {
        this.todoList = [];
    }, 
    
    getTodoList() {
        return this.todoList;
    },

    onMessageReceived(message) {
        switch (message.type) {
            case 'server/insert':
                this.todoList = [...this.todoList, message.data];
                this.trigger("todoInserted");
                break;
            case 'server/update':
                this.todoList = this.todoList.map(todo => {
                    if (todo.key === message.data.key) {
                        const updatedTodo = {...todo, ...message.data};
                        return updatedTodo;
                    }
                    return todo;
                })
                this.trigger("todoUpdated");
                break;
            case 'server/delete':
                this.todoList = this.todoList.filter(todo => todo.key !== message.data.key);
                this.trigger("todoDeleted");
                break;
            case 'server/receive':        
        }
    },

    sendInsertTodo() {
        const date = moment(new Date()).format('L');
        //key should normally be a databse id but creating a random key here
        const key = Math.floor(Math.random() * 100000);
        const todo = {key: '' + key, title: "title", description: "description", dueDate: date};
        const message = {type: 'server/insert', data: todo};
        SocketStore.sendMessage(message);
    },

    sendUpdateTodo(key ,field, value) {
        const message = {type: 'server/update', data: {key: key, [field]: value}};
        SocketStore.sendMessage(message);
    },

    sendDelete(selectedTodo) {
        const todoToDelete = this.todoList.find(listItem => {
            if (selectedTodo.key ===  listItem.key) {
              return true;
            }
            return false;
          })
          if (todoToDelete) {
            const message = {type: 'server/delete', data: {key: todoToDelete.key}};
            SocketStore.sendMessage(message);
          }
    },

 
  });