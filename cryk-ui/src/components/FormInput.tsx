import { TextField, TextFieldProps } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
  name: string;
} & TextFieldProps;

const FormInput: FunctionComponent<IFormInputProps> = ({ name, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller control={control} name={name} defaultValue="" render={({ field })=> (
        <TextField
          {...otherProps}
          {...field}
          error={!!errors[name]}
          helperText={errors[name] ? errors[name]?.message : ""}
        />
      )}
    />
  );
};

export default FormInput;