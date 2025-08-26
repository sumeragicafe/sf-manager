import Swal from 'sweetalert2';

export function showConfirm({
  title = 'Tem certeza?',
  text = '',
  icon = 'warning',          // warning, question, info, error, success
  confirmButtonText = 'Sim',
  cancelButtonText = 'Cancelar',
  reverseButtons = true,     // troca posição dos botões (confirm à direita)
  showCancelButton = true,
  focusCancel = true,        // foco padrão no cancelar
  customClass = {},          // para customização adicional
}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    reverseButtons,
    focusCancel,
    customClass: {
      popup: 'rounded-lg shadow-md',
      confirmButton: 'bg-ong-primary hover:bg-ong-accent text-white font-semibold px-4 py-2 rounded-md',
      cancelButton: 'bg-destructive text-white border border-destructive hover:bg-transparent hover:text-destructive focus:outline-none px-4 py-2 focus:outline-none',
      ...customClass,
    }
  }).then(result => result.isConfirmed);
}
