import logo from './logo.svg';
import './App.css';
import React from 'react'
import moment from 'moment'
import DatePicker from "react-datepicker";
import Todo from './components/Todo'

import SocketStore from './stores/SocketStore';
import TodoStore from './stores/TodoStore';

class App extends React.PureComponent {
    constructor() {
      super()
      this.state = {todoList: TodoStore.getTodoList()};
      SocketStore.openSocket();
    }

    componentDidMount() {
      this.unsubscribe = TodoStore.listen(this.todoStoreUpdated);
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    todoStoreUpdated = (message) => {
      switch (message) {
        case 'todoInserted':
        case 'todoUpdated':
        case  'todoDeleted': 
          this.setState({todoList: TodoStore.getTodoList()})
      }
    }
                  
    addTodo = () => {
        TodoStore.sendInsertTodo();
    }
    
    updateTodo (key, field, value) {
      TodoStore.sendUpdateTodo(key ,field, value)
    }

    deleteTodo = () => {
      if (this.gridApi) {
        console.log("seleced ",this.gridApi.getSelectedRows());
        const selected = this.gridApi.getSelectedRows()
        if (selected.length > 0) {
          TodoStore.sendDelete(selected[0])
        }
      }
    }

    onGridReady = (obj) => {
      console.log("onGrid Ready ", obj)
      this.gridApi = obj.api
      this.columnApi = obj.columnApi
      console.log("api this", this.gridApi)
    } 
 
    render () {
      console.log("render app ")
        return (
          <div
          style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          >
            <Todo todoList={this.state.todoList} 
                  updateTodo={this.updateTodo} 
                  addTodo={this.addTodo} 
                  deleteTodo={this.deleteTodo}
                  onGridReady={this.onGridReady}/>
          </div>
        );
    }   
    
}

export default App;
