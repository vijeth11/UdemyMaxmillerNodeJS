import { MessageService } from './services/message.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  public displayModal:boolean =false;
  public messages:string[] = [];
  public todoItems:{
    userId: number,
    listId: number,
    listItem: string
  }[] = [];

  private messageReadSub:Subscription|null = null;

  constructor(private todoService:TodoService, private messageService:MessageService){
    this.getTodoList();
    this.messageService.startRecievingMessage();
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

  sendMessage(message:string){
    this.messageService.sendMessage(message);
  }

  ngOnInit(){
    this.messageReadSub = this.messageService.message
    .subscribe((msg:string) => this.messages.push(msg));
  }

  ngOnDestroy(){
    if(this.messageReadSub){
      this.messageReadSub.unsubscribe();
    }
  }
}
