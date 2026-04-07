'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Criar novo pedido
export async function createOrder(orderData) {
  try {
    // Calcular expiração da reserva (3 horas a partir de agora)
    const reservationExpiry = new Date()
    reservationExpiry.setHours(reservationExpiry.getHours() + 3)

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
      // NOVO: Campos de reserva
      reserved_for_booster_id: orderData.boosterId || null, // Reservar para booster específico
      reservation_expires_at: orderData.boosterId ? reservationExpiry.toISOString() : null,
      accepted_by_booster_id: null,
      accepted_at: null,
      payment_status: 'pending',
      payment_proof: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('orders').insert([order]).select().single()

    if (error) throw error

    // Criar notificação PRIVADA para o booster específico
    if (order.reserved_for_booster_id) {
      await createNotification({
        userId: order.reserved_for_booster_id,
        userType: 'booster',
        orderId: order.id,
        message: `Nova venda reservada: ${order.current_rank} → ${order.desired_rank} - R$ ${order.final_price}`,
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

// Criar notificação (AGORA COM PRIVACIDADE)
export async function createNotification(notificationData) {
  try {
    const notification = {
      id: uuidv4(),
      // NOVO: Suporte a notificações privadas por user_id
      user_id: notificationData.userId || notificationData.boosterId,
      user_type: notificationData.userType || 'booster',
      booster_id: notificationData.boosterId || null, // Backward compatibility
      order_id: notificationData.orderId,
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

// Buscar notificações do booster (AGORA PRIVADAS)
export async function getBoosterNotifications(boosterId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${boosterId},booster_id.eq.${boosterId}`) // Suportar campo novo e antigo
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: error.message }
  }
}

// NOVO: Deletar notificação
export async function deleteNotification(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
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