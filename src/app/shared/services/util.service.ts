import { Injectable } from '@angular/core';
import { ConvertToMillisecondsParams } from '../types/milliseconds-params.interface';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  convertToMilliseconds({
    hours = 0,
    mins = 0,
    secs = 0,
    ms = 0
  }: ConvertToMillisecondsParams): number {
    const convertHours = (hours * 60 + mins);
    const convertMins = (convertHours * 60 + secs);
    const convertSec = (convertMins * 1000);
    return convertSec + ms
  }
}