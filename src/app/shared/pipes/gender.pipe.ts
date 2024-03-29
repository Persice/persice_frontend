import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Gender } from '../../../app-mobile/shared/model/gender';

@Injectable()
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    return Gender.parseGender(value);
  }
}
