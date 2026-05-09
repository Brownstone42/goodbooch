function toDate(value) {
    if (!value) return null
    return typeof value.toDate === 'function' ? value.toDate() : value
}

export function formatDate(value) {
    const date = toDate(value)
    if (!date) return '-'
    return date.toLocaleDateString()
}

export function formatDateTH(value) {
    const date = toDate(value)
    if (!date) return '—'
    return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date)
}
