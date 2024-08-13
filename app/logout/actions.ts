'use server'

export async function logout() {
    const { redirect } = require('next/navigation')
    const { createClient } = require('@/utils/supabase/server')

    
    const supabase = createClient()
    
    await supabase.auth.signOut()
    
    redirect('/')
    }

