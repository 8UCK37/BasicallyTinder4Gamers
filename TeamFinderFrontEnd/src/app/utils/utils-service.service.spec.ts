/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UtilsServiceService } from './utils-service.service';

describe('Service: UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsServiceService]
    });
  });

  it('should ...', inject([UtilsServiceService], (service: UtilsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
