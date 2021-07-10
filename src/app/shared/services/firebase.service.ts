import { NgZone, Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {
  constructor(
    private ngZone: NgZone,
    //private utils: UtilsService
  ){}
}