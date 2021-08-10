import React from 'react'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import moment from 'moment'

class Todo extends React.PureComponent {

    dateComparator = (date1, date2) => {
        console.log("dataComparator ", date1 + " " + date2)
        if (moment(date1).isAfter(moment(date2))) {
          console.log("after")
          return 1
        }
        if (moment(date1).isBefore(moment(date2))) {
          console.log("boefore")
          return -1
        }
        console.log("equal")
        return 0
    }

   render () {
       console.log("render ", this.props)
       return (
        <div>
            <button onClick={this.props.addTodo}>Add todo</button>  
            <button onClick={this.props.deleteTodo}>Delete Todo</button>  
            <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
            {<AgGridReact
                defaultColDef={{
                flex: 1,
                minWidth: 200,
                resizable: true,
                floatingFilter: true,
                }}
                onGridReady={this.props.onGridReady}
                rowSelection={'single'}
                editType='fullRow'
                rowData={this.props.todoList}>
                <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
                    console.log("setter new value ", obj)
                    this.props.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
                }} editable={true} field="title"></AgGridColumn>
                <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
                    console.log("setter new value ", obj)
                    this.props.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
                }} editable={true} field="description"></AgGridColumn>
                <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
                    console.log("setter new value ", obj)
                    this.props.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
                }}
                editable={true} field="dueDate"
                comparator={this.dateComparator}
                ></AgGridColumn>
            </AgGridReact>}
            </div>
        </div>
       );
   } 
}

export default Todo;