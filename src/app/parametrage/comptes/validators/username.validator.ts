import { AbstractControl } from '@angular/forms';
import { ParamService } from 'src/app/core/apiServices/param.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { timer, of } from 'rxjs';

export class UserNameAvailablity {
  static createValidator(paramService: ParamService, oldUserName: string) {
    return (control: AbstractControl) => {
      if (control.value === oldUserName) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() =>
          paramService
            .validateUsername(control.value)
            .pipe(map(res => (res ? null : { userNameTaken: true })))
        )
      );
    };
  }
}
