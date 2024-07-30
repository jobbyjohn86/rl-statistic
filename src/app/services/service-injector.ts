import { Injector, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceInjector {
  static injector: Injector;

  constructor(injector: Injector) {
    ServiceInjector.injector = injector;
  }

  static getService<T>(service: { new(...args: any[]): T }): T {
    if (!ServiceInjector.injector) {
      throw new Error('Injector has not been set!');
    }
    return ServiceInjector.injector.get(service);
  }
}
