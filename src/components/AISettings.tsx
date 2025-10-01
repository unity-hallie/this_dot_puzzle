import { useState } from 'react'
import { loadAIConfig, saveAIConfig, type AIConfig, type AIProvider } from '../aiGenerator'

export default function AISettings({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<AIConfig | null>(loadAIConfig())
  const [provider, setProvider] = useState<AIProvider>(config?.provider || 'openai')
  const [apiKey, setApiKey] = useState(config?.apiKey || '')
  const [model, setModel] = useState(config?.model || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const newConfig: AIConfig = {
      provider,
      apiKey,
      model: model || undefined
    }
    saveAIConfig(newConfig)
    setConfig(newConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    localStorage.removeItem('ai_config')
    setConfig(null)
    setApiKey('')
    setModel('')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>AI Puzzle Generator Settings</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Provider:
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              style={{ marginLeft: '1rem', padding: '0.25rem' }}
            >
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            API Key:
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
              style={{ 
                display: 'block',
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                fontFamily: 'monospace'
              }}
            />
          </label>
          <small style={{ color: '#666' }}>
            Get from: {provider === 'openai' 
              ? 'https://platform.openai.com/api-keys'
              : 'https://console.anthropic.com/settings/keys'}
          </small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Model (optional):
            <input 
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={provider === 'openai' ? 'gpt-4o-mini' : 'claude-sonnet-4'}
              style={{ 
                display: 'block',
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem'
              }}
            />
          </label>
        </div>

        {saved && (
          <div style={{ 
            padding: '0.5rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            ✓ Settings saved!
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={handleClear} style={{ padding: '0.5rem 1rem' }}>
            Clear
          </button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1rem' }}>
            Save
          </button>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem' }}>
            Close
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
          <strong>Privacy Note:</strong> API keys are stored locally in your browser.
          They are never sent to our servers.
        </div>
      </div>
    </div>
  )
}
