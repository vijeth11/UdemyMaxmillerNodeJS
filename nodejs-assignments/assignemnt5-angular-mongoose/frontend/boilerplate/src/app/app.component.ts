import { Component } from '@angular/core';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public displayModal:boolean =false;
  public todoItems:{
    userId: number,
    listId: number,
    listItem: string
}[] = [];
  constructor(private todoService:TodoService){
    this.getTodoList();
  }

  onDelete(itemId:number){
    this.todoService.deleteTodo(itemId).subscribe(() => this.getTodoList());
  }

  onAddItem(data:string){
    this.displayModal = false;
    this.todoService.addTodo(data).subscribe(res => {      
      this.getTodoList();
    })
  }

  getTodoList(){
    this.todoService.getTodos()
    .subscribe(todos => {
      this.todoItems = todos;
    })
  }
}
