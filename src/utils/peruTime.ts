export interface PeruDateTime {
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  dayName: string;
  hours: number;
  minutes: number;
  timeString12: string;
  isSunday: boolean;
  isAfter3PM: boolean;
  isMenuAvailable: boolean;
  statusText: string;
  reason?: string;
}

export function getPeruDateTime(): PeruDateTime {
  const now = new Date();
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    hourCycle: "h23",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  });

  const parts = Object.fromEntries(dtf.formatToParts(now).map((p) => [p.type, p.value]));
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayOfWeek = weekdayMap[parts.weekday] ?? 0;
  const hours = parseInt(parts.hour, 10);
  const minutes = parseInt(parts.minute, 10);

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayName = dayNames[dayOfWeek];

  const isSunday = dayOfWeek === 0;
  const isAfter3PM = hours >= 15;
  const isMenuAvailable = !isSunday && !isAfter3PM;

  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const timeString12 = `${hour12}:${String(minutes).padStart(2, "0")} ${ampm}`;

  let statusText = "Menú disponible";
  let reason = "";

  if (isSunday) {
    statusText = "Cerrado los domingos";
    reason = "Los domingos no se atiende menú del día. Solo platos a la carta.";
  } else if (isAfter3PM) {
    statusText = "Cerrado por horario (pasadas las 3:00 PM)";
    reason = "El horario de menú finalizó a las 3:00 PM. Solo platos a la carta.";
  }

  return {
    dayOfWeek,
    dayName,
    hours,
    minutes,
    timeString12,
    isSunday,
    isAfter3PM,
    isMenuAvailable,
    statusText,
    reason,
  };
}
