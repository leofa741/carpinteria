'use client';

import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    asunto: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[+][0-9]{1,3}[-\s]?[0-9]{6,12}$/; // Formato básico de número internacional
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    if (form.name === '' || form.email === '' || form.message === '') {
      setStatus('Por favor, complete todos los campos requeridos.');
      setLoading(false);
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setStatus('Por favor, ingresa un número de teléfono válido.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('Mensaje enviado con éxito.');
        setForm({ name: '', email: '', phone: '', asunto: '', message: '' });
      } else {
        setStatus(data.message || 'Hubo un error al enviar el mensaje.');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setStatus('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-16">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800">
          ¿Tienes alguna consulta?
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            id="name"
            placeholder="Nombre completo*"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico*"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
            required
          />
          <input
            type="tel"
            id="phone"
            placeholder="Teléfono (+54115555-5555) (opcional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          <input
            type="text"
            id="asunto"
            placeholder="Asunto (opcional)"
            value={form.asunto}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          <textarea
            id="message"
            rows={4}
            placeholder="Escribe tu mensaje*"
            value={form.message}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition md:col-span-2"
            required
          ></textarea>
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 text-gray-800 font-semibold py-3 px-8 rounded-sm hover:bg-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar Mensaje'
              )}
            </button>
          </div>
        </form>
        {status && (
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                status.includes('éxito') ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
