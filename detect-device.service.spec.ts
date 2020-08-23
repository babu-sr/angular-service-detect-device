import { TestBed } from '@angular/core/testing';

import { DetectDeviceService } from './detect-device.service';

describe('DetectDeviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetectDeviceService = TestBed.get(DetectDeviceService);
    expect(service).toBeTruthy();
  });
});
