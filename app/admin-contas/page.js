'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function AdminContasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rank: '',
    level: '',
    champions_count: '',
    skins_count: '',
    blue_essence: '',
    rp: '',
    price: '',
    image_url: '',
    available: true,
  })

  useEffect(() => {
    // Verificar se é admin
    const boosterUser = localStorage.getItem('booster_user')
    if (!boosterUser) {
      router.push('/booster-login')
      return
    }

    const user = JSON.parse(boosterUser)
    if (!user.is_admin) {
      router.push('/booster-dashboard')
      return
    }

    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const result = await response.json()
      if (result.success) {
        setAccounts(result.data || [])
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = '/api/accounts'
      const method = editingAccount ? 'PUT' : 'POST'
      const body = editingAccount
        ? { ...formData, id: editingAccount.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: editingAccount ? 'Conta atualizada!' : 'Conta adicionada!',
        })
        setIsDialogOpen(false)
        resetForm()
        loadAccounts()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return

    try {
      const response = await fetch(`/api/accounts?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({ title: 'Conta excluída!' })
        loadAccounts()
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      rank: '',
      level: '',
      champions_count: '',
      skins_count: '',
      blue_essence: '',
      rp: '',
      price: '',
      image_url: '',
      available: true,
    })
    setEditingAccount(null)
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setFormData(account)
    setIsDialogOpen(true)
  }

  return (
    <div className="container py-20">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/admin-dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Link>
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Contas</h1>
          <p className="text-muted-foreground">Adicione e edite contas para venda</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-primary-500 to-orange-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Título*</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Conta Platina IV - 80 Champs"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalhes adicionais da conta..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Elo/Rank*</Label>
                  <Input
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="Ex: Platina IV"
                    required
                  />
                </div>

                <div>
                  <Label>Nível</Label>
                  <Input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="30"
                  />
                </div>

                <div>
                  <Label>Quantidade de Campeões</Label>
                  <Input
                    type="number"
                    value={formData.champions_count}
                    onChange={(e) => setFormData({ ...formData, champions_count: e.target.value })}
                    placeholder="80"
                  />
                </div>

                <div>
                  <Label>Quantidade de Skins</Label>
                  <Input
                    type="number"
                    value={formData.skins_count}
                    onChange={(e) => setFormData({ ...formData, skins_count: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label>Essência Azul (BE)</Label>
                  <Input
                    type="number"
                    value={formData.blue_essence}
                    onChange={(e) => setFormData({ ...formData, blue_essence: e.target.value })}
                    placeholder="25000"
                  />
                </div>

                <div>
                  <Label>RP</Label>
                  <Input
                    type="number"
                    value={formData.rp}
                    onChange={(e) => setFormData({ ...formData, rp: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Preço (R$)*</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="150.00"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>URL da Imagem</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingAccount ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Contas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.length === 0 ? (
          <Card className="glass-card col-span-full">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nenhuma conta cadastrada ainda.</p>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="glass-card">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{account.title}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(account)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Rank:</strong> {account.rank}</p>
                  <p><strong>Preço:</strong> R$ {account.price}</p>
                  {account.level && <p><strong>Nível:</strong> {account.level}</p>}
                  {account.champions_count && <p><strong>Campeões:</strong> {account.champions_count}</p>}
                  {account.description && (
                    <p className="text-muted-foreground">{account.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
