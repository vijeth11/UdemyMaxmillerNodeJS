import { ComponentFixture } from '@angular/core/testing';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MessageService } from './services/message.service';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Subscription } from 'rxjs';
import createPanZoom from 'panzoom';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  @ViewChild('container', {read: ViewContainerRef}) addTodo: ViewContainerRef |undefined;
  public displayModal:boolean =false;
  public componentSubs:Subscription = new Subscription();
  public messages:string[] = [];
  public todoItems:{
    userId: number,
    listId: number,
    listItem: string
  }[] = [];
  public currentIndex:number =-1;

  private messageReadSub:Subscription|null = null;
  private todoElements:HTMLElement[] = [];

  constructor(private todoService:TodoService, private messageService:MessageService, private componentFactoryResolver:ComponentFactoryResolver){
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
    /*let todoElement = (<HTMLElement>document.querySelector('#todo1'));
    let todoElement2 = (<HTMLElement>document.querySelector('#todo2'));*/
    let background = <HTMLElement>document.querySelector('#background');
    //this.todoElements = [todoElement,todoElement2];
    let {x, y, scale } =this.getPositionStorage();
    let panBackgroundInstance = createPanZoom(background,{
      initialX:x,
      initialY:y,
      initialZoom:scale,      
      transformOrigin: {x: 0.5, y: 0.5},
      onDoubleClick: (e) => {
        return false;
      },
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
  console.log(panBackgroundInstance.getTransform());
  let initialPanBackgroundTransformOrigin = panBackgroundInstance.getTransform();
  /*let panInstance = createPanZoom(todoElement,{ 
      transformOrigin: {x: 0.5, y: 0.5}, 
      onDoubleClick: (e) => {
        return false;
      },    
      beforeWheel:(event:WheelEvent)=>{
        return !this.wheelEffect(0);
      },
      beforeMouseDown:(event:MouseEvent)=>{
        return !this.mouseEffect(0);
      },
    });
    let panInstance2 = createPanZoom(todoElement2,{      
      transformOrigin: {x: 0.5, y: 0.5},
      onDoubleClick: (e) => {
        return false;
      },
      beforeWheel:(event:WheelEvent)=>{
        return !this.wheelEffect(1);
      },
      beforeMouseDown:(event:MouseEvent)=>{
        return !this.mouseEffect(1);
      },
    });*/
   panBackgroundInstance.on('pan', function(e) {
      console.log('Fired when the `element` is being panned', e);
    });
    
    panBackgroundInstance.on('panend', (e:any)=> {
     
      console.log(panBackgroundInstance.getTransform());
      let {x,y,scale} = panBackgroundInstance.getTransform();
      this.setPositionStorage(x,y,scale);
      console.log('Fired when pan ended', e);
    });
    
    panBackgroundInstance.on('zoom', (e) => {
      console.log('Fired when `element` is zoomed', e);
    });
    
    panBackgroundInstance.on('zoomend', (e) => {
      console.log('Fired when zoom animation ended', e);
      this.currentIndex = -1;
    });
    
    panBackgroundInstance.on('transform', (e:any) =>{
      // This event will be called along with events above.
      console.log('Fired when any transformation has happened', e);
      console.log(panBackgroundInstance.getTransformOrigin());
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
    if(this.componentSubs){
      this.componentSubs.unsubscribe();
    }
  }

  setPositionStorage(x: number, y: number, scale: number) {
    x = x/(1-scale);
    y= y/(1-scale);
    window.localStorage.setItem("todo1", JSON.stringify({ x, y, scale }));
  }

  getPositionStorage() {
    var val = window.localStorage.getItem("todo1");
    if(val){
      return JSON.parse(val);
    }else{
      return {x: 500, y: 600, scale: 0.75};
    }
  }

  addTodoElement(){
      if(this.addTodo){
        const dynamicComponentFactory = this.componentFactoryResolver.resolveComponentFactory(TodoListComponent);
        const componentInstance = this.addTodo.createComponent(dynamicComponentFactory).instance;
        componentInstance.todoItems = this.todoItems;
        this.componentSubs.add(componentInstance.displayPop.subscribe(data => {
          this.displayModal= data;
        }));
        this.componentSubs.add(componentInstance.deleteClicked.subscribe(data => {
          this.onDelete(data);
        }));
      }
  }
}
