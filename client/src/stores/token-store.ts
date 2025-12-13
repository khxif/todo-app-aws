class TokenStorage {
  set(token: string) {
    localStorage.setItem('@todo-app/token', token);
  }

  get() {
    return localStorage.getItem('@todo-app/token');
  }

  clear() {
    localStorage.removeItem('@todo-app/token');
  }
}

export const tokenStorage = new TokenStorage();
