import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-player',
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss'],
})
export class DialogEditPlayerComponent {
  public change: string;
  constructor(public dialogRef: MatDialogRef<DialogEditPlayerComponent>) {}

  /** Closes the dialog window.
  @function
  @name onNoClick
  @returns {void}
  */
  onNoClick(): void {
    this.dialogRef.close();
  }
}