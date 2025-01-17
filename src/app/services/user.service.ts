import { Injectable } from '@angular/core';
import { User, Users } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'
  private users: Users = [];

  constructor(private http: HttpClient){}

  findAll(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  findById(id: string): Observable<User | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url); 
  }

  createUser(toCreate: Partial<User>): Observable<any> {
    const id = crypto.randomUUID(); // Génère un ID unique pour l'utilisateur
    const newUser: User = { ...toCreate, id: id } as User;
    return this.http.post<User>(this.apiUrl,newUser)
  }

  check(username: string, password: string): Observable<User | null> {
    const url = `${this.apiUrl}?username=${username}`;
    return this.http.get<User[]>(url).pipe(
      map((users) => {
        const user = users.find((u) => u.username === username && u.password === password);
        return user || null; 
      })
    );
  }
  

  // updateTodo(toUpdate: User): void {
  //   this.users = this.users.map((t) => (t.id === toUpdate.id ? toUpdate : t));
  // }

  deleteUser(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url); 
  }
}