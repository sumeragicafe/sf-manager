import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/session'
import { hasPermission } from '@/utils/auth'

export function verifyPermission() {
  const session = useSessionStore()
  const { permissions } = storeToRefs(session)
  return (required) => {
    console.log(session);
    console.log(permissions.value);
    return hasPermission(permissions.value, required)
  }
}