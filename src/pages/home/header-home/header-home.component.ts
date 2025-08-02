import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenAccountModalComponent } from '../open-account-modal/open-account-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../../interfaces/menu-item.interface';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDialogModule],
  selector: 'app-header-home',
  templateUrl: './header-home.component.html',
  styleUrl: './header-home.component.scss',
})
export class HeaderHomeComponent {

  constructor(private dialog: MatDialog) { }

  menuItems: Array<MenuItem> = [
    { label: 'Sobre', route: 'dashboard/#', active: true },
    { label: 'Serviços', route: 'dashboard/#', active: false },
    { label: 'Abrir minha conta', route: '/', active: false, class: 'header__action header__action--primary' },
    { label: 'Já tenho conta', route: '/', active: false, class: 'header__action header__action--secondary' },
  ];

  openAccountModal() {
    this.dialog.open(OpenAccountModalComponent, {
      width: '420px',
      maxWidth: '90vw',
      panelClass: 'byte-bank-dialog'
    });
  }

  openLoginModal() {
    this.dialog.open(LoginModalComponent, {
      width: '420px',
      maxWidth: '90vw',
      panelClass: 'byte-bank-dialog'
    });
  }

  onMenuItemClick(item: MenuItem, event: Event): void {
    event.preventDefault();
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;

    switch(item.label) {
      case 'Abrir minha conta':
        this.openAccountModal();
        break;
      case 'Já tenho conta':
        this.openLoginModal();
        break;
    }
  }

  onMobileMenuClick(item: MenuItem): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;

    switch(item.label) {
      case 'Abrir minha conta':
        this.openAccountModal();
        break;
      case 'Já tenho conta':
        this.openLoginModal();
        break;
    }
  }
}
