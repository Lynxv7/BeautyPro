import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-zinc-900 to-zinc-700 text-white p-10">
        <div className="text-xl font-bold">✂️ BeautyPro</div>

        <div>
          <h1 className="text-3xl font-bold">
            Gerencie seu salão com facilidade
          </h1>
          <p className="text-zinc-300 mt-2">
            Agendamentos, clientes e faturamento em um só lugar.
          </p>
        </div>

        <p className="text-sm text-zinc-400">© 2026</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
