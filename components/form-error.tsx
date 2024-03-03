import { FormAlert, FormAlertProps } from './form-alert';

/**
 * @description The authentication form error alert
 * @param {FormAlertProps} props The error form properties
 */
export const FormErrorAlert = (props: FormAlertProps) => (
  <FormAlert {...props} type="error" />
);
