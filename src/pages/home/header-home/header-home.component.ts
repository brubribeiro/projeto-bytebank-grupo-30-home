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
      panelClass: 'custom-modal'
    });
  }

  openLoginModal() {
    this.dialog.open(LoginModalComponent, {
      width: '420px',
      panelClass: 'custom-modal'
    });
  }

  openAccountClick(item: any, event: Event): void {
    if (item.label === 'Abrir minha conta') {
      event.preventDefault();
      this.onMenuItemClick(item, event);
    }
  }

  onMenuItemClick(item: any, event: Event): void {
    event.preventDefault();
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;

    if (item.label === 'Abrir minha conta') {
      this.openAccountModal();
    }

    if (item.label === 'Já tenho conta') {
      this.openLoginModal();
    }
  }
}
