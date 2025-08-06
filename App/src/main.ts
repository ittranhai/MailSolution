import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

fetch('/assets/appsettings.json')
  .then(response => response.json())
  .then((appsettings) => {
    // Gán config vào global hoặc inject bằng provider
    (window as any)['appsettings'] = appsettings;
    // Gọi bootstrap app sau khi có config
    bootstrapApplication(AppComponent, appConfig)
      .catch(err => console.error(err));
});