import { TestBed } from '@angular/core/testing';

import { DataMahasiswaService } from './data-mahasiswa';

describe('DataMahasiswaService', () => {
  let service: DataMahasiswaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMahasiswaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
