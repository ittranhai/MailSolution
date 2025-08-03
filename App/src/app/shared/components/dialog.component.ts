import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from "../shared.module";

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [
    SharedModule,
  ],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}