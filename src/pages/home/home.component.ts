import { Component } from '@angular/core';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderHomeComponent } from './header-home/header-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderHomeComponent, 
    ContentComponent, 
    FooterComponent,
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent { }