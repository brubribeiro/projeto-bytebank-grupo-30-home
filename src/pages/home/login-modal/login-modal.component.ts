import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../../../services/account.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  email: string = '';
  senha: string = '';

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private router: Router,
    private accountService: AccountService
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  get isButtonDisabled(): boolean {
    return !this.email.trim() || !this.senha.trim();
  }

  login(credentials: any): void {
    this.accountService.auth(credentials).subscribe({
      next: (loginResponse : any) => {
        console.log('Login realizado com sucesso:', loginResponse);
        // TODO: set token in local storage or state management
        window?.localStorage?.setItem('authToken', loginResponse?.result?.token);
      },
      error: (err) => console.error('Erro ao fazer login:', err),
    });
  }

  acessar(): void {
    if (!this.isButtonDisabled) {
      this.dialogRef.close();
      this.router.navigate(['/dashboard']);
    }
  }
}
