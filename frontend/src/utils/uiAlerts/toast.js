import Swal from 'sweetalert2';


export function showToast({
  icon = 'success',
  title = '',
  description = '',
  timer = 3000,
  position = 'bottom-end' // valor amigável padrão
}) {
  return Swal.fire({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon,
    title,
    html: description ? `<p class="text-xs text-ong-text">${description}</p>` : '',
    customClass: {
      popup: 'rounded-lg shadow-md',
      title: 'text-sm text-ong-text font-semibold',
    },
  })
}