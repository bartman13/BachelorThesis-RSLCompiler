export default function FormatDate(withTime, date) {
    if (!withTime) {
        return new Date(date).toLocaleDateString("pl", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return new Date(date).toLocaleDateString("pl", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit"
    });
}