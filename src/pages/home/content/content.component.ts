import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  imports: [CommonModule, MatListModule],
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  advantages = [
    {
      icon: 'assets/icone-presente.svg',
      title: 'Conta e cartão gratuitos',
      text: 'Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.'
    },
    {
      icon: 'assets/icone-saque.svg',
      title: 'Saques sem custo',
      text: 'Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.'
    },
    {
      icon: 'assets/icone-estrela.svg',
      title: 'Programa de pontos',
      text: 'Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!'
    },
    {
      icon: 'assets/icone-dispositivos.svg',
      title: 'Seguro Dispositivos',
      text: 'Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.'
    }]

}
