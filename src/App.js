import logo from './logo.svg';
import './App.css';
import { PureComponent } from 'react/cjs/react.production.min';
//import {AgGridColumn, AgGridReact} from 'ag-grid-react';
//import 'ag-grid-community/dist/styles/ag-grid.css';
//import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import moment from 'moment'
import DatePicker from "react-datepicker";
import Todo from './components/Todo'

import SocketStore from './stores/SocketStore';
import TodoStore from './stores/TodoStore';

class App extends PureComponent {
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

    // dateComparator = (date1, date2) => {
    //   console.log("dataComparator ", date1 + " " + date2)
    //   if (moment(date1).isAfter(moment(date2))) {
    //     console.log("after")
    //     return 1
    //   }
    //   if (moment(date1).isBefore(moment(date2))) {
    //     console.log("boefore")
    //     return -1
    //   }
    //   console.log("equal")
    //   return 0
    // }
 
    render () {
      console.log("render app ")
        return (
          <div>
            <Todo todoList={this.state.todoList} 
                  updateTodo={this.updateTodo} 
                  addTodo={this.addTodo} 
                  deleteTodo={this.deleteTodo}
                  onGridReady={this.onGridReady}/>
          </div>
          // <div>
          //     <button onClick={this.addTodo}>Add todo</button>  
          //     <button onClick={this.deleteTodo}>Delete Todo</button>  
          //     <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
          //       {<AgGridReact
          //         defaultColDef={{
          //           flex: 1,
          //           minWidth: 200,
          //           resizable: true,
          //           floatingFilter: true,
          //         }}
          //         onGridReady={this.onGridReady}
          //         rowSelection={'single'}
          //         editType='fullRow'
          //         rowData={this.state.todoList}>
          //         <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
          //             console.log("setter new value ", obj)
          //             this.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
          //           }} editable={true} field="title"></AgGridColumn>
          //         <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
          //             console.log("setter new value ", obj)
          //             this.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
          //           }} editable={true} field="description"></AgGridColumn>
          //         <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
          //             console.log("setter new value ", obj)
          //             this.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
          //           }}
          //           editable={true} field="dueDate"
          //           comparator={this.dateComparator}
          //           ></AgGridColumn>
          //       </AgGridReact>}
          //     </div>
          //   </div>
        );
    }   
    
}

export default App;
