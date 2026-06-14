export async function getSessionUser() {
  return {
    id: 'mock-user-id',
    email: 'admin@shreepathy.com',
    user_metadata: {
      full_name: 'Shreepathy Admin',
    },
  }
}

export function isAdminEmail(email) {
  return true
}

export async function requireUser() {
  return getSessionUser()
}

export async function requireAdmin() {
  return getSessionUser()
}

