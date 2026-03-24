/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Gift,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 15,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft.seconds > 0) {
        setTimeLeft({ ...timeLeft, seconds: timeLeft.seconds - 1 });
      } else if (timeLeft.minutes > 0) {
        setTimeLeft({ minutes: timeLeft.minutes - 1, seconds: 59 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-emerald-600 text-white py-2 px-4 text-center sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <p className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4 animate-pulse fill-white" />
          Oferta de Lançamento: R$ 37 termina em:
        </p>
        <div className="flex items-center gap-1 font-mono text-lg font-black">
          <div className="bg-white/20 px-2 py-0.5 rounded">{formatNumber(timeLeft.minutes)}</div>
          <span>:</span>
          <div className="bg-white/20 px-2 py-0.5 rounded">{formatNumber(timeLeft.seconds)}</div>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 mb-4 hover:shadow-md transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-bold text-slate-800 hover:text-primary transition-colors"
      >
        <span className="pr-8">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-primary shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-100 mt-4">
              <p className="text-slate-600 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  useEffect(() => {
    // Conversions API (Server-side) PageView
    const trackPageView = async () => {
      try {
        await fetch('/api/fb-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'PageView',
            userData: {},
            customData: {}
          })
        });
      } catch (error) {
        console.error('Failed to send Conversions API PageView:', error);
      }
    };
    trackPageView();

    const data: any = {};

    // Get general body styles
    data.bodyStyles = {
      fontFamily: window.getComputedStyle(document.body).getPropertyValue('font-family'),
      fontSize: window.getComputedStyle(document.body).getPropertyValue('font-size'),
      color: window.getComputedStyle(document.body).getPropertyValue('color'),
      backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color'),
      lineHeight: window.getComputedStyle(document.body).getPropertyValue('line-height'),
    };

    // Get heading styles (h1, h2, h3) if they exist
    const headings: any = {};
    ['h1', 'h2', 'h3'].forEach(tag => {
      const el = document.querySelector(tag);
      if (el) {
        headings[tag] = {
          fontFamily: window.getComputedStyle(el).getPropertyValue('font-family'),
          fontSize: window.getComputedStyle(el).getPropertyValue('font-size'),
          color: window.getComputedStyle(el).getPropertyValue('color'),
          lineHeight: window.getComputedStyle(el).getPropertyValue('line-height'),
        };
      }
    });
    data.headingStyles = headings;

    // Get primary link color
    const a = document.querySelector('a');
    if (a) {
      data.linkColor = window.getComputedStyle(a).getPropertyValue('color');
    }

    // Get main container width if present
    const mainContainer = document.querySelector('.elementor-section-wrap, .elementor-container, main, #main'); // Common container selectors
    if (mainContainer) {
      data.mainContainerWidth = window.getComputedStyle(mainContainer).getPropertyValue('width');
      data.mainContainerPadding = window.getComputedStyle(mainContainer).getPropertyValue('padding');
      data.mainContainerMargin = window.getComputedStyle(mainContainer).getPropertyValue('margin');
    }

    // Check display property of body (though typically block)
    data.bodyDisplay = window.getComputedStyle(document.body).getPropertyValue('display');

    // Check for overall padding/margin on body
    data.bodyPadding = window.getComputedStyle(document.body).getPropertyValue('padding');
    data.bodyMargin = window.getComputedStyle(document.body).getPropertyValue('margin');

    // Get border-box sizing status
    data.boxSizing = window.getComputedStyle(document.documentElement).getPropertyValue('box-sizing');

    // Get any custom properties (CSS variables) that might define a color palette
    const rootStyles = window.getComputedStyle(document.documentElement);
    const customProperties: any = {};
    for (let i = 0; i < rootStyles.length; i++) {
      const propName = rootStyles[i];
      if (propName.startsWith('--')) {
        customProperties[propName] = rootStyles.getPropertyValue(propName);
      }
    }
    data.customProperties = customProperties;

    console.log('Computed Styles Data:', data);
  }, []);

  const scrollToOffer = () => {
    const element = document.getElementById('oferta');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = async () => {
    // Client-side Pixel
    // @ts-ignore
    if (typeof window.fbq !== 'undefined') {
      // @ts-ignore
      window.fbq('track', 'InitiateCheckout');
    }

    // Conversions API (Server-side)
    try {
      await fetch('/api/fb-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'InitiateCheckout',
          userData: {
            // Add more user data if available (e.g., email, phone)
          },
          customData: {
            value: 37.00,
            currency: 'BRL'
          }
        })
      });
    } catch (error) {
      console.error('Failed to send Conversions API event:', error);
    }

    window.location.href = 'https://pay.wiapy.com/o-touCprXt';
  };

  return (
    <div className="min-h-screen">
      <CountdownTimer />
      {/* 1. HERO SECTION */}
      <section className="bg-white pt-20 pb-40 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              <span>Método 100% Natural</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Plano alimentar completo para controlar a pressão alta de forma <span className="text-primary">natural e segura</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Descubra exatamente o que comer no dia a dia para reduzir e estabilizar sua pressão arterial — mesmo sem experiência com dieta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 relative">
              <button 
                onClick={handleCheckout}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group hover:-translate-y-1 relative z-10"
              >
                QUERO CONTROLAR MINHA PRESSÃO AGORA
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* Button Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl animate-pulse -z-10"></div>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <span>+1.500 pessoas já transformaram suas vidas</span>
            </div>
          </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative"
            >
            <div className="relative z-10">
              <img 
                src="https://i.ibb.co/fVWrDhJY/IMAGEM-DO-PRODUTO-Photoroom.webp" 
                alt="Mockup Protocolo Anti-Hipertensão" 
                className="w-full h-auto object-contain max-h-[600px] drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50 rounded-full -z-10 blur-3xl opacity-50"></div>
          </motion.div>
        </div>
        
        {/* Shape Divider Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-slate-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="opacity-30"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.94,9.41,102.17,19.61,39.28,12.83,78.56,19.61,116.48,21,38.73,1.41,76.42-9.33,108.46-23.93,33.89-15.46,67.07-30.91,101.68-43.61,33.43-12.27,67.11-19.11,101.66-21.93V0Z" className="opacity-50"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. O QUE VOCÊ VAI RECEBER */}
      <section className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">O Que Você Vai Encontrar No Protocolo</h2>
          <p className="text-slate-600">Um passo a passo completo, do básico ao avançado, para você nunca mais se sentir perdido.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "O Guia dos Alimentos",
              desc: "Saiba exatamente o que colocar no prato para baixar a pressão em poucos dias.",
              icon: <BookOpen className="h-6 w-6 text-primary" />
            },
            {
              title: "Dieta DASH Simplificada",
              desc: "A dieta nº 1 do mundo para hipertensos explicada de forma fácil e prática.",
              icon: <Zap className="h-6 w-6 text-primary" />
            },
            {
              title: "Substituições Inteligentes",
              desc: "Como comer o que você gosta fazendo trocas que salvam suas artérias.",
              icon: <CheckCircle2 className="h-6 w-6 text-primary" />
            },
            {
              title: "Controle do Sódio",
              desc: "O segredo para temperar sua comida com sabor sem usar o saleiro.",
              icon: <AlertCircle className="h-6 w-6 text-primary" />
            },
            {
              title: "Hábitos de Ouro",
              desc: "Pequenas mudanças no seu dia que geram grandes resultados na sua saúde.",
              icon: <Star className="h-6 w-6 text-primary" />
            },
            {
              title: "Lista de Compras",
              desc: "Um guia pronto para você levar ao supermercado e não errar mais.",
              icon: <Gift className="h-6 w-6 text-primary" />
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. POR QUE ESCOLHER ESTE PRODUTO */}
      <section className="py-32 px-4 bg-slate-900 text-white relative overflow-hidden">
        {/* Shape Divider Top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,14.29,1200,52.47V0Z" className="opacity-10"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.94,9.41,102.17,19.61,39.28,12.83,78.56,19.61,116.48,21,38.73,1.41,76.42-9.33,108.46-23.93,33.89-15.46,67.07-30.91,101.68-43.61,33.43-12.27,67.11-19.11,101.66-21.93V0Z" className="opacity-20"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <img 
              src="https://i.ibb.co/7x2qKtCX/IMAGEM-DO-PRODUTO.webp" 
              alt="Base Científica" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Por que o Protocolo Anti-Hipertensão é diferente?</h2>
            <div className="space-y-6">
              {[
                { title: "Baseado em Evidências", desc: "Nada de 'receitas milagrosas'. Todo o conteúdo é fundamentado na Dieta DASH, recomendada pelas maiores instituições de saúde do mundo." },
                { title: "Fácil de Seguir", desc: "Não exigimos que você coma coisas estranhas ou caras. Tudo o que você precisa está no mercado da esquina." },
                { title: "Foco em Resultados Reais", desc: "Nosso objetivo não é apenas informar, mas transformar. Você verá a diferença no seu aparelho de pressão." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shape Divider Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-emerald-50">
            <path d="M1200 120L0 120 309.19 8.1 1200 120z"></path>
          </svg>
        </div>
      </section>

      {/* 4. BÔNUS EXCLUSIVOS */}
      <section className="py-32 px-4 bg-emerald-50 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Presentes para você</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Bônus Exclusivos e Gratuitos</h2>
          <p className="text-slate-600">Comprando hoje, você leva esses 3 materiais complementares sem custo adicional.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "50 Receitas Cardioprotetoras", 
              value: "R$ 47,00", 
              desc: "Pratos deliciosos e rápidos que cuidam do seu coração.",
              img: "https://i.ibb.co/N2f5kSyp/bonus-1-50-receitas-Me-dia.png"
            },
            { 
              title: "Plano de Refeições 21 Dias", 
              value: "R$ 67,00", 
              desc: "Um calendário completo do que comer do café à janta.",
              img: "https://i.ibb.co/FLTZc4HR/bonus-2-21-dias-Me-dia.png"
            },
            { 
              title: "Checklist de Monitoramento", 
              value: "R$ 27,00", 
              desc: "A ferramenta ideal para você acompanhar sua evolução.",
              img: "https://i.ibb.co/HDVdDbDK/Bonus-3-check-list-de-acompanhamento-Me-dia.png"
            }
          ].map((bonus, idx) => (
            <div key={idx} className="bg-white p-0 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden group flex flex-col">
              <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-lg">GRÁTIS</div>
              <div className="h-80 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                <img 
                  src={bonus.img} 
                  alt={bonus.title} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{bonus.title}</h3>
                <p className="text-primary font-bold text-sm mb-4">Valor: <span className="line-through text-slate-400">{bonus.value}</span></p>
                <p className="text-slate-600 text-sm leading-relaxed">{bonus.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shape Divider Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-slate-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,14.29,1200,52.47V0Z" className="opacity-10"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* 5. OFERTA */}
      <section id="oferta" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
            <div className="grid lg:grid-cols-2">
              
              {/* Left Side: Product Image & Stack List */}
              <div className="p-8 md:p-12 lg:p-16 bg-slate-800/50">
                <div className="mb-8 text-center lg:text-left">
                  <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block border border-emerald-500/20">
                    O que você vai receber
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Tudo o que está incluso no seu acesso:</h2>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    { name: "Protocolo Anti-Hipertensão (Guia Principal)", price: "R$ 197,00" },
                    { name: "Bônus 1: 50 Receitas Cardioprotetoras", price: "R$ 47,00" },
                    { name: "Bônus 2: Plano de Refeições 21 Dias", price: "R$ 67,00" },
                    { name: "Bônus 3: Checklist de Monitoramento", price: "R$ 27,00" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span className="text-slate-200 font-medium text-sm md:text-base">{item.name}</span>
                      </div>
                      <span className="text-slate-500 text-xs font-mono line-through hidden sm:block">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <img 
                    src="https://i.ibb.co/fVWrDhJY/IMAGEM-DO-PRODUTO-Photoroom.webp" 
                    alt="Protocolo Anti-Hipertensão Stack" 
                    className="relative z-10 w-full max-w-[400px] mx-auto drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Right Side: Pricing & CTA */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                
                <div className="mb-8">
                  <p className="text-slate-400 uppercase tracking-tighter text-sm font-bold mb-1">Valor Total de tudo isso:</p>
                  <p className="text-2xl text-slate-500 line-through font-bold">R$ 338,00</p>
                </div>

                <div className="mb-10 relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg z-20 whitespace-nowrap">
                    Oferta de Lançamento (90% OFF)
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-lg font-medium">Por apenas</span>
                    <div className="flex items-start">
                      <span className="text-2xl font-bold text-emerald-500 mt-4 mr-1">R$</span>
                      <span className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none">37</span>
                    </div>
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Pagamento Único • Acesso Vitalício</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-6 rounded-2xl font-black text-xl md:text-2xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-95 mb-8 uppercase flex items-center justify-center gap-3"
                >
                  QUERO MEU ACESSO AGORA
                  <ArrowRight className="h-6 w-6" />
                </button>

                <div className="space-y-6 w-full">
                  <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Compra Segura
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                      <Zap className="h-4 w-4 text-emerald-500" />
                      Acesso Imediato
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      7 Dias de Garantia
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. DEPOIMENTOS */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Quem já seguiu, aprovou!</h2>
          <p className="text-slate-600">Veja o que nossos alunos estão dizendo sobre o método.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Ricardo Santos, 52 anos",
              text: "Minha pressão vivia em 16/10. Depois de 3 semanas seguindo o protocolo, estabilizou em 12/8. Meu médico ficou impressionado com a mudança na minha alimentação.",
              img: "https://picsum.photos/seed/ricardo/100/100"
            },
            {
              name: "Maria Oliveira, 45 anos",
              text: "Eu tinha muito medo de ter um AVC como meu pai. O guia me ensinou a comer bem sem passar vontade. Hoje me sinto muito mais leve e segura.",
              img: "https://picsum.photos/seed/maria/100/100"
            },
            {
              name: "João Pereira, 61 anos",
              text: "O melhor investimento que fiz na minha saúde. As receitas de bônus são deliciosas e o plano de 21 dias facilita muito a rotina. Recomendo a todos!",
              img: "https://picsum.photos/seed/joao/100/100"
            }
          ].map((dep, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 italic mb-6">"{dep.text}"</p>
              <div className="flex items-center gap-4">
                <img src={dep.img} alt={dep.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <p className="font-bold text-slate-900 text-sm">{dep.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-32 px-4 bg-slate-50 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Dúvidas Frequentes</h2>
            <p className="text-slate-600">Ainda tem alguma pergunta? Confira as respostas abaixo.</p>
          </div>
          <div className="space-y-4">
            <FAQItem 
              question="Como receberei o produto?" 
              answer="O acesso é 100% digital. Assim que sua compra for confirmada, você receberá um e-mail com os dados de acesso à nossa plataforma exclusiva." 
            />
            <FAQItem 
              question="Preciso comprar alimentos caros?" 
              answer="Não! O protocolo foca em alimentos comuns que você encontra em qualquer supermercado ou feira. O foco é na combinação estratégica dos alimentos." 
            />
            <FAQItem 
              question="Posso parar de tomar meus remédios?" 
              answer="NUNCA interrompa sua medicação sem autorização médica. O protocolo é um complemento alimentar para ajudar seu corpo a se regular naturalmente. Com o tempo, seu médico poderá ajustar sua dose baseada na sua melhora." 
            />
            <FAQItem 
              question="Por quanto tempo terei acesso?" 
              answer="O acesso é vitalício! Você pode ler e consultar o material quantas vezes quiser, para sempre." 
            />
            <FAQItem 
              question="E se eu não gostar do conteúdo?" 
              answer="Nós oferecemos uma garantia incondicional de 7 dias. Se você não ficar satisfeito por qualquer motivo, basta nos enviar um e-mail e devolvemos 100% do seu dinheiro." 
            />
          </div>
        </div>
      </section>

      {/* 8. GARANTIA */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div className="shrink-0">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" 
              alt="Garantia 7 Dias" 
              className="w-32 h-32 md:w-48 md:h-48"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Risco Zero: 7 Dias de Garantia</h2>
            <p className="text-slate-600 leading-relaxed">
              Eu confio tanto na eficácia do Protocolo Anti-Hipertensão que vou tirar todo o peso das suas costas. Você tem 7 dias para testar o método. Se não sentir diferença ou simplesmente achar que não é para você, eu devolvo cada centavo. Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>

        {/* Shape Divider Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Pronto para transformar sua saúde?</h2>
          <p className="text-slate-600 mb-10 text-lg">Junte-se a mais de 1.500 pessoas que já estão controlando a pressão de forma natural.</p>
          <button 
            onClick={handleCheckout}
            className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto group"
          >
            QUERO COMEÇAR AGORA POR APENAS R$ 37
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 9. RODAPÉ */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Protocolo Anti-Hipertensão</h3>
              <p className="text-sm leading-relaxed max-w-md">
                Nossa missão é ajudar pessoas a recuperarem sua saúde e vitalidade através de métodos naturais e cientificamente comprovados.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-bold text-white mb-4">Aviso Legal:</p>
              <p className="leading-relaxed">
                As informações contidas neste site e no protocolo não substituem o aconselhamento médico profissional. Sempre consulte seu médico antes de iniciar qualquer dieta ou programa de saúde. Os resultados podem variar de pessoa para pessoa.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Protocolo Anti-Hipertensão. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
