import { X, Star, Calendar, Tag, MessageSquare } from "lucide-react";

export default function JournalModal({
  entries,
  activeIndex,
  onClose,
  setActiveIndex,
}) {
  const entry = entries[activeIndex];
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        setActiveIndex((i) => Math.min(i + 1, entries.length - 1));
      } else {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          <img
            src={entry.imgUrl}
            alt="Journal entry"
            className="w-full h-80 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-6 h-6 text-slate-700 cursor-pointer" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <span className="text-xl font-bold">{entry.date}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{entry.rating}</span>
                <span className="text-white/90">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {entry.categories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-2 rounded-full font-medium border border-green-200"
              >
                <Tag className="w-3.5 h-3.5" />
                {cat}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-slate-800">Notes</h3>
            </div>
            <p className="text-slate-700 leading-relaxed pl-8 text-base">
              {entry.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
