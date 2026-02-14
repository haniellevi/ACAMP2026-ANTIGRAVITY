const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontSize: '1rem',
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '1px'
                }}>
                    {label} {required && <span style={{ color: 'var(--color-fire)' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    border: '2px solid var(--color-wood-light)',
                    borderRadius: 'var(--radius-rustic)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-wood-light)'}
            />
        </div>
    );
};

export default Input;
