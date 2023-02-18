import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopFormValidators {

    // Whitespace validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors {

        // Check if the string has only white space
        if((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return error object
            return { 'notOnlyWhiteSpace': true }
        } else {
            // valid, return null
            return null as any;
        }
    }
}
