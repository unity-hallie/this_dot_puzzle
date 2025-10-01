import { useState, useEffect } from 'react'
import {
  type AIProvider,
  loadApiKey,
  saveApiKey,
  clearApiKey,
  testApiKey,
} from '../aiGenerator'

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [openaiKey, setOpenaiKey] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [openaiKeyLoaded, setOpenaiKeyLoaded] = useState(false)
  const [anthropicKeyLoaded, setAnthropicKeyLoaded] = useState(false)
  const [testing, setTesting] = useState<AIProvider | null>(null)
  const [testResults, setTestResults] = useState<Record<AIProvider, { success: boolean; message: string } | null>>({
    openai: null,
    anthropic: null,
  })

  // Load existing keys on mount
  useEffect(() => {
    const openaiStored = loadApiKey('openai')
    const anthropicStored = loadApiKey('anthropic')

    if (openaiStored) {
      setOpenaiKey(maskApiKey(openaiStored))
      setOpenaiKeyLoaded(true)
    }
    if (anthropicStored) {
      setAnthropicKey(maskApiKey(anthropicStored))
      setAnthropicKeyLoaded(true)
    }
  }, [])

  const maskApiKey = (key: string): string => {
    if (key.length <= 8) return key
    return key.slice(0, 8) + '...' + key.slice(-4)
  }

  const handleSaveKey = (provider: AIProvider, key: string) => {
    if (!key.trim()) {
      clearApiKey(provider)
      if (provider === 'openai') {
        setOpenaiKeyLoaded(false)
        setTestResults(prev => ({ ...prev, openai: null }))
      } else {
        setAnthropicKeyLoaded(false)
        setTestResults(prev => ({ ...prev, anthropic: null }))
      }
      return
    }

    saveApiKey(provider, key.trim())

    if (provider === 'openai') {
      setOpenaiKey(maskApiKey(key.trim()))
      setOpenaiKeyLoaded(true)
    } else {
      setAnthropicKey(maskApiKey(key.trim()))
      setAnthropicKeyLoaded(true)
    }
  }

  const handleTestKey = async (provider: AIProvider) => {
    const key = provider === 'openai' ? loadApiKey('openai') : loadApiKey('anthropic')

    if (!key) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { success: false, message: 'No API key configured' }
      }))
      return
    }

    setTesting(provider)
    setTestResults(prev => ({ ...prev, [provider]: null }))

    try {
      const result = await testApiKey({
        provider,
        apiKey: key,
        model: provider === 'openai' ? 'gpt-4-turbo-preview' : 'claude-3-5-sonnet-20241022',
      })

      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: result.success,
          message: result.success ? 'API key is valid' : result.error || 'Unknown error'
        }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          message: error instanceof Error ? error.message : 'Test failed'
        }
      }))
    } finally {
      setTesting(null)
    }
  }

  const handleClearKey = (provider: AIProvider) => {
    clearApiKey(provider)
    if (provider === 'openai') {
      setOpenaiKey('')
      setOpenaiKeyLoaded(false)
      setTestResults(prev => ({ ...prev, openai: null }))
    } else {
      setAnthropicKey('')
      setAnthropicKeyLoaded(false)
      setTestResults(prev => ({ ...prev, anthropic: null }))
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>AI Generator Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Configure API keys for AI-powered puzzle generation. Keys are stored locally in your browser.
        </p>

        {/* OpenAI Section */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>OpenAI (GPT-4)</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              API Key
            </label>
            <input
              type="text"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSaveKey('openai', openaiKey)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => handleTestKey('openai')}
              disabled={!openaiKeyLoaded || testing === 'openai'}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: openaiKeyLoaded ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: openaiKeyLoaded ? 'pointer' : 'not-allowed',
              }}
            >
              {testing === 'openai' ? 'Testing...' : 'Test'}
            </button>
            <button
              onClick={() => handleClearKey('openai')}
              disabled={!openaiKeyLoaded}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: openaiKeyLoaded ? '#dc3545' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: openaiKeyLoaded ? 'pointer' : 'not-allowed',
              }}
            >
              Clear
            </button>
          </div>
          {testResults.openai && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: testResults.openai.success ? '#d4edda' : '#f8d7da',
              color: testResults.openai.success ? '#155724' : '#721c24',
              borderRadius: '4px',
            }}>
              {testResults.openai.message}
            </div>
          )}
        </div>

        {/* Anthropic Section */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>Anthropic (Claude)</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              API Key
            </label>
            <input
              type="text"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSaveKey('anthropic', anthropicKey)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => handleTestKey('anthropic')}
              disabled={!anthropicKeyLoaded || testing === 'anthropic'}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: anthropicKeyLoaded ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: anthropicKeyLoaded ? 'pointer' : 'not-allowed',
              }}
            >
              {testing === 'anthropic' ? 'Testing...' : 'Test'}
            </button>
            <button
              onClick={() => handleClearKey('anthropic')}
              disabled={!anthropicKeyLoaded}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: anthropicKeyLoaded ? '#dc3545' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: anthropicKeyLoaded ? 'pointer' : 'not-allowed',
              }}
            >
              Clear
            </button>
          </div>
          {testResults.anthropic && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: testResults.anthropic.success ? '#d4edda' : '#f8d7da',
              color: testResults.anthropic.success ? '#155724' : '#721c24',
              borderRadius: '4px',
            }}>
              {testResults.anthropic.message}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <h4>Getting API Keys</h4>
          <ul style={{ fontSize: '0.9rem', color: '#666' }}>
            <li>
              <strong>OpenAI:</strong>{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                platform.openai.com/api-keys
              </a>
            </li>
            <li>
              <strong>Anthropic:</strong>{' '}
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
                console.anthropic.com/settings/keys
              </a>
            </li>
          </ul>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '1rem' }}>
            Note: Keys are stored only in your browser's localStorage and never sent to our servers.
            They are only used for direct API calls to OpenAI/Anthropic.
          </p>
        </div>
      </div>
    </div>
  )
}
