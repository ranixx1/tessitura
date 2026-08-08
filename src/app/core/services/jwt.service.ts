import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    private readonly storage: StorageService
  ) {}

  setToken(token: string): void {
    this.storage.set(STORAGE_KEYS.TOKEN, token);
  }

  getToken(): string | null {
    return this.storage.get(STORAGE_KEYS.TOKEN);
  }

  clearToken(): void {
    this.storage.remove(STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isExpired(token);
  }

  isExpired(token = this.getToken()): boolean {
    if (!token) {
      return true;
    }

    const payload = this.decode(token);

    if (!payload?.exp) {
      return true;
    }

    return Date.now() >= payload.exp * 1000;
  }

  getPayload(): JwtPayload | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    return this.decode(token);
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  getUsername(): string | null {
    return this.getPayload()?.sub ?? null;
  }

  getEmail(): string | null {
    return this.getPayload()?.email ?? null;
  }

  private decode(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];

      if (!payload) {
        return null;
      }

      const normalized = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(normalized)) as JwtPayload;
    } catch {
      return null;
    }
  }
}