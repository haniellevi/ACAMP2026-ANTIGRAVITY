const Card = ({ children, className = '', style = {}, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-rustic)',
                borderRadius: 'var(--radius-rustic)',
                padding: '1.5rem',
                position: 'relative',
                boxShadow: 'var(--shadow-rustic)',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                cursor: onClick ? 'pointer' : 'default',
                transition: onClick ? 'transform 0.2s ease' : 'none',
                ...style
            }} className={className}>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: '4px', left: '4px', width: '8px', height: '8px', borderTop: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }}></div>
            <div style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderTop: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }}></div>
            <div style={{ position: 'absolute', bottom: '4px', left: '4px', width: '8px', height: '8px', borderBottom: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }}></div>
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '8px', height: '8px', borderBottom: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }}></div>

            {children}
        </div>
    );
};

export default Card;
