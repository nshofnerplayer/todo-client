import React from 'react';
import Todo from './components/Todo';

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
      this.unsubscribe();
    }

    todoStoreUpdated = (message) => {
      switch (message) {
        case 'todoInserted':
        case 'todoUpdated':
        case  'todoDeleted': 
          this.setState({todoList: TodoStore.getTodoList()});
          break;
        default:  
      }
    }
                  
    addTodo = () => {
        TodoStore.sendInsertTodo();
    }
    
    updateTodo (key, field, value) {
      TodoStore.sendUpdateTodo(key ,field, value);
    }

    deleteTodo = () => {
      if (this.gridApi) {
        const selected = this.gridApi.getSelectedRows()
        if (selected.length > 0) {
          TodoStore.sendDelete(selected[0])
        }
      }
    }

    onGridReady = (obj) => {
      this.gridApi = obj.api
    } 
 
    render () {
        return (
          <div
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
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
