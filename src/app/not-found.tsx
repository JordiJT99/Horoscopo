import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <div className="relative mb-8">
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-primary via-pink-400 to-purple-600 bg-clip-text text-transparent">
                    404
                </span>
                <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-br from-primary via-pink-400 to-purple-600 rounded-full" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                ✨ Página No Encontrada
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8">
                Parece que esta constelación no existe en nuestro mapa estelar.
                La página que buscas se ha perdido en el cosmos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/es/horoscopes/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
                >
                    🔮 Ver Horóscopos
                </Link>
                <Link
                    href="/es/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-card/50 text-foreground font-medium hover:bg-card/70 transition-colors min-h-[44px]"
                >
                    🏠 Ir al Inicio
                </Link>
            </div>

            <div className="mt-12 text-sm text-muted-foreground/60">
                <p>Si crees que esto es un error, contáctanos en la sección de <em>Más</em>.</p>
            </div>
        </main>
    );
}
