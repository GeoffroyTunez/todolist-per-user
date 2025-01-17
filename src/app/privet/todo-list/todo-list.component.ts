import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../model/todo';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {

todos: Todo[] = [];
isAdding: boolean = false;
newTodo: Partial<Todo> = {};  

constructor(private todoService: TodoService) {};

ngOnInit():void{
  this.ChargerTodo();
}

ChargerTodo(): void {
  this.todoService.findAll().subscribe({
    next: (todos) => {
      this.todos = todos; 
      console.log('Tâches chargées :', this.todos);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des tâches :', err);
    },
  });
}

add(): void{
  this.isAdding = true;
}
ajouter(): void{
  console.log(this.newTodo)
  if (this.newTodo.description && this.newTodo.userId) {
    if(this.newTodo.id){
      this.todoService.updateTodo(this.newTodo).subscribe({
        next: (todo) =>{
          console.log('Todo Modifié:', todo)
          this.ChargerTodo()
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
          this.ChargerTodo()
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

  


  modifier(todo: Todo): void {
    this.isAdding = true;
    this.isAdding = true; // Indique qu'on est en mode édition
    this.newTodo = { ...todo }; // Pré-remplit le formulaire avec les valeurs existantes
  }


  supprimer(todo:Todo): void{
    this.todoService.deleteTodo(todo.id).subscribe(
      ()=>{
        this.ChargerTodo()
      },
      (error)=>{
        console.error('Erreur lors de la suppression du todo :', error);
      }
    )
  }

}
