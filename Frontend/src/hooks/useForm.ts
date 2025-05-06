import {useEffect, useState} from 'react';

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initialValue, validate}: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangeText = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };
  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);

    return {value, onChangeText, onBlur};
  };

  const getFieldProps = <K extends keyof T>(name: K) => {
    const value = values[name];
    const onChange = (value: T[K]) => handleChange(name, value);
    const onBlur = () => handleBlur(name);

    return {value, onChange, onBlur};
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return {
    values,
    errors,
    touched,
    getTextInputProps,
    getFieldProps,
  };
}

export default useForm;
