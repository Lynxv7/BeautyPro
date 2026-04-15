import Link from "next/link";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Scissors,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Agendamentos online",
    description:
      "Visualize e gerencie todos os seus horários em um só lugar, sem papel e sem confusão.",
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    description:
      "Histórico completo de cada cliente, contato, preferências e anotações.",
  },
  {
    icon: Scissors,
    title: "Catálogo de serviços",
    description:
      "Cadastre serviços com preço e duração. Tudo calculado automaticamente.",
  },
  {
    icon: TrendingUp,
    title: "Faturamento em tempo real",
    description:
      "Acompanhe o quanto você faturou hoje, essa semana ou este mês.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ana Lima",
    role: "Proprietária — Studio Ana Lima",
    text: "Desde que comecei a usar o BeautyPro, nunca mais perdi um agendamento. É simples e funciona perfeitinho!",
    stars: 5,
  },
  {
    name: "Fernanda Costa",
    role: "Esteticista autônoma",
    text: "Organizar clientes e serviços ficou muito mais fácil. Recomendo para todo salão!",
    stars: 5,
  },
  {
    name: "Juliana Melo",
    role: "Cabeleireira — Salão Juliana",
    text: "O painel de faturamento me ajudou a ver onde estava perdendo dinheiro. Incrível!",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAV */}
      <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold gradient-text">BeautyPro</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Criar conta grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 gap-6 bg-linear-to-b from-rose-50 to-background">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
          ✨ Sistema completo para salões e estúdios
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Gerencie seu salão <span className="gradient-text">sem estresse</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl">
          Agendamentos, clientes e faturamento organizados em um sistema
          simples, moderno e feito para profissionais da beleza.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/login">
            <Button size="lg" className="min-w-44 text-base">
              Começar agora — grátis
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="min-w-44 text-base">
              Já tenho conta
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
          {[
            "Sem cartão de crédito",
            "Configuração em minutos",
            "Suporte em português",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Do agendamento ao pagamento, o BeautyPro cobre todo o fluxo do seu
              negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              O que dizem nossos clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-6 space-y-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Pronto para transformar seu salão?
          </h2>
          <p className="text-muted-foreground">
            Crie sua conta gratuitamente e comece a usar em minutos.
          </p>
          <Link href="/login">
            <Button size="lg" className="min-w-52 text-base">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-6 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BeautyPro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
