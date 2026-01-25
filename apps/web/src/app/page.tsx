"use client";

import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  Menu,
  Moon,
  Sun
} from "lucide-react";
import { useState } from 'react';
import { NexuLogo } from '../components/nexu-logo';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function ExamplePage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar */}
        <nav className="border-b border-nexu bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <NexuLogo variant="wordmark" theme={darkMode ? "dark" : "light"} />
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <BarChart3 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="outline" className="hidden md:flex">
                  Dashboard
                </Button>
                <Button>Começar</Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="border-b border-nexu">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="mb-6">
                <NexuLogo 
                  variant="with-slogan" 
                  theme={darkMode ? "dark" : "light"}
                  className="mb-8" 
                />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold text-nexu-primary dark:text-white mb-6 leading-tight">
                Controle operacional inteligente para sua última milha
              </h1>
              
              <p className="text-lg text-nexu-secondary dark:text-gray-300 mb-8 leading-relaxed">
                Organize pedidos, otimize rotas e gerencie entregas com a precisão 
                que seu negócio precisa. Sem complicação, só inteligência.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg">
                  Começar agora
                </Button>
                <Button variant="outline" size="lg">
                  Ver demonstração
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-nexu bg-card">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10k+", label: "Pedidos/dia" },
                { value: "98%", label: "Taxa de entrega" },
                { value: "15min", label: "Tempo médio" },
                { value: "500+", label: "Clientes ativos" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-semibold text-nexu-primary dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-nexu-secondary dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-nexu-primary dark:text-white mb-4">
                Funcionalidades principais
              </h2>
              <p className="text-nexu-secondary dark:text-gray-300 max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar suas operações de forma eficiente
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Package,
                  title: "Gestão de Pedidos",
                  description: "Acompanhe cada pedido em tempo real com visualização clara e organizada."
                },
                {
                  icon: TrendingUp,
                  title: "Otimização de Rotas",
                  description: "Algoritmos inteligentes para reduzir tempo e custo de entrega."
                },
                {
                  icon: Clock,
                  title: "Rastreamento em Tempo Real",
                  description: "Monitore entregas ao vivo com atualizações instantâneas."
                },
                {
                  icon: CheckCircle2,
                  title: "Confirmação Automática",
                  description: "Notificações automáticas para clientes em cada etapa."
                },
                {
                  icon: BarChart3,
                  title: "Relatórios Detalhados",
                  description: "Análises completas de desempenho e métricas operacionais."
                },
                {
                  icon: Package,
                  title: "Integração Simples",
                  description: "API moderna para conectar com seus sistemas existentes."
                }
              ].map((feature, i) => (
                <Card key={i} className="hover:shadow-nexu transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-nexu-secondary dark:text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-nexu bg-card">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-semibold mb-4">
                    Pronto para começar?
                  </h2>
                  <p className="text-lg mb-6 opacity-90">
                    Teste gratuitamente por 14 dias. Sem cartão de crédito necessário.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-nexu-graphite hover:bg-gray-100"
                    >
                      Criar conta grátis
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Falar com vendas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-nexu bg-card py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <NexuLogo variant="wordmark" theme={darkMode ? "dark" : "light"} />
                <p className="text-sm text-nexu-secondary dark:text-gray-400 mt-4">
                  A inteligência por trás de cada pedido.
                </p>
              </div>
              
              {[
                {
                  title: "Produto",
                  links: ["Funcionalidades", "Preços", "Integrações", "API"]
                },
                {
                  title: "Empresa",
                  links: ["Sobre", "Blog", "Carreiras", "Contato"]
                },
                {
                  title: "Legal",
                  links: ["Privacidade", "Termos", "Cookies"]
                }
              ].map((section, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-4 text-nexu-primary dark:text-white">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, j) => (
                      <li key={j}>
                        <a 
                          href="#" 
                          className="text-sm text-nexu-secondary dark:text-gray-400 hover:text-primary transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-nexu pt-8 text-center text-sm text-nexu-secondary dark:text-gray-400">
              © 2026 Nexu. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}