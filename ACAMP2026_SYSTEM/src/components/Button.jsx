import styles from './Button.module.css';

const Button = ({ children, onClick, disabled, type = 'button', variant = 'primary', fullWidth = false }) => {
    return (
        <button
            type={type}
            className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
