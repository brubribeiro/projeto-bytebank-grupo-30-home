import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbarModule, MatButtonModule],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() servicos = [
    { text: 'Conta corrente' },
    { text: 'Conta PJ' },
    { text: 'Cartão de crédito' },
  ];

  @Input() contato = [
    { text: '0800 326 7079' },
    { text: 'meajuda@bytebank.com.br' },
    { text: 'ouvidoria@bytebank.com.br' },
  ];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'instagram',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Instagram.svg')
    );
    iconRegistry.addSvgIcon(
      'whatsapp',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Whatsapp.svg')
    );
    iconRegistry.addSvgIcon(
      'youtube',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Youtube.svg')
    );
  }
}
