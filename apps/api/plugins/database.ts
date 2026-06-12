import { runMigrations } from '../db/migrations'

/** Bring the database up to the current schema before any request lands. */
export default defineNitroPlugin(() => {
  runMigrations()
})
