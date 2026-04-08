'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Shield, Upload, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function BoosterProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    whatsapp: '',
    discord: '',
    current_elo: '',
    bio: '',
    avatar_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const boosterUser = localStorage.getItem('booster_user')
    if (!boosterUser) {
      router.push('/booster-login')
      return
    }

    const userData = JSON.parse(boosterUser)
    setUser(userData)
    loadProfile(userData.id)
  }, [])

  const loadProfile = async (boosterId) => {
    try {
      const { data, error } = await supabase
        .from('booster_profiles')
        .select('*')
        .eq('booster_id', boosterId)
        .single()

      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age || '',
          whatsapp: data.whatsapp || '',
          discord: data.discord || '',
          current_elo: data.current_elo || '',
          bio: data.bio || '',
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

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A foto deve ter no máximo 2MB',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setProfile({ ...profile, avatar_url: data.publicUrl })

      toast({
        title: 'Foto enviada!',
        description: 'Não esqueça de salvar o perfil'
      })
    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: 'Erro ao enviar foto',
        description: 'Tente novamente',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    // Validar Bio (max 500 caracteres)
    if (profile.bio && profile.bio.length > 500) {
      toast({
        title: 'Bio muito longa',
        description: 'A bio deve ter no máximo 500 caracteres',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('booster_profiles')
        .upsert({
          booster_id: user.id,
          name: profile.name,
          age: parseInt(profile.age) || null,
          whatsapp: profile.whatsapp,
          discord: profile.discord,
          current_elo: profile.current_elo,
          bio: profile.bio,
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

  const charCount = profile.bio?.length || 0

  return (
    <div className="container py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Meu Perfil - Booster
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-4xl">
                {profile.name?.[0] || user.name?.[0] || 'B'}
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
                  placeholder="Ex: Grão-Mestre"
                />
              </div>
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

            <div className="grid gap-2">
              <Label htmlFor="bio">
                Bio Personalizada ({charCount}/500)
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Conte um pouco sobre você e sua experiência como booster..."
                rows={4}
                maxLength={500}
                className={charCount > 500 ? 'border-red-500' : ''}
              />
              {charCount > 500 && (
                <p className="text-xs text-red-500">
                  A bio deve ter no máximo 500 caracteres
                </p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={saving || charCount > 500}
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
