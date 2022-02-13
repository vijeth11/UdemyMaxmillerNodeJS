import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  @Output() displayPop:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteClicked:EventEmitter<number> = new EventEmitter<number>();
  public todoItems:{
    userId: number,
    listId: number,
    listItem: string
  }[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  openPopup(){
    this.displayPop.emit(true);
  }

  onDelete(data:number){
    this.deleteClicked.emit(data);
  }
}
