import { client } from '../database'

const getMe = async (context) => {
  console.log('[##] context', context)
  const {
    rows: [user],
  } = await client.query('SELECT * FROM users WHERE id = 1')
  return user
}

const updateMe = async ({ id, name }) => {
  const {
    rows: [user],
  } = await client.query(
    `UPDATE users SET name=${name} WHERE id = ${id} RETURNING *`,
  )
  return user
}

export default {
  getMe,
  updateMe,
}
