import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Analytics Dev - Web Development and AI Studio Mumbai';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: '#090d16',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                    color: '#ffffff',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '24px',
                        }}
                    >
                        A
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                        <span>Analytics</span><span style={{ color: '#64748b', fontWeight: 300 }}>Dev</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            marginLeft: '24px',
                            padding: '6px 16px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(148, 163, 184, 0.15)',
                            border: '1px solid rgba(129, 140, 248, 0.3)',
                            color: '#94a3b8',
                            fontSize: '14px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Mumbai · India
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '56px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            color: '#f8fafc',
                        }}
                    >
                        Founder-Led Web Development & Production AI Systems
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '26px',
                            fontWeight: 400,
                            color: '#94a3b8',
                            lineHeight: 1.4,
                        }}
                    >
                        Websites at a fixed INR 35,000 to 45,000. Web applications at INR 700 an hour, AI and data systems at $10 an hour. One engineer in Mumbai.
                    </div>
                </div>

                {/* Footer Metrics */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '32px',
                    }}
                >
                    <div style={{ display: 'flex', gap: '48px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>13</div>
                            <div style={{ display: 'flex', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects Delivered</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>2 to 4 Wks</div>
                            <div style={{ display: 'flex', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Turnaround</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>INR 35k-1.2L</div>
                            <div style={{ display: 'flex', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fixed INR Pricing</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>100%</div>
                            <div style={{ display: 'flex', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Ownership</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', fontSize: '16px', color: '#94a3b8', fontWeight: 600 }}>analyticsdev.xyz</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
