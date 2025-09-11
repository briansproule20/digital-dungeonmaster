import { supabase, Hero, CreateHeroInput } from './supabase'

export class HeroService {
  // Get all heroes for a user
  static async getHeroes(userId: string): Promise<Hero[]> {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching heroes:', error)
      throw error
    }

    return data || []
  }

  // Get a specific hero by ID
  static async getHero(heroId: string, userId: string): Promise<Hero | null> {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .eq('id', heroId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching hero:', error)
      return null
    }

    return data
  }

  // Create a new hero
  static async createHero(userId: string, heroData: CreateHeroInput): Promise<Hero | null> {
    const { data, error } = await supabase
      .from('heroes')
      .insert([
        {
          ...heroData,
          user_id: userId
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating hero:', error)
      throw error
    }

    return data
  }

  // Update a hero
  static async updateHero(heroId: string, userId: string, updates: Partial<CreateHeroInput>): Promise<Hero | null> {
    const { data, error } = await supabase
      .from('heroes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', heroId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating hero:', error)
      throw error
    }

    return data
  }

  // Delete a hero
  static async deleteHero(heroId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('heroes')
      .delete()
      .eq('id', heroId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting hero:', error)
      return false
    }

    return true
  }
}