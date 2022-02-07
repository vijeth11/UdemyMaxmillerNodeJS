import { MessageService } from './services/message.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Subscription } from 'rxjs';
import createPanZoom from 'panzoom';
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
  public currentIndex:number =-1;

  private messageReadSub:Subscription|null = null;
  private todoElements:HTMLElement[] = [];

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
    let todoElement = (<HTMLElement>document.querySelector('#todo1'));
    let todoElement2 = (<HTMLElement>document.querySelector('#todo2'));
    let background = <HTMLElement>document.querySelector('#background');
    this.todoElements = [todoElement,todoElement2];
    //panzoom1.panzoom("#todo1");
    //panzoom1.panzoom("#background");
    let panBackgroundInstance = createPanZoom(background,{
      beforeWheel: function(e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
      },
      beforeMouseDown: function(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
      }
    });
    let panInstance = createPanZoom(todoElement,{      
      beforeWheel:(event:WheelEvent)=>{
        return !this.wheelEffect(0);
      },
      beforeMouseDown:(event:MouseEvent)=>{
        return !this.mouseEffect(0);
      },
    });
    let panInstance2 = createPanZoom(todoElement2,{      
      beforeWheel:(event:WheelEvent)=>{
        return !this.wheelEffect(1);
      },
      beforeMouseDown:(event:MouseEvent)=>{
        return !this.mouseEffect(1);
      },
    });
   panInstance.on('pan', function(e) {
      console.log('Fired when the `element` is being panned', e);
    });
    
    panInstance.on('panend', function(e) {
      console.log('Fired when pan ended', e);
    });
    
    panInstance.on('zoom', (e) => {
      console.log('Fired when `element` is zoomed', e);
    });
    
    panInstance.on('zoomend', (e) => {
      console.log('Fired when zoom animation ended', e);
      this.currentIndex = -1;
    });
    
    panInstance.on('transform', (e) =>{
      // This event will be called along with events above.
      console.log('Fired when any transformation has happened', e);
      this.currentIndex = -1;
    });
  }

  wheelEffect(index:number){    
    return this.currentIndex == index;
  }

  mouseEffect(index:number){
    return this.currentIndex == index;
  }

  ngOnDestroy(){
    if(this.messageReadSub){
      this.messageReadSub.unsubscribe();
    }
  }
}
