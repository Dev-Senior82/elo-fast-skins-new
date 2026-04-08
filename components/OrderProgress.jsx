'use client'

import { memo } from 'react'
import { CheckCircle2, CreditCard, UserCheck, Gamepad2, Trophy } from 'lucide-react'

// Mapear status para etapa
const getStepFromStatus = (status) => {
  switch (status) {
    case 'pending': return 0
    case 'paid': return 1
    case 'accepted': return 2
    case 'in_progress': return 3
    case 'completed': return 4
    default: return 0
  }
}

const steps = [
  { id: 1, label: 'Pagamento confirmado', icon: CreditCard },
  { id: 2, label: 'Booster atribuído', icon: UserCheck },
  { id: 3, label: 'Boost em andamento', icon: Gamepad2 },
  { id: 4, label: 'Concluído', icon: Trophy },
]

const OrderProgress = memo(({ status = 'pending' }) => {
  const currentStep = getStepFromStatus(status)

  return (
    <div className="w-full py-6">
      {/* Barra de progresso horizontal */}
      <div className="relative">
        {/* Linha de fundo */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 rounded-full" />
        
        {/* Linha de progresso */}
        <div 
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index
            const isCurrent = currentStep === index + 1
            const isPending = currentStep < index + 1
            const Icon = step.icon

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Círculo do step */}
                <div 
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30' 
                      : isCurrent 
                        ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 animate-pulse' 
                        : 'bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`
                    mt-3 text-xs font-medium text-center max-w-[80px]
                    ${isCompleted ? 'text-green-400' : isCurrent ? 'text-orange-400' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </span>

                {/* Indicador de atual */}
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Texto do status atual */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          {status === 'pending' && 'Aguardando pagamento...'}
          {status === 'paid' && '✅ Pagamento confirmado! Aguardando booster...'}
          {status === 'accepted' && '✅ Booster atribuído! Boost será iniciado em breve...'}
          {status === 'in_progress' && '🎮 Boost em andamento! Acompanhe pelo chat...'}
          {status === 'completed' && '🏆 Pedido concluído com sucesso!'}
        </p>
      </div>
    </div>
  )
})

OrderProgress.displayName = 'OrderProgress'

export default OrderProgress
