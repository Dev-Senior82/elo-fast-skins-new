'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Enviar mensagem
export async function sendMessage(messageData) {
  try {
    const message = {
      id: uuidv4(),
      order_id: messageData.orderId,
      sender_type: messageData.senderType,
      sender_name: messageData.senderName,
      message: messageData.message,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('messages').insert([message])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: error.message }
  }
}

// Buscar mensagens do pedido
export async function getOrderMessages(orderId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { success: false, error: error.message }
  }
}