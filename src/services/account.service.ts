import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService<Account> {
  private accountSubject = new BehaviorSubject<Account | null>(null);
  account$ = this.accountSubject.asObservable();

  constructor(http: HttpClient) {
    super(http, 'accounts');
  }

  /**
   * Carrega a conta do usuário (mockada com id '1') e atualiza o BehaviorSubject.
   *
   * - Utiliza o método `findById` para buscar a conta.
   * - O operador RxJS `tap` executa um efeito colateral ao emitir a conta para o `accountSubject`,
   *   permitindo que outros assinantes recebam a atualização.
   *
   * @returns Observable<Account> que emite a conta carregada
   */
  loadAccount(): Observable<Account> {
    return this.findById('1').pipe(
      tap((account) => this.accountSubject.next(account))
    );
  }

  /**
   * Retorna o snapshot (valor atual) da conta armazenada no BehaviorSubject.
   *
   * @returns Account | null - Conta atual ou null se não carregada
   */
  getAccountSnapshot(): Account | null {
    return this.accountSubject.getValue();
  }

  /**
   * Atualiza o nome do titular da conta.
   *
   * - Recupera o snapshot atual da conta.
   * - Realiza um PATCH na API para atualizar o nome do cliente.
   * - O operador RxJS `tap` atualiza o BehaviorSubject com a conta modificada.
   *
   * @param id ID da conta a ser atualizada
   * @param newName Novo nome do titular
   * @returns Observable<Account> que emite a conta atualizada
   */
  updateAccountName(id: string, newName: string): Observable<Account> {
    const currentAccount = this.getAccountSnapshot();
    if (!currentAccount) {
      throw new Error('No account loaded');
    }
    return this.patch(`${id}`, {
      customer: {
        id: currentAccount.customer.id,
        name: newName,
        email: currentAccount.customer.email,
      },
      id: currentAccount.id,
      number: currentAccount.number,
      balance: currentAccount.balance,
    }).pipe(tap((updatedAccount) => this.accountSubject.next(updatedAccount)));
  }
}
