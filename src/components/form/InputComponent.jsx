import React from 'react'

export const InputComponent = ({
    type,
    error,
    name,
    placeholder,
    value,
    disabled,
    maxLength,
    numeric,
    pattern,
    checked,
    isFieldDisabled,
    onChange,
    defaultValue,
}) => {
  const inputClassNames = `
    ${error ? 'required form-check-input' : ''} 
    ${isFieldDisabled ? 'disabled-field' : ''}
  `.trim();

  return (
    <div className="input-field">
      <input
        type={type}
        id={name}
        name={name}
        checked={checked}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={`inputClassNames ${disabled ? 'disabled-field' : ''}`}
        disabled={disabled}
        numeric={numeric}
        pattern={pattern}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
