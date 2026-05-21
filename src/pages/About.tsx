import { HiExternalLink, HiCode, HiLightningBolt } from "react-icons/hi";

export default function About(): React.ReactElement {
    return (
        <div className="min-h-full bg-gray-50/50 dark:bg-gray-950/50 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="inline-flex items-center gap-4 text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                            <div className="relative w-16 h-16 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                                <img src="/logo.svg" alt="D2d Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">D2d</span>
                        </h1>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                            <HiLightningBolt className="w-4 h-4" />
                            <span className="tracking-wide">VERSION 0.1.0 ALPHA</span>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-medium">
                            A professional-grade data conversion toolkit built for modern developer workflows.
                            Simplify complex data transformations with precision and speed.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                    {/* Open Source - 2/5 columns */}
                    <div className="lg:col-span-3 p-10 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                                <HiCode className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Open Source</h2>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">License Information</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">MIT License</p>
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black">ACTIVE</span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                D2d is built by the community, for the community. We believe in open tools that empower developers.
                            </p>
                        </div>

                        <a
                            href="https://github.com/inowio/D2d"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/5"
                        >
                            <HiCode className="w-6 h-6" />
                            <span>SOURCE ON GITHUB</span>
                            <HiExternalLink className="w-4 h-4 opacity-50" />
                        </a>
                    </div>

                    {/* Developer Card - 3/5 columns */}
                    <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-linear-to-br from-blue-700 to-indigo-900 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
                        {/* Abstract background graphics */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                    <img
                                        src="/inowio-logo.svg"
                                        alt="Inowio Logo"
                                        className={`h-10 w-auto`}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-black tracking-wide">Inowio Technologies</h3>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] opacity-80">From Bits to Machines</p>
                                </div>
                            </div>

                            <h4 className="text-3xl font-bold mb-6 leading-tight max-w-md">
                                Empowering developers with <span className="text-blue-300">minimalist</span> and <span className="text-blue-300">powerful</span> tools.
                            </h4>

                            <p className="text-blue-50/80 text-lg leading-relaxed mb-10 max-w-xl">
                                We are an industrial product manufacturer dedicated to building precision hardware and engineering solutions.
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                            <a
                                href="https://inowio.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                inowio.in
                                <HiExternalLink className="w-5 h-5 opacity-70" />
                            </a>

                            <div className="hidden sm:flex items-center gap-3 text-blue-200/50">
                                <span className="text-xs font-bold tracking-widest uppercase">Est. 2021</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
