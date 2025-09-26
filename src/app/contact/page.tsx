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
    const phoneRegex = /^[+][0-9]{1,3}[-\s]?[0-9]{6,12}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setStatus('Por favor, ingresa un número de teléfono válido (ej: +54 11 5555-5555).');
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
        setStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        setForm({ name: '', email: '', phone: '', asunto: '', message: '' });
      } else {
        setStatus(data.message || 'Hubo un error al enviar el mensaje. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setStatus('Error de conexión. Por favor, verifica tu red e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          ¿Tienes alguna consulta?
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            id="name"
            placeholder="Nombre completo*"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition"
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico*"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition"
            required
          />
          <input
            type="tel"
            id="phone"
            placeholder="Teléfono (ej: +54 11 5555-5555) (opcional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition"
          />
          <input
            type="text"
            id="asunto"
            placeholder="Asunto (opcional)"
            value={form.asunto}
            onChange={handleChange}
            className="w-full p-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition"
          />
          <textarea
            id="message"
            rows={5}
            placeholder="Escribe tu mensaje*"
            value={form.message}
            onChange={handleChange}
            className="w-full p-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition md:col-span-2"
            required
          ></textarea>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-8 text-center">
            <p
              className={`text-sm font-medium ${
                status.includes('éxito') || status.includes('Éxito')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
    <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
  ¿Prefieres hablar directamente? Escríbenos al{' '}
  <a href="https://wa.me/+54 294 441-2756" className="text-amber-600 dark:text-amber-400 hover:underline">
    +54 294 441-2756 (WhatsApp)
  </a>
</p>
    </>
  );
}