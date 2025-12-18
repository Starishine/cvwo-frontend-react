export default function Logo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#111827',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18
            }}>
                R
            </div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>eadIT</div>
        </div>
    )
}