import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

fetch('/assets/config.json')
  .then(response => response.json())
  .then((config) => {
    // Gán config vào global hoặc inject bằng provider
    (window as any)['appConfig'] = config;
    // Gọi bootstrap app sau khi có config
    bootstrapApplication(AppComponent, appConfig)
      .catch(err => console.error(err));
});