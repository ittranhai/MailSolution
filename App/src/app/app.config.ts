import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { MONACO_PATH } from '@materia-ui/ngx-monaco-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: MONACO_PATH,
      useValue: 'https://unpkg.com/monaco-editor@0.31.1/min/vs',
    },
  ]
};
