import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class TodoService{
    
    constructor(private http: HttpClient){

    }

    getTodos():Observable<{
        userId: number,
        listId: number,
        listItem: string
    }[]>{
        return this.http.get<{
            userId: number,
            listId: number,
            listItem: string
        }[]>("/api/todo?userId=6");
    }

    addTodo(todoItem:string):Observable<any>{
        return this.http.post("/api/add",{
            username:"vijeth",
            item:todoItem
        })
    }

    deleteTodo(listId:number):Observable<any>{
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
                username:"vijeth",
                listId: listId
            },
          };
        return this.http.delete("/api/delete",options);
    }
}