import { Injectable } from '@angular/core';
import { Todo, Todos } from '../model/todo';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/todos'
  private todos: Todos = [];

  constructor(private http: HttpClient){}

  findAll(): Observable<Todo[]>{
    return this.http.get<Todo[]>(this.apiUrl);
  }

  findById(id: string): Observable<Todo | undefined> {    
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Todo>(url); 
  }
  

  findByUserId(userId: string): Observable<Todo[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<Todo[]>(url);
  }

  findByUserIdParam(userId: string, param: string): Observable<Todo[]> {

  // const encodedParam = encodeURIComponent(param);

    const url = `${this.apiUrl}?userId=${userId}&${param}`;
    console.log(url)
    return this.http.get<Todo[]>(url);
  }
  
  

  createTodo(toCreate: Partial<Todo>): Observable<any> {
    const id = crypto.randomUUID()
    const newTodo: Todo = {... toCreate, id:id, done:false,editable:true } as Todo
    return this.http.post<Todo>(this.apiUrl,newTodo)
  }

  updateTodo(toUpdate: Partial<Todo>): Observable<any> {
    if (!toUpdate.id) {
      throw new Error('Impossible de mettre à jour : l\'ID est manquant.');
    }
    const url = `${this.apiUrl}/${toUpdate.id}`;
    return this.http.put<Todo>(url, toUpdate);
  }

  setFaisTodo(todo: Partial<Todo>): Observable<any>{
    todo.done = true
    console.log("setfaistodo : ", todo)
    return this.updateTodo(todo)
  }
  

  deleteTodo(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url); 
  }
}