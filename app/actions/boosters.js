'use server'

import { supabase } from '@/lib/supabase'
import { createSession, requireAdmin, getSession, destroySession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function getActiveBoosters() {
  try {
    const { data, error } = await supabase
      .from('boosters')
      .select('id, name, rank, rating, wins, specialty, avatar_url')
      .eq('active', true)
      .eq('is_admin', false)
      .order('rating', { ascending: false })
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching boosters:', error)
    return { success: false, error: 'Erro ao buscar boosters' }
  }
}

export async function loginBooster(login, password) {
  try {
    if (!login || !password) {
      return { success: false, error: 'Login e senha sao obrigatorios' }
    }

    const { data, error } = await supabase
      .from('boosters')
      .select('*')
      .eq('login', login.trim())
      .eq('active', true)
      .single()

    if (error || !data) {
      return { success: false, error: 'Login ou senha invalidos' }
    }

    let passwordMatch = false

    if (data.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, data.password)
    } else {
      console.warn(`[SEGURANCA] Booster ${data.id} ainda usa senha plain text`)
      passwordMatch = data.password === password

      if (passwordMatch) {
        const hashed = await bcrypt.hash(password, 12)
        await supabase
          .from('boosters')
          .update({ password: hashed })
          .eq('id', data.id)
      }
    }

    if (!passwordMatch) {
      return { success: false, error: 'Login ou senha invalidos' }
    }

    await createSession({
      id: data.id,
      name: data.name,
      is_admin: data.is_admin || false,
    })

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        rank: data.rank,
        is_admin: data.is_admin || false,
      },
    }
  } catch (error) {
    console.error('Error logging in:', error)
    return { success: false, error: 'Erro ao fazer login' }
  }
}

export async function getCurrentSession() {
  try {
    const session = await getSession()
    if (!session) return { success: false }
    return { success: true, data: session }
  } catch {
    return { success: false }
  }
}

export async function getBoosterOrders() {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: 'Nao autorizado' }
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('booster_id', session.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { success: false, error: 'Erro ao buscar pedidos' }
  }
}

export async function getAllOrders() {
  try {
    const { authorized, reason } = await requireAdmin()
    if (!authorized) {
      console.warn(`[SEGURANCA] Tentativa nao autorizada de getAllOrders: ${reason}`)
      return { success: false, error: 'Acesso negado' }
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return { success: false, error: 'Erro ao buscar pedidos' }
  }
}

export async function acceptOrder(orderId) {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: 'Acesso negado' }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error accepting order:', error)
    return { success: false, error: 'Erro ao aceitar pedido' }
  }
}

export async function completeOrder(orderId) {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return { success: false, error: 'Acesso negado' }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error completing order:', error)
    return { success: false, error: 'Erro ao completar pedido' }
  }
}

export async function logoutBooster() {
  await destroySession()
  return { success: true }
}
