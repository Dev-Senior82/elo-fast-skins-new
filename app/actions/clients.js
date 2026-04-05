'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

// Gerar código de verificação de 4 dígitos
function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Registrar novo cliente
export async function registerClient(data) {
  try {
    const { name, phone, email, password, howFoundUs, referralCode } = data

    // Verificar se email já existe
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return { success: false, error: 'Email já cadastrado' }
    }

    // Hashear senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar cliente (conta já verificada automaticamente)
    const client = {
      id: uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      how_found_us: howFoundUs,
      referral_code: referralCode || null,
      email_verified: true, // Conta verificada automaticamente
      verification_code: null,
      verification_code_expires: null,
      first_purchase_discount_used: false,
      created_at: new Date().toISOString(),
    }

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        firstPurchaseDiscountUsed: newClient.first_purchase_discount_used,
      },
      message: 'Conta criada com sucesso! Faça login para continuar.',
    }
  } catch (error) {
    console.error('Error registering client:', error)
    return { success: false, error: 'Erro ao criar conta' }
  }
}

// Verificar código de email
export async function verifyEmail(email, code) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !client) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    if (client.email_verified) {
      return { success: false, error: 'Email já verificado' }
    }

    if (client.verification_code !== code) {
      return { success: false, error: 'Código inválido' }
    }

    const now = new Date()
    const expiresAt = new Date(client.verification_code_expires)

    if (now > expiresAt) {
      return { success: false, error: 'Código expirado. Solicite um novo.' }
    }

    // Verificar email
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        email_verified: true,
        verification_code: null,
        verification_code_expires: null,
      })
      .eq('id', client.id)

    if (updateError) throw updateError

    return { success: true, message: 'Email verificado com sucesso!' }
  } catch (error) {
    console.error('Error verifying email:', error)
    return { success: false, error: 'Erro ao verificar email' }
  }
}

// Reenviar código de verificação
export async function resendVerificationCode(email) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !client) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    if (client.email_verified) {
      return { success: false, error: 'Email já verificado' }
    }

    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const { error: updateError } = await supabase
      .from('clients')
      .update({
        verification_code: verificationCode,
        verification_code_expires: expiresAt.toISOString(),
      })
      .eq('id', client.id)

    if (updateError) throw updateError

    // Enviar email com novo código
    const { sendVerificationEmail } = await import('@/lib/email')
    const emailResult = await sendVerificationEmail(
      client.email,
      verificationCode,
      client.name
    )

    if (!emailResult.success) {
      console.error('Erro ao enviar email:', emailResult.error)
    }

    return {
      success: true,
      message: 'Novo código enviado para seu email!',
    }
  } catch (error) {
    console.error('Error resending code:', error)
    return { success: false, error: 'Erro ao reenviar código' }
  }
}

// Login do cliente
export async function loginClient(email, password) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !client) {
      return { success: false, error: 'Email ou senha inválidos' }
    }

    const passwordMatch = await bcrypt.compare(password, client.password)

    if (!passwordMatch) {
      return { success: false, error: 'Email ou senha inválidos' }
    }

    return {
      success: true,
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        firstPurchaseDiscountUsed: client.first_purchase_discount_used,
      },
    }
  } catch (error) {
    console.error('Error logging in client:', error)
    return { success: false, error: 'Erro ao fazer login' }
  }
}

// Buscar pedidos do cliente
export async function getClientOrders(clientId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching client orders:', error)
    return { success: false, error: error.message }
  }
}

// Validar código de desconto
export async function validateDiscountCode(code) {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('active', true)
      .single()

    if (error || !data) {
      return { success: false, error: 'Código inválido' }
    }

    // Verificar expiração
    if (data.expires_at) {
      const now = new Date()
      const expiresAt = new Date(data.expires_at)
      if (now > expiresAt) {
        return { success: false, error: 'Código expirado' }
      }
    }

    // Verificar limite de usos
    if (data.max_uses && data.current_uses >= data.max_uses) {
      return { success: false, error: 'Código esgotado' }
    }

    return {
      success: true,
      data: {
        code: data.code,
        discountPercentage: data.discount_percentage,
      },
    }
  } catch (error) {
    console.error('Error validating discount code:', error)
    return { success: false, error: 'Erro ao validar código' }
  }
}

// Incrementar uso de código de desconto
export async function incrementDiscountCodeUsage(code) {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('id, current_uses')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (error || !data) return { success: false }

    const { error: updateError } = await supabase
      .from('discount_codes')
      .update({ current_uses: data.current_uses + 1 })
      .eq('id', data.id)

    if (updateError) throw updateError
    return { success: true }
  } catch (error) {
    console.error('Error incrementing discount code usage:', error)
    return { success: false }
  }
}

// Marcar primeiro desconto como usado
export async function markFirstPurchaseDiscountUsed(clientId) {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ first_purchase_discount_used: true })
      .eq('id', clientId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marking first purchase discount:', error)
    return { success: false }
  }
}