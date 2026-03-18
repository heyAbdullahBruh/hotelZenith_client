export default function Loading() {
  return (
    <div className="fixed inset-0 bg-secondary-50 z-100 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Pulsing Circle */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="mt-8 font-display font-bold text-xl tracking-widest text-secondary-900 animate-pulse">
          HOTEL<span className="text-primary-600">ZENITH</span>
        </div>
      </div>
    </div>
  );
}
