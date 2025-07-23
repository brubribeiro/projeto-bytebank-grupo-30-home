import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from '../pages/home/home.component';

@Component({
  standalone: true,
  imports: [
    HttpClientModule, 
    CommonModule,
    HomeComponent, 
    MatIconModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'projeto-bytebank-grupo-30-home';
}
