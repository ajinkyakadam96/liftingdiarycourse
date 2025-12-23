import { format } from 'date-fns'

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  const day = format(dateObj, 'd')
  const month = format(dateObj, 'MMM')
  const year = format(dateObj, 'yyyy')
  return `${day}${getOrdinalSuffix(Number(day))} ${month} ${year}`
}
