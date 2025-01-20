'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'


export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  useEffect(() => {
    // Avoid running if there's no user
    if (!user) return

    const getProfile = async () => {
      try {
        setLoading(true)
        console.log(user?.id)

        const { data, error, status } = await supabase
          .from('profiles')
          .select(`full_name, username, website`)
          .eq('id', user?.id)
          .single()

        if (error && status !== 406) {
          console.log(error)
          throw error
        }

        if (data) {
          setFullname(data.full_name)
          setUsername(data.username)
          setWebsite(data.website)
        }
      } catch (error) {
        alert('Error loading user data!')
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [user, supabase])

  async function updateProfile({username, fullname, website,}: {
    username: string | null
    fullname: string | null
    website: string | null
  
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      {/* Render form fields here */}
      <div>
        <label htmlFor="email">Email</label>
        <input className="text-black" id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          className="text-black"
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          className="text-black"
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          className="text-black"
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, website })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
