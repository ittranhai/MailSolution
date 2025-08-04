import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from "../../shared.module";
import { IMail } from "../../models/mail";

@Component({
  selector: 'app-sendmail-dialog',
  templateUrl: 'sendmailtemplate.component.html',
  standalone: true,
  imports: [
    SharedModule,
  ],
})
export class SendmailTemplateComponent {
  constructor(
    public dialogRef: MatDialogRef<SendmailTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMail,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}