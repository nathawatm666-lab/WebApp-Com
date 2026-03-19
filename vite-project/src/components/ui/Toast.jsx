import useToastStore from '../../store/toastStore';

export default function Toast() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    const typeStyles = {
        success: 'bg-green-600 border-green-500',
        error: 'bg-red-600 border-red-500',
        info: 'bg-blue-600 border-blue-500',
        warning: 'bg-yellow-600 border-yellow-500',
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${typeStyles[toast.type] || typeStyles.success} border text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[280px] animate-[slideIn_0.3s_ease] backdrop-blur-sm`}
                >
                    <span className="text-lg">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'info' && 'ℹ️'}
                        {toast.type === 'warning' && '⚠️'}
                    </span>
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white/70 hover:text-white text-lg leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
