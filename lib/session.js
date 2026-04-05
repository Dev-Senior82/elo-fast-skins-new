'use server'

import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 60 * 60 * 4 // 4 horas em segundos

export async function createSession(userData) {
  const sessionData = {
    id: userData.id,
    name: userData.name,
    isAdmin: userData.is_admin,
    exp: Date.now() + SESSION_DURATION * 1000,
  }

  const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64')

  console.log('[SESSION] Criando sessao para:', userData.name)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })

  console.log('[SESSION] Cookie setado!')

  return sessionData
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(SESSION_COOKIE)
    if (!cookie?.value) return null

    const sessionData = JSON.parse(Buffer.from(cookie.value, 'base64').toString())

    if (!sessionData.exp || sessionData.exp < Date.now()) {
      await destroySession()
      return null
    }

    return sessionData
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getSession()

  if (!session) {
    return { authorized: false, reason: 'not_logged_in' }
  }

  if (!session.isAdmin) {
    return { authorized: false, reason: 'not_admin' }
  }

  return { authorized: true, session }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
