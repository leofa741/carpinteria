'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import { RingLoader } from 'react-spinners';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState<string>('');
  const [captchaSolution, setCaptchaSolution] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/trabajos-realizados';
  const { data: session } = useSession();

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaSolution(num1 + num2);
  };

  const isValidForm = (): boolean =>
    email.trim() !== '' &&
    password.length >= 6 &&
    /\S+@\S+\.\S+/.test(email) &&
    Number(captchaAnswer) === captchaSolution;

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidForm()) {
      setError('Por favor, ingresa un correo válido, una contraseña válida y resuelve el captcha.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (session?.user?.token) {
      localStorage.setItem('token', session.user.token);
    }

    if (res?.ok) {
      toast.success('¡Inicio de sesión exitoso!', {
        position: 'top-right',
        autoClose: 3000,
      });
      router.push(callbackUrl);
    } else {
      toast.error('Correo o contraseña incorrectos.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl });
      toast.success('¡Inicio de sesión exitoso con Google!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error al iniciar sesión con Google', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/img/f_avicon_1.png"
            alt="Logo"
            width={50}
            height={80}
            priority
            className="h-12"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-yellow-400 mb-6 text-center">
          Iniciar sesión en tu cuenta
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-yellow-100 font-semibold py-3 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowPathIcon className="h-6 w-6 text-red-500" />
          Iniciar Sesión con Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
          <span className="mx-4 text-gray-600 dark:text-gray-400">O</span>
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-yellow-200 font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-yellow-200 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-red-500 text-sm mt-1">La contraseña debe tener al menos 6 caracteres.</p>
            )}
          </div>

          <div>
            <label className="block text-yellow-700 dark:text-yellow-300 font-semibold mb-2">Verificación Humana</label>
            <div className="flex items-center gap-2">
              <span className="text-lg text-yellow-700 dark:text-yellow-300 font-bold">{captchaQuestion}</span>
              <input
                type="text"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="Respuesta"
                className="w-40 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            {loading ? (
              <RingLoader size={50} color="#F59E0B" loading={loading} />
            ) : (
              <button
                type="submit"
                className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-sm hover:bg-yellow-600 transition-all shadow hover:shadow-md cursor-pointer"
                disabled={loading || !isValidForm()}
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
            ¿Olvidaste tu contraseña?{' '}
            <a href="/reset-password" className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
              Recuperar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}