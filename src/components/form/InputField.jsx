import React, { forwardRef } from 'react';

export const InputField = forwardRef(({
    type,
    error,
    name,
    placeholder,
    register,
    validate,
    value,
    disabled,
    maxLength,
    numeric,
    pattern,
    checked,
    isFieldDisabled,
    onChange,
    defaultValue,
    className
}, ref) => {
  const inputClassNames = `
    ${error ? 'required form-check-input' : ''} 
    ${isFieldDisabled ? 'disabled-field' : ''}
  `.trim();

  return (
    <div className={`${className} input-field`}>
      <input
        ref={ref}  
        type={type}
        id={name}
        name={name}
        validate={validate}
        checked={checked}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        {...(register ? register(name) : {})}
        placeholder={placeholder}
        className={`inputClassNames ${disabled ? 'disabled-field' : ''}`}
        disabled={disabled}
        numeric={numeric}
        pattern={pattern}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
});

export default InputField;
