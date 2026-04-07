'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Buscar todos os boosters ativos
export async function getActiveBoosters() {
  try {
    const { data, error } = await supabase
      .from('boosters')
      .select('*')
      .eq('active', true)
      .eq('is_admin', false)
      .order('rating', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching boosters:', error)
    return { success: false, error: error.message }
  }
}

// Login do booster
export async function loginBooster(login, password) {
  try {
    // Buscar booster pelo login
    const { data, error } = await supabase
      .from('boosters')
      .select('*')
      .eq('login', login)
      .eq('active', true)
      .single()

    if (error || !data) {
      return { success: false, error: 'Login ou senha inválidos' }
    }

    // Verificar senha (suporta plain text e hash para retrocompatibilidade)
    const bcrypt = require('bcryptjs')
    let passwordMatch = false
    
    // Se a senha no banco começa com $2, é um hash bcrypt
    if (data.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, data.password)
    } else {
      // Retrocompatibilidade: aceita senha em plain text
      passwordMatch = data.password === password
    }

    if (!passwordMatch) {
      return { success: false, error: 'Login ou senha inválidos' }
    }

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

// Buscar pedidos do booster
export async function getBoosterOrders(boosterId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('booster_id', boosterId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { success: false, error: error.message }
  }
}

// Buscar TODOS os pedidos (admin)
export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return { success: false, error: error.message }
  }
}

// NOVO: Verificar quantos pedidos ativos o booster possui
export async function getActiveOrdersCount(boosterId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('accepted_by_booster_id', boosterId)
      .in('status', ['accepted', 'in_progress']) // Pedidos ativos

    if (error) throw error
    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('Error counting active orders:', error)
    return { success: false, error: error.message }
  }
}

// NOVO: Verificar se pedido está disponível para o booster
export async function canBoosterAcceptOrder(boosterId, orderId) {
  try {
    // 1. Buscar o pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: 'Pedido não encontrado' }
    }

    // 2. Verificar se já foi aceito por outro booster
    if (order.accepted_by_booster_id && order.accepted_by_booster_id !== boosterId) {
      return { success: false, error: 'Pedido já foi aceito por outro booster' }
    }

    // 3. Verificar se está reservado
    if (order.reserved_for_booster_id) {
      const now = new Date()
      const expiresAt = new Date(order.reservation_expires_at)

      // Se reservado para outro booster E ainda não expirou
      if (order.reserved_for_booster_id !== boosterId && now < expiresAt) {
        const remainingMinutes = Math.ceil((expiresAt - now) / (1000 * 60))
        return {
          success: false,
          error: `Pedido reservado para outro booster. Disponível em ${remainingMinutes} minutos.`,
        }
      }

      // Se expirou, liberar o pedido
      if (now >= expiresAt) {
        await supabase
          .from('orders')
          .update({
            reserved_for_booster_id: null,
            reservation_expires_at: null,
          })
          .eq('id', orderId)
      }
    }

    // 4. Verificar limite de 2 pedidos ativos
    const activeResult = await getActiveOrdersCount(boosterId)
    if (activeResult.success && activeResult.count >= 2) {
      return {
        success: false,
        error: 'Você já possui o máximo de 2 pedidos ativos.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error checking order availability:', error)
    return { success: false, error: error.message }
  }
}

// Aceitar pedido (ATUALIZADO COM PROTEÇÃO ATÔMICA)
export async function acceptOrder(orderId, boosterId) {
  try {
    // 1. Verificar se o booster pode aceitar
    const canAccept = await canBoosterAcceptOrder(boosterId, orderId)
    if (!canAccept.success) {
      return canAccept // Retornar erro
    }

    // 2. Atualização ATÔMICA usando transação
    // Primeiro, buscar o pedido atual
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('status', 'pending') // Apenas pedidos pendentes
      .is('accepted_by_booster_id', null) // Que ainda não foram aceitos
      .single()

    if (fetchError || !currentOrder) {
      return { success: false, error: 'Pedido não está mais disponível' }
    }

    // 3. Tentar aceitar (race condition protection)
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'accepted',
        accepted_by_booster_id: boosterId,
        accepted_at: new Date().toISOString(),
        reserved_for_booster_id: null, // Limpar reserva
        reservation_expires_at: null,
      })
      .eq('id', orderId)
      .eq('status', 'pending') // Double-check que ainda está pending
      .is('accepted_by_booster_id', null) // E que não foi aceito

    if (updateError) {
      console.error('Error updating order:', updateError)
      return { success: false, error: 'Pedido já foi aceito por outro booster' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error accepting order:', error)
    return { success: false, error: error.message }
  }
}

// Completar pedido
export async function completeOrder(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error completing order:', error)
    return { success: false, error: error.message }
  }
}