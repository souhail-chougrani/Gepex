import { FormGroup } from '@angular/forms';

export function doActionForAllFormFields(
  formGroup: FormGroup,
  action: 'touch' | 'disable'
) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (action === 'touch') {
      control.markAsTouched({ onlySelf: true });
    } else {
      control.disable({ onlySelf: true });
    }
  });
}
