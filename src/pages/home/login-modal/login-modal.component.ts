import { CommonModule } from '@angular/common';
import { Component }  from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/user.model';
import { SharedAuthServiceWrapper } from 'src/services/shared-auth-wrapper.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private sharedAuthWrapper: SharedAuthServiceWrapper
  ) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(5)],
        nonNullable: true
      })
    });
  }

  // Custom validator for login errors
  private loginErrorValidator(errorMessage: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      return errorMessage ? { loginError: { message: errorMessage } } : null;
    };
  }

  // Method to set login error on password field
  private setLoginError(errorMessage: string): void {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl) {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(5),
        this.loginErrorValidator(errorMessage)
      ]);
      passwordControl.updateValueAndValidity();
    }
  }

  // Method to clear login error
  private clearLoginErrorValidator(): void {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl) {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(5)
      ]);
      passwordControl.updateValueAndValidity();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  get isButtonDisabled(): boolean {
    return this.loginForm.invalid || this.isLoading;
  }

  clearLoginError(): void {
    this.clearLoginErrorValidator();
  }

  getErrorMessage(field: keyof Pick<User, 'email' | 'password'>): string {
    const control = this.loginForm.get(field);

    // Check for login error first (highest priority)
    if (control?.hasError('loginError')) {
      return control.getError('loginError').message;
    }

    if (control?.hasError('required')) {
      return `${field === 'email' ? 'Email' : 'Senha'} é obrigatório`;
    }
    if (control?.hasError('email')) {
      return 'Email deve ter um formato válido';
    }
    if (control?.hasError('minlength')) {
      return 'Senha deve ter pelo menos 5 caracteres';
    }
    return '';
  }

  login(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.clearLoginErrorValidator();

      const credential: Pick<User, 'email' | 'password'> = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.userService.login(credential).subscribe({
        next: async (token: string) => {
          this.isLoading = false;
          console.log('Login realizado com sucesso:', token);

          // Check if login was successful
          if (token) {
            try {
              // Decodificar informações do usuário do token (opcional)
              const payload = JSON.parse(atob(token.split('.')[1]));
              const user = {
                id: payload.id,
                username: payload.username,
                email: payload.email
              };

              // Usar o serviço compartilhado
              await this.sharedAuthWrapper.login(token, user);
              
              this.dialogRef.close();
              // Navegar através do shell
              window.location.href = '/dashboard';
            } catch (error) {
              console.error('Erro ao processar login:', error);
              this.setLoginError('Erro interno. Tente novamente.');
            }
          } else {
            this.setLoginError('E-mail ou senha inválidos');
          }
        },
        error: (errorMessage: string) => {
          this.isLoading = false;
          console.error('Erro ao fazer login:', errorMessage);
          this.setLoginError(errorMessage);
        },
      });
    }
  }

  acessar(): void {
    if (!this.isButtonDisabled) {
      this.login();
    }
  }
}
