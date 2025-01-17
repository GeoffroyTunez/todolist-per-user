import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { User } from './model/user';
import { UserService } from './services/user.service';
import { UserListComponent } from "./privet/user-list/user-list.component";

import { Todo, Todos } from './model/todo';
import { TodoService } from './services/todo.service';
import { TodoListComponent } from "./privet/todo-list/todo-list.component";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [TodoListComponent, UserListComponent, CommonModule, FormsModule]
})
export class AppComponent {
  title = 'todolist-per-user';

  isConnected:boolean = false;
  user: Partial<User> = {}
  isAdmin:boolean = false
  todosFais: Todo[] = []; 
  todosPasFais: Todo[] = []; 

  
  isAdding: boolean = false;
  newTodo: Partial<Todo> = {};  

constructor(
  private userService: UserService,
  private todoService: TodoService
) {};

  ngOnInit():void{
    
  }
  connect(): void {
    if (this.user.username && this.user.password) {
      this.userService.check(this.user.username, this.user.password).subscribe({
        next: (user) => {
          if (user) {
            this.isConnected = true;
            this.user = user; // Mise à jour de l'utilisateur connecté
            this.isAdmin = user.role === "superAdmin"; // Vérification du rôle

            // Charger les tâches pour un utilisateur non-admin
            if (!this.isAdmin) {
              this.loadUserTodos(user.id);
            }

            console.log('Connexion réussie :', user);
          } else {
            console.warn('Identifiants incorrects.');
          }
        },
        error: (err) => {
          console.error('Erreur lors de la connexion :', err);
        },
      });
    } else {
      console.warn('Veuillez remplir tous les champs.');
    }
  }


  
  
  
  // CREATE
  add(): void{
    this.isAdding = true;
  }
  ajouter(): void{
    console.log(this.newTodo)
    this.newTodo.userId = this.user.id
    if (this.newTodo.description && this.newTodo.userId) {
      if(this.newTodo.id){
        this.todoService.updateTodo(this.newTodo).subscribe({
          next: (todo) =>{
            console.log('Todo Modifié:', todo)
            this.loadUserTodos(this.user.id)
            this.newTodo = {}
            this.isAdding = false
          },
          error: (err) => {
            console.error('Erreur lors de la modification du todo :', err);
          }
        });
      }else{
        this.todoService.createTodo(this.newTodo).subscribe({
          next: (todo) =>{
            console.log('Todo ajouté:', todo)
            this.loadUserTodos(this.user.id)
            this.newTodo = {}
            this.isAdding = false
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout de du todo :', err);
          }
        });
      }
      } else {
      console.warn('Veuillez remplir tous les champs !');
    }
  }

  // READ
  loadUserTodos(userId: string | undefined): void {
    if (!userId) {
      console.error('ID utilisateur manquant pour charger les tâches.');
      return;
    }

    this.todoService.findByUserIdParam(userId,"done=true").subscribe({
      next: (todos:Todos) => {
        this.todosFais = todos;
        console.log('Tâches chargées pour l\'utilisateur :', this.todosFais);
      },
    });
    this.todoService.findByUserIdParam(userId,"done=false").subscribe({
      next: (todos:Todos) => {
        this.todosPasFais = todos;
        console.log('Tâches chargées pour l\'utilisateur :', this.todosPasFais);
      },
    });
  }
  
  // UPDATE
  fais(todo: Todo): void{
    this.todoService.setFaisTodo(todo)
    console.log("fais", this.loadUserTodos(this.user.id))
    this.loadUserTodos(this.user.id)
  }
  modifier(todo: Todo): void {
    this.isAdding = true;
    this.isAdding = true; // Indique qu'on est en mode édition
    this.newTodo = { ...todo }; // Pré-remplit le formulaire avec les valeurs existantes
  }

  //DELETE
  supprimer(todo:Todo): void{
    this.todoService.deleteTodo(todo.id).subscribe(
      ()=>{
        this.loadUserTodos(this.user.id)
      },
      (error)=>{
        console.error('Erreur lors de la suppression du todo :', error);
      }
    )
  }
}


