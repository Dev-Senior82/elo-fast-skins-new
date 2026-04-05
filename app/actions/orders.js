'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Criar novo pedido
export async function createOrder(orderData) {
  try {
    const order = {
      id: uuidv4(),
      client_id: orderData.clientId || null,
      client_name: orderData.clientName,
      client_contact: orderData.clientContact || null,
      game: 'League of Legends',
      current_rank: orderData.currentRank,
      desired_rank: orderData.desiredRank,
      service_type: orderData.serviceType || 'solo',
      original_price: parseFloat(orderData.originalPrice),
      discount_code: orderData.discountCode || null,
      discount_percentage: orderData.discountPercentage || 0,
      price: parseFloat(orderData.price),
      final_price: parseFloat(orderData.finalPrice || orderData.price),
      booster_id: orderData.boosterId || null,
      booster_name: orderData.boosterName || null,
      payment_status: 'pending',
      payment_proof: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('orders').insert([order]).select().single()

    if (error) throw error

    // Criar notificação para o booster específico
    if (order.booster_id) {
      await createNotification({
        boosterId: order.booster_id,
        orderId: order.id,
        type: 'new_order',
        message: `Novo pedido: ${order.current_rank} → ${order.desired_rank}`,
      })
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: error.message }
  }
}

// Buscar pedido por ID
export async function getOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { success: false, error: error.message }
  }
}

// Criar notificação individual para o booster
export async function createNotification(notificationData) {
  try {
    const notification = {
      id: uuidv4(),
      booster_id: notificationData.boosterId,
      order_id: notificationData.orderId,
      type: notificationData.type || 'general',
      message: notificationData.message,
      read: false,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('notifications').insert([notification])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: error.message }
  }
}

// Buscar notificações do booster específico
export async function getBoosterNotifications(boosterId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('booster_id', boosterId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: error.message }
  }
}

// Marcar notificação como lida
export async function markNotificationAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: error.message }
  }
}

// Deletar notificação
export async function deleteNotification(notificationId, boosterId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('booster_id', boosterId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: error.message }
  }
}

// Deletar todas as notificações do booster
export async function clearAllNotifications(boosterId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('booster_id', boosterId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error clearing notifications:', error)
    return { success: false, error: error.message }
  }
}

// Upload de comprovante de pagamento
export async function uploadPaymentProof(orderId, proofUrl) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_proof: proofUrl })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error uploading payment proof:', error)
    return { success: false, error: error.message }
  }
}

// Confirmar pagamento (admin)
export async function confirmPayment(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return { success: false, error: error.message }
  }
}

// Verificar acesso ao chat (apenas cliente e booster do pedido)
export async function canAccessChat(orderId, userId, userType) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('client_id, booster_id, accepted_by_booster_id')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return { success: false, canAccess: false }
    }

    // Admin sempre pode acessar
    if (userType === 'admin') {
      return { success: true, canAccess: true }
    }

    // Cliente pode acessar seu próprio pedido
    if (userType === 'client' && order.client_id === userId) {
      return { success: true, canAccess: true }
    }

    // Booster pode acessar se for o designado ou quem aceitou
    if (userType === 'booster') {
      const canAccess = order.booster_id === userId || order.accepted_by_booster_id === userId
      return { success: true, canAccess }
    }

    return { success: true, canAccess: false }
  } catch (error) {
    console.error('Error checking chat access:', error)
    return { success: false, canAccess: false }
  }
}
