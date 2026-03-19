import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const banners = [
    {
        id: 1,
        title: 'RTX 4090 SUPER PRE-ORDER',
        subtitle: 'SECURE YOUR ALLOCATION. MAXIMUM PERFORMANCE.',
        cta: 'INITIALIZE PURCHASE',
        link: '/product/nvidia-geforce-rtx-4090',
        label: 'SYS.ACTIVE.01',
    },
    {
        id: 2,
        title: 'CUSTOM RIGS [GEN.4]',
        subtitle: 'I9 + 64GB DDR5. ENGINEERED FOR SUPREMACY.',
        cta: 'CONFIGURE BUILD',
        link: '/category/cpu',
        label: 'SYS.ACTIVE.02',
    },
    {
        id: 3,
        title: 'NVME STORAGE PRO',
        subtitle: '7,450 MB/S BANDWIDTH. NO COMPROMISE.',
        cta: 'ACCESS INVENTORY',
        link: '/category/storage',
        label: 'SYS.ACTIVE.03',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((c) => (c + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const banner = banners[current];

    return (
        <div className="relative border-y border-dark-border bg-dark-card overflow-hidden transition-all duration-1000 my-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
                
                {/* Visual Accent Column */}
                <div className="hidden lg:flex col-span-1 border-r border-dark-border flex-col justify-between items-center py-8">
                    <span className="text-gray-600 text-[10px] uppercase font-mono tracking-widest -rotate-90 whitespace-nowrap">
                        TECHHUB // OPERATION MANUAL
                    </span>
                    <div className="flex flex-col gap-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-1 transition-all duration-500 ease-out cursor-pointer ${i === current ? 'bg-accent h-12' : 'bg-dark-border h-4 hover:bg-gray-500'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-1 lg:col-span-7 px-6 py-16 md:py-24 md:px-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)]">
                        <span className="w-2 h-2 bg-accent animate-pulse"></span>
                        <p className="text-accent text-xs font-mono font-bold uppercase tracking-[0.2em]">
                            {banner.label}
                        </p>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-tighter leading-[0.9] animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
                        {banner.title}
                    </h1>
                    
                    <p className="text-gray-400 font-mono text-sm md:text-base mb-10 max-w-xl animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.2s_both] leading-relaxed">
                        // {banner.subtitle}
                    </p>
                    
                    <div className="animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
                        <Link
                            to={banner.link}
                            className="inline-flex items-center gap-4 bg-transparent border border-accent hover:bg-accent text-white font-mono text-sm font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 group"
                        >
                            {banner.cta}
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Decorative Tech Graphic */}
                <div className="col-span-1 lg:col-span-4 border-l border-dark-border bg-dark-lighter relative overflow-hidden hidden md:block opacity-60">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-dark-card)_0%,transparent_100%)] opacity-50 z-10"></div>
                    <div className="w-full h-full p-8 flex flex-col justify-end relative z-20">
                        <div className="border border-dark-border p-4 mb-4">
                            <p className="font-mono text-[10px] text-gray-500 tracking-widest">
                                DIAGNOSTIC: OK<br/>
                                LATENCY: 12MS<br/>
                                CAPACITY: 99.9%
                            </p>
                        </div>
                        <div className="h-64 border border-dark-border relative group">
                            {/* Abstract scanlines and blocks representing tech UI */}
                            <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-dark-border"></div>
                            <div className="absolute bottom-4 left-4 w-3/4 h-1 bg-accent/30 group-hover:bg-accent/80 transition-colors"></div>
                            <div className="absolute bottom-6 left-4 w-1/2 h-1 bg-gray-600/30"></div>
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-accent/20 rounded-full flex items-center justify-center">
                                <div className="w-16 h-16 border border-accent/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Mobile Indicator */}
            <div className="lg:hidden absolute bottom-0 left-0 w-full h-1 flex">
                {banners.map((_, i) => (
                    <div key={i} className={`flex-1 transition-colors duration-500 ease-out ${i === current ? 'bg-accent' : 'bg-dark-border'}`}></div>
                ))}
            </div>
        </div>
    );
}
