import Reflux from 'reflux'
import SocketStore from './SocketStore';
import moment from 'moment';

export default Reflux.createStore({
    
    init() {
        this.todoList = []
    }, 
    
    getTodoList() {
        console.log("get todo list: ", this.todoList)
        return this.todoList;
    },

    onMessageReceived(message) {
        switch (message.type) {
            case 'server/insert':
                console.log("todo stroe receved ", message.data)
                this.todoList = [...this.todoList, message.data];
                console.log("todo list: ", this.todoList)
                this.trigger("todoInserted")
                break;
            case 'server/update':
                
                this.todoList = this.todoList.map(todo => {
                    if (todo.key === message.data.key) {
                        const updatedTod = {...todo, ...message.data,}
                        return updatedTod
                    }
                    return todo
                })
                this.trigger("todoUpdated")
                break;
            case 'server/delete':
                this.todoList = this.todoList.filter(todo => todo.key !== message.data.key)
                this.trigger("todoDeleted")
                break;
            case 'server/select':        
        }
    },

    sendInsertTodo() {
        console.log("tesiting add")
        const date = moment(new Date()).format('L')
        const key = this.todoList.length
        const todo = {key: '' + key, title:"nisse", description: "nasse", dueDate: date};
        console.log("new ttot ", todo)
       // this.setState({todoList: todo})
       const message = {type: 'server/insert', data: todo}
       SocketStore.sendMessage(message)
    },

    sendUpdateTodo(key ,field, value) {
        const message = {type: 'server/update', data: {key: key,[field]: value}}
        SocketStore.sendMessage(message)
    },

    sendDelete(selectedTodo) {
        const todoToDelete = this.todoList.find(listItem => {
            if (selectedTodo.key ===  listItem.key) {
              //listItem[field] = value
              console.log("found value ", listItem.key)
              return true
            }
            return false
          })
          if (todoToDelete) {
            const message = {type: 'server/delete', data: {key: todoToDelete.key}}
            SocketStore.sendMessage(message)
          }
    },

 
  });