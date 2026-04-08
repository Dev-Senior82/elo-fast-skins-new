'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Upload, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function ClientProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    whatsapp: '',
    discord: '',
    current_elo: '',
    preferred_lane: '',
    avatar_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const clientUser = localStorage.getItem('client_user')
    if (!clientUser) {
      router.push('/client-login')
      return
    }

    const userData = JSON.parse(clientUser)
    setUser(userData)
    loadProfile(userData.id)
  }, [])

  const loadProfile = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .single()

      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age || '',
          whatsapp: data.whatsapp || '',
          discord: data.discord || '',
          current_elo: data.current_elo || '',
          preferred_lane: data.preferred_lane || '',
          avatar_url: data.avatar_url || ''
        })
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A foto deve ter no máximo 2MB',
        variant: 'destructive'
      })
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Apenas imagens são permitidas',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `client-${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload usando anon key (funciona sem autenticação)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setProfile({ ...profile, avatar_url: urlData.publicUrl })

      toast({
        title: 'Foto enviada!',
        description: 'Não esqueça de salvar o perfil',
        duration: 3000
      })
    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: 'Erro ao enviar foto',
        description: error.message || 'Tente novamente',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: user.id,
          name: profile.name,
          age: parseInt(profile.age) || null,
          whatsapp: profile.whatsapp,
          discord: profile.discord,
          current_elo: profile.current_elo,
          preferred_lane: profile.preferred_lane,
          avatar_url: profile.avatar_url
        })

      if (error) throw error

      toast({
        title: 'Perfil salvo!',
        description: 'Suas informações foram atualizadas'
      })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        title: 'Erro ao salvar perfil',
        description: 'Tente novamente',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) return <div className="container py-20 text-center">Carregando...</div>

  return (
    <div className="container py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6" />
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-4xl">
                {profile.name?.[0] || user.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <label htmlFor="avatar-upload">
              <Button variant="outline" disabled={uploading} asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Enviando...' : 'Trocar Foto'}
                </span>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Formulário */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Ex: 25"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="elo">Elo Atual</Label>
                <Input
                  id="elo"
                  value={profile.current_elo}
                  onChange={(e) => setProfile({ ...profile, current_elo: e.target.value })}
                  placeholder="Ex: Ouro IV"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lane">Lane Preferida</Label>
              <Input
                id="lane"
                value={profile.preferred_lane}
                onChange={(e) => setProfile({ ...profile, preferred_lane: e.target.value })}
                placeholder="Ex: Mid"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                value={profile.discord}
                onChange={(e) => setProfile({ ...profile, discord: e.target.value })}
                placeholder="usuario#1234"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
