'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RingLoader } from 'react-spinners'; // Agrega el spinner de carga

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const router = useRouter();

  // Validación básica de campos
  const isValidForm = () => email && password.length >= 6 && /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isValidForm()) {
      setError('Por favor, ingresa un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const response = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    setLoading(false);
  
    if (response.ok) {
      toast.success('¡Registro exitoso! Redirigiendo...', { theme: 'colored' });
      router.push('/login');
    } else {
      toast.error(data.message || 'Error al registrar usuario', { theme: 'colored' });
      setError(data.message || 'Error al registrar el usuario.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-brown-900 mb-6 text-center">Registrarse</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-brown-700 font-semibold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full p-3 rounded-lg border border-black focus:outline-none focus:border-yellow-500 transition duration-300"
              required
            />
          </div>
          <div>
  <label htmlFor="password" className="block text-brown-700 font-semibold mb-2">
    Contraseña
  </label>
  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Mínimo 6 caracteres"
    className="w-full p-3 rounded-lg border border-black  focus:outline-none focus:border-yellow-500 transition duration-300"
    required
  />
  {password.length > 0 && password.length < 6 && (
    <p className="text-red-500 text-sm mt-1">La contraseña debe tener al menos 6 caracteres.</p>
  )}
</div>

          <div className="flex justify-center">
            {loading ? (
              <RingLoader size={50} color="#F59E0B" loading={loading} /> // Mostrar el spinner mientras se registra
            ) : (
              <button
                type="submit"
                className="w-full  bg-black text-white font-semibold py-3 rounded-lg hover:bg-yellow-500 transition duration-300 shadow-md hover:shadow-lg" 
                disabled={loading || !isValidForm()} // Deshabilitar botón si no es válido o está cargando
              >
                Registrarse
              </button>
            )}
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-brown-700">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-yellow-500 hover:text-yellow-600 font-semibold">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
