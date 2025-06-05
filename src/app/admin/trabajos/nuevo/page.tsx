import TrabajoForm from '@/app/components/trabajosform/TrabajoForm';

export default function CrearTrabajoPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo Trabajo</h1>
      <TrabajoForm />
    </main>
  );
}
