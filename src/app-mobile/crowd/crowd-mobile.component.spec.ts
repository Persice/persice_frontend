import { inject, async, addProviders, ComponentFixture, TestComponentBuilder } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideStore } from '@ngrx/store';
import STORE_REDUCERS from '../../common/reducers';
import STORE_ACTIONS from '../../common/actions';
import { MockCrowd, MockCrowdEmpty, MockCrowdService, CrowdService } from '../../common/crowd';
import { AppStateService } from '../shared/services';
import { CrowdMobileComponent } from './crowd-mobile.component';
import { FilterService, FriendService } from '../../app/shared/services';
import { HttpClient } from '../../common/core/http-client';

@Component({
  template: `<prs-mobile-crowd></prs-mobile-crowd>`,
  directives: [CrowdMobileComponent],
  providers: [
    FilterService
  ]
})
class TestComponent {
}

let componentInstance: TestComponent;
let componentElement: any;

describe('Crowd mobile component', () => {
  let mockCrowdService: MockCrowdService;

  beforeEach(() => {
    mockCrowdService = new MockCrowdService(null);
    addProviders([
      provideStore(STORE_REDUCERS),
      STORE_ACTIONS,
      mockCrowdService.getProvider(),
      FilterService,
      AppStateService,
      FriendService,
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideProviders(
        CrowdMobileComponent, [{provide: CrowdService, useValue: mockCrowdService}])
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture<any>) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  })));

  it('should show crowd list when matchfeed returns results', () => {
    // given
    crowdServiceReturnsResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const crowdLength = obtainLength(componentElement, '.user-card');
    expect(crowdLength).toBeGreaterThan(0);
  });

  it('should be empty when matchfeed returns zero results', () => {
    // given
    crowdServiceReturnsNoResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const crowdLength = obtainLength(componentElement, '.user-card');
    expect(crowdLength).toEqual(0);
  });

  function crowdServiceReturnsResults() {
    mockCrowdService.setResponse(MockCrowd);
  }

  function crowdServiceReturnsNoResults() {
    mockCrowdService.setResponse(MockCrowdEmpty);
  }

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
