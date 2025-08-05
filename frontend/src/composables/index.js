import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/session'
import { hasPermission } from '@/utils/auth'

export function verifyPermission() {
  const session = useSessionStore()
  const { permissions } = storeToRefs(session)
  return (required) => {
    return hasPermission(permissions.value, required)
  }
}