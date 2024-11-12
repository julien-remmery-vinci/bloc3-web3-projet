import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const user = await client.from('Users').select().single()
  const body = await readBody(event)
  return { body }
})
