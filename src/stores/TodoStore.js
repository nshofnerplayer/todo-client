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
                        const updatedTod = {...todo, ...message.data};
                        return updatedTod;
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
            default:            
        }
    },

    sendInsertTodo() {
        const date = moment(new Date()).format('YYYY-MM-DD');
        //key should normally be a databse id but creating a random key here
        const key = Math.floor(Math.random() * 100000);
        const todo = {key: '' + key, title: "title", description: "description", dueDate: date};
        const message = {type: 'server/insert', data: todo};
        SocketStore.sendMessage(message);
    },

    sendUpdateTodo(key ,field, value) {
        const message = {type: 'server/update', data: {key: key,[field]: value}};
        SocketStore.sendMessage(message);
    },

    sendDelete(selectedTodo) {
        const todoToDelete = this.todoList.find(listItem => selectedTodo.key ===  listItem.key);
          if (todoToDelete) {
            const message = {type: 'server/delete', data: {key: todoToDelete.key}};
            SocketStore.sendMessage(message);
          }
    },

 
  });