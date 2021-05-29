import { client } from '../database'

// ------------------------------------
// Queries
// ------------------------------------

const getDemo = async () => {
  return { id: 1000, name: 'Hi Demo', email: 'demo123@demo.com' }
}

const getMe = async (context) => {
  console.log('[##] user', context.user)
  const {
    rows: [user],
  } = await client.query(
    `SELECT * FROM users WHERE email = ${context.user.email}`,
  )
  return user
}

// ------------------------------------
// Mutations
// ------------------------------------

const updateMe = async ({ name }, context) => {
  console.log('[##] user', context.user)
  const {
    rows: [user],
  } = await client.query(
    `UPDATE users SET name=${name} WHERE email = ${context.user.email} RETURNING *`,
  )
  return user
}

const createUser = async ({ name, email }, context) => {
  console.log('[##] user', context.user)
  const {
    rows: [user],
  } = await client.query(
    `INSERT INTO users(name, email) VALUES (${name}, ${email}) RETURNING *`,
  )
  return user
}

export default {
  getDemo,
  getMe,
  updateMe,
  createUser,
}
