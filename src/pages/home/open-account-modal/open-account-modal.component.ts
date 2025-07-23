import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCheckboxModule,
    MatDialogModule
  ],
  selector: 'app-open-account-modal',
  templateUrl: './open-account-modal.component.html',
  styleUrl: './open-account-modal.component.scss'
})
export class OpenAccountModalComponent {
  aceito: boolean = false;

  constructor(public dialogRef: MatDialogRef<OpenAccountModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
