/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatServicesService } from './chat-services.service';

describe('Service: ChatServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatServicesService]
    });
  });

  it('should ...', inject([ChatServicesService], (service: ChatServicesService) => {
    expect(service).toBeTruthy();
  }));
});
