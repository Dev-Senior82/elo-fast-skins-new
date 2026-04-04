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

    // Criar notificação para o booster
    if (order.booster_id) {
      await createNotification({
        boosterId: order.booster_id,
        orderId: order.id,
        message: `1x venda = ${order.current_rank} → ${order.desired_rank}`,
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

// Criar notificação
export async function createNotification(notificationData) {
  try {
    const notification = {
      id: uuidv4(),
      booster_id: notificationData.boosterId,
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

// Buscar notificações do booster
export async function getBoosterNotifications(boosterId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('booster_id', boosterId)
      .order('created_at', { ascending: false })

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