import { FormAlert, FormAlertProps } from './form-alert';

/**
 * @description The authentication form success alert
 * @param {FormAlertProps} props The success form properties
 */
export const FormWarningAlert = (props: FormAlertProps) => (
  <FormAlert {...props} type="warning" />
);
