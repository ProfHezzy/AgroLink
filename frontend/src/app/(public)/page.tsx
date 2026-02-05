import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Landing Page Component
 * Displays the Hero section with key value propositions and call to actions.
 * Designed with a focus on visual appeal and "Agro" aesthetics (Green, Earthy, Modern).
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
             <Image
              src="/images/hero.png"
              alt="AgroLink Hero - Sustainable Farming"
              fill
              className="object-cover brightness-[0.6]"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="text-sm font-medium tracking-wider uppercase">The Future of Agriculture</span>
            </div>
            
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-in fade-in zoom-in duration-1000 leading-tight">
            Connecting Farms, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Markets & Data.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-100 max-w-3xl mx-auto font-light leading-relaxed animate-in slide-in-from-bottom-5 duration-1000 delay-200">
            AgroLink is the unified ecosystem where farmers sell directly, buyers find quality, and researchers unlock real-time agricultural intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 animate-in slide-in-from-bottom-5 duration-1000 delay-300">
            <Link href="/marketplace">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-green-500/20 transition-all hover:scale-105">
                Start Trading
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-green-900 backdrop-blur-sm transition-all">
                Join the Network
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center p-1">
                <div className="w-1 h-2 bg-white rounded-full animate-scroll" />
            </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">Empowering the Agricultural Chain</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">
              We bridge the gap between production and consumption with technology that fosters transparency and growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Direct Market Access",
                description: "Farmers list produce instantly. Buyers purchase directly. No hidden fees or exploitative middlemen.",
                icon: "🌾",
                gradient: "from-amber-200 to-yellow-400"
              },
              {
                title: "Data-Driven Insights",
                description: "Researchers and economists access anonymized, real-time market data to predict trends and guide policy.",
                icon: "📈",
                gradient: "from-blue-200 to-indigo-400"
              },
              {
                title: "Community & Trust",
                description: "Verified profiles, transparent reviews, and a dedicated forum for agricultural knowledge sharing.",
                icon: "🛡️",
                gradient: "from-green-200 to-emerald-400"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
