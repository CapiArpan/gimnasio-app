// src/features/auth/components/AuthGuard.jsx
import { useEffect, useState } from 'react'
import { supabase } from "./lib/supabaseClient"
import { useNavigate } from 'react-router-dom'

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/') // si no hay sesión, volver al login
      }
      setLoading(false)
    }

    checkSession()

    // Escucha cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/')
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return children
}
