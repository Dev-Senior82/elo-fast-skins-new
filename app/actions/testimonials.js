'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Buscar depoimentos aprovados
export async function getApprovedTestimonials() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching testimonials:', error)
      // Retornar array vazio ao invés de quebrar
      return { success: true, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    // Retornar array vazio ao invés de quebrar
    return { success: true, data: [] }
  }
}

// Enviar novo depoimento
export async function submitTestimonial(data) {
  try {
    if (!data.clientName || !data.serviceType || !data.rating || !data.comment) {
      return { success: false, error: 'Todos os campos são obrigatórios' }
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'Avaliação deve ser entre 1 e 5 estrelas' }
    }

    const testimonial = {
      id: uuidv4(),
      client_name: data.clientName.trim(),
      avatar_url: data.avatarUrl || null,
      service_type: data.serviceType.trim(),
      rating: parseInt(data.rating),
      comment: data.comment.trim(),
      created_at: new Date().toISOString(),
      is_approved: false,
    }

    const { error } = await supabase.from('testimonials').insert([testimonial])

    if (error) throw error

    return {
      success: true,
      message: 'Depoimento enviado com sucesso! Aguarde aprovação.',
    }
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    return { success: false, error: 'Erro ao enviar depoimento' }
  }
}