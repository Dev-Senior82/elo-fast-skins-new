import FAQChatbot from '@/components/FAQChatbot'

export default function FAQPage() {
  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Central de <span className="gamer-gradient bg-clip-text text-transparent">Ajuda</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Encontre respostas para suas dúvidas
          </p>
        </div>
        
        <FAQChatbot />
      </div>
    </div>
  )
}
