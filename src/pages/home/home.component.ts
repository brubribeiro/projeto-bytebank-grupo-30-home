import { Component } from '@angular/core';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderHomeComponent } from './header-home/header-home.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderHomeComponent,
    ContentComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(
    private userService: UserService,
  ) {}

  createAccount(userData: User): void {
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario criado com sucesso:', response);
      },
      error: (err) => console.error('Erro ao criar usuario:', err),
    });
  }
}
