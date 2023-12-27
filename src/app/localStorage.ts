import { EntityState } from '@reduxjs/toolkit'
import { Favorite } from '../features/favorite/favoriteSlice'

export class LocalStorageService {
  static saveState(state: EntityState<Favorite>): void {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem('favorite', serializedState)
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error)
    }
  }

  static loadState(): undefined | EntityState<Favorite> {
    const serializedState = localStorage.getItem('favorite')
    if (serializedState === null) {
      return undefined
    }

    try {
      return JSON.parse(serializedState)
    } catch (error) {
      return undefined
    }
  }
}
