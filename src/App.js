import logo from './logo.svg';
import './App.css';
import { PureComponent } from 'react/cjs/react.production.min';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
//import Button from 'react-button';
import moment from 'moment'
import DatePicker from "react-datepicker";
//import { Table, Input, InputNumber, Popconfirm, Form, TypographyTag, Space } from 'antd';
import SocketStore from './stores/SocketStore';


class App extends PureComponent {
    constructor() {
      super()
      SocketStore.openSocket()
    }
    state = {todoList:  [{key: '0',title: "Toyota", description: "test", dueDate: 35000},
                        {key: '1',title: "Ford", description:"Mondeo", dueDate: 32000},
                        {key: '2',title:"Porsche", description: "Boxter", dueDate: 72000}],
            selectedRow: []}

    /*columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Due date',
        dataIndex: 'dueDate',
        key: 'dueDate',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (_: any, record: Item) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <a href="javascript:;" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                Save
              </a>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
      },
    ]; */                   
    addTodo = () => {
      console.log("tesiting add")
      const date = moment(new Date()).format('L')
      const key = this.state.todoList.length
      const todo =  [...this.state.todoList, {key: '' + key,title:"nisse", description: "nasse", dueDate: date}]
      console.log("new ttot ", todo)
      this.setState({todoList: todo})
    }
    
    updateTodo (key, field, value) {
      const todoList = this.state.todoList.map(listItem => {
        if (listItem.key === key) {
          listItem[field] = value
          console.log("found value ", key)
        }
        return listItem
      })
      this.setState({todoList: todoList})
    }

    deleteTodo = () => {
      if (this.gridApi) {
        console.log("seleced ",this.gridApi.getSelectedRows());
        const selected = this.gridApi.getSelectedRows()
        if (selected.length > 0) {
          const todoList = this.state.todoList.filter(listItem => {
            if (selected[0].key ===  listItem.key) {
              //listItem[field] = value
              console.log("found value ", listItem.key)
              return false
            }
            return true
          })
          this.setState({todoList: todoList})
        }
      }
    }

    onGridReady = (obj) => {
      console.log("onGrid Ready ", obj)
      this.gridApi = obj.api
      this.columnApi = obj.columnApi
      console.log("api this", this.gridApi)
    } 

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
      console.log("render ")
        return (
          <div>
            <button onClick={this.addTodo}>Add todo</button>  
            <button onClick={this.deleteTodo}>Delete Todo</button>  
            <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
                {<AgGridReact
                  defaultColDef={{
                    flex: 1,
                    minWidth: 200,
                    resizable: true,
                    floatingFilter: true,
                  }}
                  onGridReady={this.onGridReady}
                  rowSelection={'single'}
                  //onSelectionChanged={(obj) => {
                   // const selected = obj.api.getSelectedRows()
                   // this.setState({selectedRow:  obj.api.getSelectedRows()})
                   // console.log("selkection ", selected)}}
                  editType='fullRow'
                  rowData={this.state.todoList}>
                  <AgGridColumn filter={"agTextColumnFilter"} sortable={true} editable={true} field="title"></AgGridColumn>
                  <AgGridColumn filter={"agTextColumnFilter"} sortable={true} editable={true} field="description"></AgGridColumn>
                  <AgGridColumn filter={"agTextColumnFilter"} sortable={true} valueSetter={(obj) => {
                      console.log("setter new value ", obj)
                      this.updateTodo(obj.data.key, obj.colDef.field, obj.newValue)
                    }}
                    editable={true} field="dueDate"
                    comparator={this.dateComparator}
                    ></AgGridColumn>
                </AgGridReact>}
                {/*<Table dataSource={this.state.todoList} columns={this.columns} />*/}
            </div>
            </div>
        );
    }   
    
}

export default App;
