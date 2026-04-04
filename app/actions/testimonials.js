'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Buscar depoimentos aprovados
export async function getApprovedTestimonials() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('isApproved', true)
      .order('createdAt', { ascending: false })
      .limit(20)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return { success: false, error: error.message }
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
      clientName: data.clientName.trim(),
      avatarUrl: data.avatarUrl || null,
      serviceType: data.serviceType.trim(),
      rating: parseInt(data.rating),
      comment: data.comment.trim(),
      createdAt: new Date().toISOString(),
      isApproved: false,
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