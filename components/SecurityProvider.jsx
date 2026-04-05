'use client'

import { useEffect } from 'react'

export default function SecurityProvider({ children }) {
  useEffect(() => {
    // Desabilitar teclas de atalho para DevTools
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+I (Inspecionar)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+U (Ver código fonte)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+C (Inspecionar elemento)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }
    }

    // Desabilitar clique direito
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Detectar abertura de DevTools
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        // DevTools pode estar aberto
        document.body.innerHTML = `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
            color: #ff5e4d;
            font-family: 'Arial', sans-serif;
            text-align: center;
          ">
            <div>
              <h1 style="font-size: 48px; margin-bottom: 20px;">🛡️ BLOQUEADO</h1>
              <p style="font-size: 18px; color: #888;">Ferramentas de desenvolvedor não são permitidas neste site.</p>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">Feche o DevTools e recarregue a página.</p>
            </div>
          </div>
        `
      }
    }

    // Sobrescrever console para esconder logs
    const originalConsole = { ...console }
    const noop = () => {}
    
    if (process.env.NODE_ENV === 'production') {
      console.log = noop
      console.warn = noop
      console.error = noop
      console.info = noop
      console.debug = noop
      console.table = noop
      console.trace = noop
    }

    // Desabilitar seleção de texto em áreas sensíveis
    const disableSelection = (e) => {
      if (e.target.closest('[data-protected]')) {
        e.preventDefault()
        return false
      }
    }

    // Adicionar listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', disableSelection)
    
    // Verificar DevTools periodicamente (apenas em produção)
    let devToolsInterval
    if (process.env.NODE_ENV === 'production') {
      devToolsInterval = setInterval(detectDevTools, 1000)
    }

    // Limpar debugger statements
    if (process.env.NODE_ENV === 'production') {
      const clearDebugger = setInterval(() => {
        try {
          (function() {}.constructor('debugger')())
        } catch (e) {}
      }, 100)
      
      setTimeout(() => clearInterval(clearDebugger), 5000)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', disableSelection)
      if (devToolsInterval) clearInterval(devToolsInterval)
      
      // Restaurar console
      if (process.env.NODE_ENV === 'production') {
        Object.assign(console, originalConsole)
      }
    }
  }, [])

  return <>{children}</>
}
