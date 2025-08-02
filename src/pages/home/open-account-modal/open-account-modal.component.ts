import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { SharedAuthServiceWrapper } from '../../../services/shared-auth-wrapper.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  selector: 'app-open-account-modal',
  templateUrl: './open-account-modal.component.html',
  styleUrl: './open-account-modal.component.scss'
})
export class OpenAccountModalComponent {
  openAccountForm: FormGroup<{
    username: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    aceito: FormControl<boolean>;
  }>;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<OpenAccountModalComponent>,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private sharedAuthWrapper: SharedAuthServiceWrapper
  ) {
    this.openAccountForm = this.fb.group({
      username: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
        nonNullable: true
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(5)],
        nonNullable: true
      }),
      aceito: this.fb.control(false, {
        validators: [Validators.requiredTrue],
        nonNullable: true
      })
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  get isButtonDisabled(): boolean {
    return this.openAccountForm.invalid || this.isLoading;
  }

  getErrorMessage(field: keyof User | 'aceito'): string {
    const control = this.openAccountForm.get(field);

    if (control?.hasError('required')) {
      switch (field) {
        case 'username': return 'Nome é obrigatório';
        case 'email': return 'Email é obrigatório';
        case 'password': return 'Senha é obrigatória';
        case 'aceito': return 'Você deve aceitar os termos';
        default: return 'Campo obrigatório';
      }
    }

    if (control?.hasError('email')) {
      return 'Email deve ter um formato válido';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      switch (field) {
        case 'username': return `Nome deve ter pelo menos ${requiredLength} caracteres`;
        case 'password': return `Senha deve ter pelo menos ${requiredLength} caracteres`;
        default: return `Campo deve ter pelo menos ${requiredLength} caracteres`;
      }
    }

    return '';
  }

  createAccount(): void {
    if (this.openAccountForm.valid && !this.isLoading) {
      this.isLoading = true;

      const { username, email, password, aceito } = this.openAccountForm.value;

      if (!aceito) {
        // Handle case where user did not accept terms
        console.error('Usuário não aceitou os termos');
        return;
      }

      const user: Omit<User, 'id'> = {
        username: username ??  '',
        email: email ??  '',
        password: password ??  ''
      };

      this.userService.createUser(user as User).subscribe({
        next: (createdUser: User) => {
          console.log('Conta criada com sucesso:', createdUser);

          // Automatically log in the user after account creation
          const credential: Pick<User, 'email' | 'password'> = {
            email: this.openAccountForm.value.email!,
            password: this.openAccountForm.value.password!
          };

          this.userService.login(credential).subscribe({
            next: async (token: string) => {
              this.isLoading = false;
              console.log('Login realizado com sucesso após criação da conta:', token);

              // Store the token and redirect to dashboard
              if (token) {
                try {
                  // Decodificar informações do usuário do token
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  const userWithToken = {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email
                  };

                  // Usar o serviço compartilhado
                  await this.sharedAuthWrapper.login(token, userWithToken);

                  this.dialogRef.close(createdUser);
                  // Navegar através do shell
                  window.location.href = '/dashboard';
                } catch (error) {
                  console.error('Erro ao processar login automático:', error);
                  this.dialogRef.close(createdUser);
                }
              } else {
                this.isLoading = false;
                console.error('Token não recebido após login automático');
                // Just close the modal if login fails, user can manually login
                this.dialogRef.close(createdUser);
              }
            },
            error: (loginError: string) => {
              this.isLoading = false;
              console.error('Erro no login automático após criação da conta:', loginError);
              // Account was created successfully, but auto-login failed
              // Just close the modal, user can manually login
              this.dialogRef.close(createdUser);
            }
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erro ao criar conta:', error);
          // TODO: Handle error display
        }
      });
    }
  }
}
