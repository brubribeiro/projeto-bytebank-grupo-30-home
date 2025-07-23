import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
    private router: Router
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  get isButtonDisabled(): boolean {
    return !this.email.trim() || !this.senha.trim();
  }

  acessar(): void {
    if (!this.isButtonDisabled) {
      this.dialogRef.close();
      this.router.navigate(['/dashboard']);
    }
  }
}
