import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DateRangePicker = ({ onChange, defaultRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultRange?.startDate || new Date(Date.now() - 27 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(defaultRange?.endDate || new Date());
  
  // Calendar UI state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef(null);

  const presets = [
    { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
    { label: 'Yesterday', getValue: () => {
        const d = new Date(); d.setDate(d.getDate() - 1);
        return { start: d, end: d };
      }
    },
    { label: 'This Week', getValue: () => {
        const start = new Date();
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        return { start, end: new Date() };
      }
    },
    { label: 'Last 7 Days', getValue: () => ({ start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), end: new Date() }) },
    { label: 'Last 28 Days', getValue: () => ({ start: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), end: new Date() }) },
    { label: 'This Month', getValue: () => ({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() }) },
    { label: 'Last Month', getValue: () => {
        const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        return { start, end };
      }
    },
    { label: 'This Year', getValue: () => ({ start: new Date(new Date().getFullYear(), 0, 1), end: new Date() }) },
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handlePresetClick = (preset) => {
    const { start, end } = preset.getValue();
    // Reset hours
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    setStartDate(start);
    setEndDate(end);
    onChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  // Calendar render helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const result = [];
    
    // Day of the week of first day of month (0 = Sun, 6 = Sat)
    const startDay = new Date(year, month, 1).getDay();
    
    // Fill prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      result.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
    }
    
    // Fill current month days
    for (let i = 1; i <= days; i++) {
      result.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Fill next month padding to make a full grid of 42 items (6 rows)
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      result.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return result;
  };

  const handleDayClick = (dayDate) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dayDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (dayDate < startDate) {
        setStartDate(dayDate);
      } else {
        const end = new Date(dayDate);
        end.setHours(23,59,59,999);
        setEndDate(end);
        onChange({ startDate, endDate: end });
        setIsOpen(false);
      }
    }
  };

  const isSelected = (dayDate) => {
    if (startDate && dayDate.toDateString() === startDate.toDateString()) return true;
    if (endDate && dayDate.toDateString() === endDate.toDateString()) return true;
    return false;
  };

  const isInRange = (dayDate) => {
    if (startDate && endDate && dayDate > startDate && dayDate < endDate) return true;
    return false;
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Calendar Input Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary/30 hover:bg-secondary/50 border border-border/50 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] focus:outline-none text-foreground"
      >
        <CalendarIcon size={16} className="text-muted-foreground" />
        <span>{formatDate(startDate)} – {formatDate(endDate)}</span>
      </button>

      {/* Date Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row gap-4 z-50 overflow-hidden font-sans w-[300px] sm:w-[560px] text-foreground"
          >
            {/* Left pane: presets */}
            <div className="w-full sm:w-1/3 flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border/40 pb-3 sm:pb-0 sm:pr-3 text-sm">
              {presets.map((preset) => {
                const startStr = preset.getValue().start.toDateString();
                const currentStartStr = startDate?.toDateString();
                const isPresetSelected = startStr === currentStartStr;
                return (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={`px-3 py-1.5 rounded-lg text-left font-medium transition-all ${
                      isPresetSelected 
                        ? 'bg-primary text-primary-foreground font-semibold' 
                        : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Right pane: calendar month grid */}
            <div className="w-full sm:w-2/3 flex flex-col">
              {/* Header Navigation */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-1 hover:bg-secondary/50 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold">
                  {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-1 hover:bg-secondary/50 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground/80 mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  const selected = isSelected(day.date);
                  const range = isInRange(day.date);
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(day.date)}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all relative ${
                        !day.isCurrentMonth ? 'text-muted-foreground/30 font-normal' : ''
                      } ${
                        selected 
                          ? 'bg-blue-600 text-white font-bold' 
                          : range 
                          ? 'bg-blue-500/10 text-blue-500 rounded-none' 
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      {isToday && !selected && (
                        <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full" />
                      )}
                      {day.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;
