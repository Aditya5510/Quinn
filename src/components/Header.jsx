import { ArrowBigLeft, ClockArrowDown } from "lucide-react";

export default function Header({ currentMonthLabel }) {
  const [month, year] = currentMonthLabel.split(" ");

  return (
    <div className="sticky top-0 bg-white text-slate-800 shadow-lg z-20 border-b border-green-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
            <ArrowBigLeft className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold">
            <span className="text-slate-800">{month}</span>
            <span className="text-green-600 ml-2">{year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
