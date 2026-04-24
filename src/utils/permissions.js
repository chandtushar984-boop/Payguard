export async function requestPermissions(dispatch, pushAlert) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then(r => r.json())
          .then(data => {
            const country = data.address?.country || 'Unknown'
            const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown city'
            sessionStorage.setItem('pg_location', JSON.stringify({ country, city, lat: latitude, lon: longitude }))
            dispatch(pushAlert({ type: 'info', message: `Location detected: ${city}, ${country}. Transactions from other countries will be flagged.` }))
          })
          .catch(() => {})
      },
      () => {
        dispatch(pushAlert({ type: 'warning', message: 'Location access denied. Foreign IP detection disabled.' }))
      }
    )
  }

  if ('Notification' in window) {
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      dispatch(pushAlert({ type: 'success', message: 'Notifications enabled. You will be alerted for blocked transactions.' }))
    }
  }
}

export function sendNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/vite.svg' })
  }
}

export function getUserLocation() {
  const raw = sessionStorage.getItem('pg_location')
  return raw ? JSON.parse(raw) : null
}
