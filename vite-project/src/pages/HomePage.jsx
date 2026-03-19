import { useEffect, useState } from 'react';
import { getBrands } from '../services/api';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSale from '../components/home/FlashSale';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PrebuiltPCsSection from '../components/home/PrebuiltPCsSection';

export default function HomePage() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        getBrands().then(r => setBrands(r.data)).catch(() => { });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <HeroBanner />
            <CategoryGrid />
            <FlashSale />
            <PrebuiltPCsSection />
            <FeaturedProducts />


        </div>
    );
}
