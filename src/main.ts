import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import themes from 'devextreme/ui/themes';
import { enableProdMode } from '@angular/core';


if (environment.production) {
  enableProdMode();
}

themes.initialized(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch((err) => console.error(err));

});

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
