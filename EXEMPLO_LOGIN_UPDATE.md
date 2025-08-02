# Exemplo de Integração com Sistema de Autenticação Aprimorado

## Overview

O sistema agora utiliza uma arquitetura aprimorada de gerenciamento de sessão com:
- Event-driven communication entre microfrontends
- Estratégias de storage configuráveis
- Sincronização automática de estado
- Fallbacks para garantir robustez

## Como Usar o SharedAuthServiceWrapper

### 1. Importar e Injetar o Serviço

```typescript
import { SharedAuthServiceWrapper } from 'src/services/shared-auth-wrapper.service';

constructor(
  // outros serviços...
  private sharedAuthWrapper: SharedAuthServiceWrapper
) {}
```

### 2. Realizar Login

```typescript
async login(): Promise<void> {
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
```

### 3. Escutar Estado de Autenticação

```typescript
ngOnInit() {
  // Escutar mudanças no estado de autenticação
  this.sharedAuthWrapper.authState$.subscribe(state => {
    if (state?.isAuthenticated) {
      console.log('Usuário autenticado:', state.user);
    } else {
      console.log('Usuário não autenticado');
    }
  });

  // Ou usar observables específicos
  this.sharedAuthWrapper.isAuthenticated$.subscribe(isAuth => {
    this.isUserLoggedIn = isAuth;
  });
}
```

### 4. Verificar Autenticação

```typescript
async checkAuth() {
  const isAuthenticated = await this.sharedAuthWrapper.isAuthenticated();
  const currentUser = await this.sharedAuthWrapper.getCurrentUser();
  const token = await this.sharedAuthWrapper.getToken();
  
  console.log('Status:', { isAuthenticated, currentUser, token });
}
```

### 5. Logout

```typescript
async logout() {
  await this.sharedAuthWrapper.logout();
  window.location.href = '/home';
}
```

## Novos Recursos

### Event Bus
- Sistema de eventos para comunicação entre microfrontends
- Sincronização automática de estado
- Eventos de login, logout, expiração de sessão

### Storage Strategies
- LocalStorage (padrão)
- SessionStorage
- In-Memory (para testes)
- Fallback automático para compatibilidade

### State Sync
- Sincronização cross-tab
- Detecção de expiração de sessão
- Atualização automática de atividade

### Fallback Mechanisms
- Se o shell não estiver disponível, usa localStorage diretamente
- Graceful degradation
- Logs detalhados para debugging

## Migração do Código Existente

### Antes (Antigo)
```typescript
// Direto no localStorage
window?.localStorage?.setItem('authToken', token);
this.router.navigate(['/dashboard']);
```

### Depois (Novo)
```typescript
// Via serviço compartilhado
await this.sharedAuthWrapper.login(token, user);
window.location.href = '/dashboard';
```

## Benefícios

1. **Consistência**: Estado sincronizado entre todos os microfrontends
2. **Robustez**: Fallbacks em caso de falha
3. **Flexibilidade**: Estratégias de storage configuráveis
4. **Observabilidade**: Logs e eventos detalhados
5. **Escalabilidade**: Sistema preparado para novos microfrontends
