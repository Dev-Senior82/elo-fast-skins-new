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

// Aceitar pedido
export async function acceptOrder(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
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