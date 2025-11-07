class AppLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:system-ui,Segoe UI,Roboto,Arial;max-width:420px;margin:0 auto}
        .card{background:#fff;padding:20px;border-radius:12px;box-shadow:0 6px 18px rgba(16,24,40,0.06)}
        h2{margin:0 0 12px;font-size:1.125rem}
        form{display:flex;flex-direction:column;gap:10px}
        input{padding:10px;border-radius:8px;border:1px solid #e5e7eb;font-size:0.95rem}
        .actions{display:flex;gap:8px;align-items:center}
        button{padding:10px 12px;border-radius:8px;border:0;background:#2563eb;color:#fff;font-weight:600;cursor:pointer}
        .link{background:transparent;border:1px solid rgba(37,99,235,0.12);color:#2563eb}
        .error{color:#b91c1c;font-size:0.9rem}
      </style>
      <div class="card">
        <h2>Iniciar sesión</h2>
        <form id="form" novalidate>
          <input id="email" type="email" placeholder="Correo electrónico" required />
          <input id="password" type="password" placeholder="Contraseña" required minlength="6" />
          <div class="error" id="error" aria-live="polite"></div>
          <div class="actions">
            <button type="submit">Entrar</button>
            <button type="button" class="link" id="signup">Crear cuenta</button>
          </div>
        </form>
      </div>
    `;
  }

  connectedCallback() {
    this._form = this.shadowRoot.getElementById('form');
    this._email = this.shadowRoot.getElementById('email');
    this._password = this.shadowRoot.getElementById('password');
    this._error = this.shadowRoot.getElementById('error');
    this._signup = this.shadowRoot.getElementById('signup');

    this._form.addEventListener('submit', this._onSubmit.bind(this));
    this._signup.addEventListener('click', this._onSignup.bind(this));
  }

  _onSubmit(e) {
    e.preventDefault();
    this._error.textContent = '';
    const email = this._email.value.trim();
    const password = this._password.value;
    if (!email || !password) {
      this._error.textContent = 'Completa todos los campos.';
      return;
    }
    if (password.length < 6) {
      this._error.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.dispatchEvent(new CustomEvent('app-login', {
      detail: { email, password },
      bubbles: true,
      composed: true
    }));
  }

  _onSignup() {
    this.dispatchEvent(new CustomEvent('app-signup', { bubbles: true, composed: true }));
  }
}

customElements.define('app-login', AppLogin);
