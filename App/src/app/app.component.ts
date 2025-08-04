import { Component, Provider, SecurityContext } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ITemplate } from './shared/models/account';
import { MonacoEditorConstructionOptions, MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ApiMailService, ApiTempateService } from './shared/services/all.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/components/create-template/dialog.component';
import { IMail } from './shared/models/mail';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SendmailTemplateComponent } from './shared/components/sendmail-template/sendmailtemplate.component';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SharedModule,MatSidenavModule,MonacoEditorModule,AngularSplitModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    SharedModule.forRoot().providers as Provider,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
  ]
})
export class AppComponent {
  templates: ITemplate[] =[];
  activeTemplate:string = '';
  mail: IMail = {
    toEmail: '',
    subject: '',
    templateName: '',
    jsonBody: ''
  };
  HtmlOptions: MonacoEditorConstructionOptions = {
    language: 'html', // java, javascript, python, csharp, html, markdown, ruby
    theme: 'vs-dark', // vs, vs-dark, hc-black
    automaticLayout: true,
  };
  selectedTemplate:ITemplate = {
    templateName: '',
    content: '',
    jsonModel: ''
  }
  JsonOptions: MonacoEditorConstructionOptions = {
    language: 'json', // java, javascript, python, csharp, html, markdown, ruby
    theme: 'vs-light', // vs, vs-dark, hc-black
    automaticLayout: true,
  };
  nameTemplate: string = '';
  safeHtmlContent: SafeHtml = "";
  private updatePreviewTimeout: any;
  constructor(
    protected apiTemplateService: ApiTempateService<ITemplate>,
    protected apiMailService: ApiMailService<IMail>,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    protected snackBar: MatSnackBar,
  )
  {
    
  }
  ngOnInit(): void {
    this.loadTemplate();
  }
  loadTemplate(){
    this.apiTemplateService.Get({}).subscribe((response: ITemplate[]) => {
      this.templates = response;
      if (this.templates.length > 0) {
        this.selectedTemplate = this.templates[0];
        this.activeTemplate = this.selectedTemplate.templateName;
        this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.selectedTemplate.content);
      }
      else{
        this.newTemplate('TestTemplate');       
      }
    })
  }
  selectTemplate(template: ITemplate) {
    this.selectedTemplate = template;
    this.activeTemplate = this.selectedTemplate.templateName;
  }
  onContentChange(content: string) {
    clearTimeout(this.updatePreviewTimeout);
    this.updatePreviewTimeout = setTimeout(() => {
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(content);
    }, 300); // debounce 300ms
  }
  async reviewTemplate(){
    await this.saveTemplate(false);
    this.apiTemplateService.Create(this.selectedTemplate,'Render')
                .pipe(catchError((err) => this.handleError(err)))
                .subscribe((result: any) => {
                    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(result.content);
                });
  }
  newTemplate(templateName: string) {
    this.selectedTemplate = {
      templateName: templateName,
      content: `<!DOCTYPE html>
<html>
  <head>
    <title>${templateName}</title>
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>`,
      jsonModel: '{}'
    };
    let oldTemplate = this.templates.find(t => t.templateName === this.selectedTemplate.templateName);
    if(oldTemplate) {
      this.selectedTemplate = oldTemplate;
    }
    else{ 
      this.templates.push(this.selectedTemplate);
    }
    this.activeTemplate = this.selectedTemplate.templateName;
    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.selectedTemplate.content);
  }
  saveTemplate(IsShowMessage:boolean = true) {
    console.log('Saving template:', this.selectedTemplate);
    this.apiTemplateService.Create(this.selectedTemplate)
                .pipe(catchError((err) => this.handleError(err)))
                .subscribe((result: any) => {
                  if(IsShowMessage){
                    this.openSnackBar("Save template success", "close");
                  }
                });
  }
  handleError(error: any) {
    console.error('An error occurred:', error);
    let message;
    if (error.status === 400) {
      message = error.error;
    }
    else 
    {
      message = error.statusText;
    }
    this.openSnackBar(message, "close"); 
    return throwError(() => error);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.nameTemplate,
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(!result || result.trim() === '') {
        return;
      }
      this.newTemplate(result);
    });
  }
  sendMail() {
    this.mail.templateName = this.selectedTemplate.templateName;
    this.mail.jsonBody = this.selectedTemplate.jsonModel;
    if(!this.mail.toEmail || !this.mail.subject || !this.mail.templateName) {
      this.openSnackBar("Vui lòng nhập đầy đủ thông tin email", "close"); 
      return;
    }
    this.apiMailService.Create(this.mail, 'send')
                .pipe(catchError((err) => this.handleError(err)))
                .subscribe((result: any) => {
                    this.openSnackBar("send mail success", "close");
                });
  }
  openSnackBar(message: string, action?: string, verticalPosition: 'top' | 'bottom' = 'top', horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right' = 'center') {
        this.snackBar.open(message, action, {
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition,
            duration: 5000,
            panelClass: ['snackbar', 'snackbar-error']
        });
  }
  openDialogSendmail() {
    const dialogRef = this.dialog.open(SendmailTemplateComponent, {
      data: this.mail,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result || result.toEmail.trim() === '' || result.subject.trim() === '') {
        return;
      }
      this.sendMail();
    });
  }
}
