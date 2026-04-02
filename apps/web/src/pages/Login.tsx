import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { SequenceCaptcha } from '../components/ui/SequenceCaptcha';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaPassed) {
      setError('Mohon selesaikan CAPTCHA terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            navigate('/dashboard'); // Direct to dashboard on success
          },
          onError: (ctx) => {
            setError(ctx.error.message || 'Login gagal. Periksa kembali kredensial Anda.');
            setLoading(false);
          }
        }
      });
    } catch (err: any) {
      setError('Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] p-4 text-[#1A1A1A] font-body selection:bg-[#FFD600] selection:text-[#1A1A1A]">
      <div className="max-w-md w-full bg-[#1A1A1A] p-[3px] shadow-[8px_8px_0px_0px_#1A1A1A]">
        {/* Card Header */}
        <div className="bg-[#FFD600] border-b-[3px] border-[#1A1A1A] p-4 flex items-center gap-3">
          <div className="w-4 h-4 bg-[#1A1A1A] animate-pulse"></div>
          <h1 className="font-mono font-black text-2xl tracking-tight uppercase m-0">ASETI-TIK</h1>
        </div>

        {/* Card Content */}
        <div className="bg-white p-8">
          <div className="mb-6 border-l-4 border-[#1A1A1A] pl-4">
            <h2 className="font-bold text-xl uppercase tracking-tight">Otentikasi Sistem</h2>
            <p className="text-sm font-mono text-gray-600 uppercase mt-1">
              MASUK KE DASHBOARD MULTI-ASET
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border-[3px] border-red-500 font-mono text-sm text-red-700 uppercase font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Alamat Email Akses"
              type="email"
              placeholder="admin@aseti-tik.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Kata Sandi / Kunci Akses"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!captchaPassed ? (
              <SequenceCaptcha onSuccess={() => setCaptchaPassed(true)} sequenceLength={3} />
            ) : (
              <div className="w-full text-center p-3 bg-[#34C759] border-[3px] border-[#1A1A1A] font-mono text-sm uppercase font-bold text-[#1A1A1A]">
                TERVERIFIKASI ✓
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg shadow-[6px_6px_0px_0px_#1A1A1A] active:shadow-none"
              disabled={loading || !captchaPassed}
            >
              {loading ? 'MEMPROSES...' : 'OTORISASI MASUK'}
            </Button>
          </form>
        </div>
        
        {/* Footer info */}
        <div className="bg-[#F5F0E8] border-t-[3px] border-[#1A1A1A] p-2 text-center">
            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">
               Strictly For Authorized Personnel Only
            </span>
        </div>
      </div>
    </div>
  );
}
