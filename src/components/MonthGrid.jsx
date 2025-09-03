import WeekDays from "./WeekDays";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(str) {
  const [day, month, year] = str.split("/").map(Number);
  return { day, month: month - 1, year };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function MonthGrid({
  year,
  month,
  journalEntries,
  innerRef,
  onEntryClick,
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthEntries = journalEntries.filter((entry) => {
    const d = parseDate(entry.date);
    return d.year === year && d.month === month;
  });

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`blank-${i}`} className="h-20 border bg-gray-100" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const entriesToday = monthEntries.filter(
      (e) => parseDate(e.date).day === d
    );
    cells.push(
      <div key={d} className="h-20 border  bg-white text-xs overflow-hidden">
        <div className="font-semibold text-center">{d}</div>
        {entriesToday.map((e, idx) => (
          <div
            key={idx}
            className="truncate cursor-pointer text-blue-600 hover:underline"
            onClick={() => onEntryClick(e)}
          >
            {e.categories[0]} ⭐{e.rating}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={innerRef}
      data-key={`${year}-${month}`}
      className="p-4 border-b border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-2">
        {monthNames[month]} {year}
      </h2>
      <WeekDays />
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  );
}
