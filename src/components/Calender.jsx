import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import JournalModal from "./JournalModal";
import { journalEntries } from "../data/journalEntries";

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

const monthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getNextDate({ day, month, year }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  if (day < daysInMonth) return { day: day + 1, month, year };
  if (month < 11) return { day: 1, month: month + 1, year };
  return { day: 1, month: 0, year: year + 1 };
}

function getPrevDate({ day, month, year }) {
  if (day > 1) return { day: day - 1, month, year };
  if (month > 0) {
    const prevMonth = month - 1;
    const daysInPrev = new Date(year, prevMonth + 1, 0).getDate();
    return { day: daysInPrev, month: prevMonth, year };
  }
  const daysInDec = new Date(year, 12, 0).getDate();
  return { day: daysInDec, month: 11, year: year - 1 };
}

function DayCell({ date, entries, onClick }) {
  const isFirstOfMonth = date.day === 1;
  const label = isFirstOfMonth
    ? `1 ${monthAbbreviations[date.month]}`
    : date.day;

  const todayEntries = entries.filter((e) => {
    const [d, m, y] = e.date.split("/").map(Number);
    return d === date.day && m - 1 === date.month && y === date.year;
  });

  const hasEntries = todayEntries.length > 0;
  const firstEntry = todayEntries[0];

  return (
    <div className="h-28 border border-green-200 p-1 bg-white text-xs overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="text-center mb-1">
        {isFirstOfMonth ? (
          <div>
            <span className="text-green-600 font-bold text-sm">1</span>
            <span className="text-slate-800 font-semibold text-xs ml-1">
              {monthAbbreviations[date.month]}
            </span>
          </div>
        ) : (
          <span className="text-slate-700 font-medium">{label}</span>
        )}
      </div>

      {hasEntries ? (
        <div className="space-y-1">
          {firstEntry && (
            <div
              className="cursor-pointer group"
              onClick={() => onClick(firstEntry)}
            >
              <div className="relative w-full h-20 rounded overflow-hidden">
                <img
                  src={firstEntry.imgUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              {todayEntries.length > 1 && (
                <div className="text-center text-green-600 text-xs mt-1 font-medium">
                  +{todayEntries.length - 1} more
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-slate-400 text-center mt-2 font-normal">-</div>
      )}
    </div>
  );
}

export default function Calendar() {
  const today = new Date();
  const start = {
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  };

  const [visibleDays, setVisibleDays] = useState(() => {
    const savedState = localStorage.getItem("calendarState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (
          parsed.currentMonth !== undefined &&
          parsed.currentYear !== undefined
        ) {
          const savedDate = {
            day: 1,
            month: parsed.currentMonth,
            year: parsed.currentYear,
          };
          const days = [savedDate];
          for (let i = 0; i < 30; i++) days.unshift(getPrevDate(days[0]));
          for (let i = 0; i < 30; i++)
            days.push(getNextDate(days[days.length - 1]));
          return days;
        }
      } catch (e) {
        console.warn("Failed to parse saved calendar state");
      }
    }

    const days = [start];
    for (let i = 0; i < 30; i++) days.unshift(getPrevDate(days[0]));
    for (let i = 0; i < 30; i++) days.push(getNextDate(days[days.length - 1]));
    return days;
  });

  const [currentMonthLabel, setCurrentMonthLabel] = useState(() => {
    const savedState = localStorage.getItem("calendarState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (
          parsed.currentMonth !== undefined &&
          parsed.currentYear !== undefined
        ) {
          return `${monthNames[parsed.currentMonth]} ${parsed.currentYear}`;
        }
      } catch (e) {
        console.warn("Failed to parse saved calendar state");
      }
    }
    return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  });

  const [activeIndex, setActiveIndex] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const savedState = localStorage.getItem("calendarState");
    if (savedState && containerRef.current) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.scrollTop !== undefined) {
          setTimeout(() => {
            containerRef.current.scrollTop = parsed.scrollTop;
          }, 100);
        }
      } catch (e) {
        console.warn("Failed to parse saved scroll position");
      }
    }
  }, []);

  useEffect(() => {
    const saveState = () => {
      if (containerRef.current) {
        const parts = currentMonthLabel.split(" ");
        const monthIndex = monthNames.indexOf(parts[0]);
        const currentYear = parseInt(parts[1]);
        const scrollTop = containerRef.current.scrollTop;

        if (monthIndex !== -1 && !isNaN(currentYear)) {
          localStorage.setItem(
            "calendarState",
            JSON.stringify({
              currentMonth: monthIndex,
              currentYear,
              scrollTop,
            })
          );
        }
      }
    };

    const timeoutId = setTimeout(saveState, 100);
    return () => clearTimeout(timeoutId);
  }, [currentMonthLabel]);

  useEffect(() => {
    const container = containerRef.current;
    const options = { root: container, rootMargin: "300px", threshold: 0 };

    const firstObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleDays((prev) => {
          const firstEl = container.querySelector("[data-first]");
          const prevHeight = firstEl?.offsetHeight || 0;

          const newDays = [];
          let d = prev[0];
          for (let i = 0; i < 30; i++) {
            d = getPrevDate(d);
            newDays.unshift(d);
          }

          const updated = [...newDays, ...prev];

          setTimeout(() => {
            container.scrollTop += prevHeight * 30;
          }, 0);

          return updated;
        });
      }
    }, options);

    const lastObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleDays((prev) => {
          const newDays = [];
          let d = prev[prev.length - 1];
          for (let i = 0; i < 30; i++) {
            d = getNextDate(d);
            newDays.push(d);
          }
          return [...prev, ...newDays];
        });
      }
    }, options);

    const firstEl = container.querySelector("[data-first]");
    const lastEl = container.querySelector("[data-last]");
    if (firstEl) firstObserver.observe(firstEl);
    if (lastEl) lastObserver.observe(lastEl);

    return () => {
      if (firstEl) firstObserver.unobserve(firstEl);
      if (lastEl) lastObserver.unobserve(lastEl);
    };
  }, [visibleDays]);

  useEffect(() => {
    const handleScroll = () => {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      let closest = null;
      let closestDist = Infinity;

      containerRef.current.querySelectorAll("[data-date]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - containerTop);
        if (dist < closestDist) {
          closestDist = dist;
          closest = el.dataset.date;
        }
      });

      if (closest) {
        const [d, m, y] = closest.split("-");
        setCurrentMonthLabel(`${monthNames[parseInt(m)]} ${y}`);
      }

      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const parts = currentMonthLabel.split(" ");
        const monthIndex = monthNames.indexOf(parts[0]);
        const currentYear = parseInt(parts[1]);

        if (monthIndex !== -1 && !isNaN(currentYear)) {
          localStorage.setItem(
            "calendarState",
            JSON.stringify({
              currentMonth: monthIndex,
              currentYear,
              scrollTop,
            })
          );
        }
      }
    };

    const c = containerRef.current;
    c.addEventListener("scroll", handleScroll);
    return () => c.removeEventListener("scroll", handleScroll);
  }, [visibleDays, currentMonthLabel]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-gradient-to-br from-green-50 to-white"
    >
      <Header currentMonthLabel={currentMonthLabel} />

      <div className="grid grid-cols-7 text-center text-slate-600 text-sm mb-2 sticky top-20 bg-white/90 backdrop-blur-sm z-10 p-3 border-b border-green-200">
        <div className="font-semibold text-green-700 tracking-wide">Sun</div>
        <div className="font-semibold text-green-700 tracking-wide">Mon</div>
        <div className="font-semibold text-green-700 tracking-wide">Tue</div>
        <div className="font-semibold text-green-700 tracking-wide">Wed</div>
        <div className="font-semibold text-green-700 tracking-wide">Thu</div>
        <div className="font-semibold text-green-700 tracking-wide">Fri</div>
        <div className="font-semibold text-green-700 tracking-wide">Sat</div>
      </div>

      <div className="grid grid-cols-7">
        {visibleDays.map((date, idx) => (
          <div
            key={`${date.year}-${date.month}-${date.day}-${idx}`}
            data-date={`${date.day}-${date.month}-${date.year}`}
            {...(idx === 0 ? { "data-first": true } : {})}
            {...(idx === visibleDays.length - 1 ? { "data-last": true } : {})}
          >
            <DayCell
              date={date}
              entries={journalEntries}
              onClick={(e) => {
                const i = journalEntries.findIndex((j) => j.date === e.date);
                setActiveIndex(i);
              }}
            />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <JournalModal
          entries={journalEntries}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          setActiveIndex={setActiveIndex}
        />
      )}
    </div>
  );
}
