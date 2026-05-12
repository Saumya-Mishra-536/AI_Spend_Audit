import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = searchParams.get('savings');
  const optimized = searchParams.get('optimized') === 'true';
  const displaySavings = savings ? `$${Number(savings).toFixed(0)}` : '$0';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '60px 80px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            AI Spend Audit Results
          </div>

          {optimized ? (
            <div
              style={{
                fontSize: 56,
                color: '#4ade80',
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              Perfectly Optimized ✅
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 72,
                  color: '#ffffff',
                  fontWeight: 800,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                Save {displaySavings}
                <span style={{ fontSize: 48, color: '#94a3b8' }}>/mo</span>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: '#94a3b8',
                  marginTop: 20,
                  textAlign: 'center',
                }}
              >
                on AI tools like Cursor, Claude & ChatGPT
              </div>
            </>
          )}

          <div
            style={{
              marginTop: 40,
              fontSize: 20,
              color: '#60a5fa',
            }}
          >
            Run your free audit → credex.rocks
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}