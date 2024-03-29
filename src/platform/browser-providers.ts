/*
 * These are globally available services in any component or any other service
 */
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_MOBILE_ROUTER_PROVIDERS } from '../app-mobile';
import { APP_ROUTER_PROVIDERS } from '../app';
import { AUTH_PROVIDERS } from '../common/auth/auth';
import { AuthGuard } from '../common/guards/auth.guard';

const DEFAULT_POST_HEADER: {[name: string]: string} = {
  'Content-Type': 'application/json'
};

const AUTH = [
  AuthGuard,
  AUTH_PROVIDERS({
    tokenPrefix: 'persice',
    defaultHeaders: DEFAULT_POST_HEADER,
    providers: {
      facebook: {
        url: '/api/v2/accounts/facebook/login/',
        authorizationEndpoint: 'https://www.facebook.com/v2.7/dialog/oauth',
        redirectUri: window.location.origin + '/public/close_popup/',
        clientId: FACEBOOK_ID,
        display: 'popup',
        scope: FACEBOOK_SCOPE.split(',')
      },
    }
  })
];
/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
export const APPLICATION_PROVIDERS_MAIN = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy},
  {provide: APP_BASE_HREF, useValue: '/'}
];

export const APPLICATION_PROVIDERS_MAIN_MOBILE = [
  // new Angular 2 forms
  disableDeprecatedForms(),
  provideForms(),
  ...HTTP_PROVIDERS,
  ...JSONP_PROVIDERS,
  ...APP_MOBILE_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy}
];

export const PROVIDERS_MAIN = [
  ...AUTH,
  ...APPLICATION_PROVIDERS_MAIN
];

export const PROVIDERS_MAIN_MOBILE = [
  ...AUTH,
  ...APPLICATION_PROVIDERS_MAIN_MOBILE
];
