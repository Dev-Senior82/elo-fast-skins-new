'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

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

// Login do booster com bcrypt
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

    // Verificar senha com bcrypt
    let passwordMatch = false
    
    // Se a senha no banco começa com $2, é um hash bcrypt
    if (data.password && data.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, data.password)
    } else {
      // Retrocompatibilidade: aceita senha em plain text
      passwordMatch = data.password === password
    }

    if (!passwordMatch) {
      return { success: false, error: 'Login ou senha inválidos' }
    }

    // Tentar salvar sessão (não bloqueia se falhar)
    let sessionToken = uuidv4()
    let sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    try {
      await supabase
        .from('booster_sessions')
        .upsert({
          booster_id: data.id,
          session_token: sessionToken,
          expires_at: sessionExpiry,
          created_at: new Date().toISOString()
        }, { onConflict: 'booster_id' })
    } catch (sessionError) {
      // Se falhar ao salvar sessão, continua sem ela
      console.log('Session table not available, continuing without persistent session')
      sessionToken = null
      sessionExpiry = null
    }

    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        login: data.login,
        rank: data.rank,
        is_admin: data.is_admin || false,
        session_token: sessionToken,
        session_expiry: sessionExpiry
      },
    }
  } catch (error) {
    console.error('Error logging in:', error)
    return { success: false, error: 'Erro ao fazer login' }
  }
}

// Verificar sessão válida
export async function verifyBoosterSession(boosterId, sessionToken) {
  try {
    // Se não tem token, retorna falha silenciosa
    if (!sessionToken) {
      return { success: false, error: 'Sem token de sessão' }
    }

    const { data, error } = await supabase
      .from('booster_sessions')
      .select('*, boosters(*)')
      .eq('booster_id', boosterId)
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: 'Sessão inválida ou expirada' }
    }

    return {
      success: true,
      data: {
        id: data.boosters.id,
        name: data.boosters.name,
        login: data.boosters.login,
        rank: data.boosters.rank,
        is_admin: data.boosters.is_admin || false,
        session_token: sessionToken,
        session_expiry: data.expires_at
      }
    }
  } catch (error) {
    // Se a tabela não existe, retorna erro silencioso
    console.log('Session verification failed:', error.message)
    return { success: false, error: 'Erro ao verificar sessão' }
  }
}

// Logout - invalidar sessão
export async function logoutBooster(boosterId) {
  try {
    await supabase
      .from('booster_sessions')
      .delete()
      .eq('booster_id', boosterId)

    return { success: true }
  } catch (error) {
    console.error('Error logging out:', error)
    return { success: false, error: error.message }
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

// Buscar TODOS os pedidos (para boosters e admin)
export async function getAllOrders(boosterId = null, isAdmin = false) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Processar pedidos para adicionar informações de disponibilidade
    const processedOrders = (data || []).map(order => {
      const createdAt = new Date(order.created_at)
      const now = new Date()
      const hoursElapsed = (now - createdAt) / (1000 * 60 * 60)
      const timeRemaining = Math.max(0, 3 * 60 * 60 * 1000 - (now - createdAt)) // 3 horas em ms
      
      return {
        ...order,
        // Verifica se o pedido está disponível para qualquer booster (após 3h ou sem booster específico)
        available_for_all: !order.booster_id || hoursElapsed >= 3,
        // Tempo restante até ficar disponível para todos (em ms)
        time_until_available: order.booster_id && hoursElapsed < 3 ? timeRemaining : 0,
        // Se é o booster designado
        is_designated_booster: boosterId && order.booster_id === boosterId
      }
    })
    
    return { success: true, data: processedOrders }
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return { success: false, error: error.message }
  }
}

// Contar pedidos ativos do booster
export async function countActiveBoosterOrders(boosterId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('accepted_by_booster_id', boosterId)
      .in('status', ['accepted', 'in_progress'])

    if (error) throw error
    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('Error counting active orders:', error)
    return { success: false, error: error.message }
  }
}

// Aceitar pedido com limite de 2 pedidos simultâneos
export async function acceptOrder(orderId, boosterId, boosterName) {
  try {
    // Verificar se o booster já tem 2 pedidos ativos
    const activeCount = await countActiveBoosterOrders(boosterId)
    if (activeCount.success && activeCount.count >= 2) {
      return { 
        success: false, 
        error: 'Você já possui 2 pedidos em andamento. Conclua um pedido antes de aceitar outro.' 
      }
    }

    // Buscar o pedido para verificar se pode ser aceito
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return { success: false, error: 'Pedido não encontrado' }
    }

    // Verificar se o pedido já foi aceito
    if (order.status !== 'pending') {
      return { success: false, error: 'Este pedido já foi aceito por outro booster' }
    }

    // Verificar se o booster pode aceitar (é o designado ou passou 3h)
    const createdAt = new Date(order.created_at)
    const now = new Date()
    const hoursElapsed = (now - createdAt) / (1000 * 60 * 60)

    if (order.booster_id && order.booster_id !== boosterId && hoursElapsed < 3) {
      return { 
        success: false, 
        error: 'Este pedido está reservado para outro booster. Aguarde o tempo de espera.' 
      }
    }

    // Aceitar o pedido
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'accepted', 
        accepted_at: new Date().toISOString(),
        accepted_by_booster_id: boosterId,
        accepted_by_booster_name: boosterName
      })
      .eq('id', orderId)
      .eq('status', 'pending') // Garantir que ainda está pendente

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error accepting order:', error)
    return { success: false, error: error.message }
  }
}

// Completar pedido
export async function completeOrder(orderId, boosterId) {
  try {
    // Verificar se o booster é quem aceitou o pedido
    const { data: order } = await supabase
      .from('orders')
      .select('accepted_by_booster_id')
      .eq('id', orderId)
      .single()

    if (order && order.accepted_by_booster_id !== boosterId) {
      return { success: false, error: 'Apenas o booster que aceitou pode concluir este pedido' }
    }

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

// Criar hash de senha (utility)
export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}
