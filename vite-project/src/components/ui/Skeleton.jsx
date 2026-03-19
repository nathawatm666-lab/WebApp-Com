export default function Skeleton({ className = '', count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`animate-pulse bg-card rounded-xl ${className}`}>
                    <div className="aspect-square bg-border rounded-t-xl" />
                    <div className="p-3 space-y-2">
                        <div className="h-3 bg-border rounded w-1/3" />
                        <div className="h-4 bg-border rounded w-full" />
                        <div className="h-4 bg-border rounded w-2/3" />
                        <div className="h-5 bg-border rounded w-1/2 mt-2" />
                    </div>
                </div>
            ))}
        </>
    );
}
