import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent{

  users: User[] = [];

  newUser: Partial<User> = {};  
  isAdding = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.chargerUsers();
  }
  add(): void{
    this.isAdding = true;
  }
  ajouter(): void{
    console.log(this.newUser)
    if (this.newUser.username && this.newUser.password && this.newUser.role) {
      this.userService.createUser(this.newUser).subscribe({
        next: (user) => {
          console.log('Utilisateur ajouté :', user);
          this.chargerUsers();  // Recharge les utilisateurs après l'ajout
          this.newUser = {};  // Réinitialise le formulaire
          this.isAdding = false; // Désactive la classe CSS
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur :', err);
        }
      });
    } else {
      console.warn('Veuillez remplir tous les champs !');
    }
  }

  chargerUsers(): void {
    this.userService.findAll().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Utilisateurs chargés :', this.users);
      },
      error: (err)=>{
        console.error('Erreur lors du chargement des utilisateurs :', err);
      }
  });
    
  }

  supprimer(user: User): void {
    this.userService.deleteUser(user.id).subscribe(
      () => {
        this.chargerUsers();
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      }
    );
  }
}
