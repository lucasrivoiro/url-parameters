// URL Parameters Safari Extension - Popup Script

class URLParser {
  constructor(urlString) {
    this.urlString = urlString;
    this.url = null;
    this.parseError = null;
    
    try {
      this.url = new URL(urlString);
    } catch (e) {
      this.parseError = e.message;
    }
  }

  isValid() {
    return this.url !== null;
  }

  getProtocol() {
    if (!this.url) return null;
    return this.url.protocol.replace(':', '');
  }

  getHost() {
    if (!this.url) return null;
    return this.url.hostname;
  }

  getPort() {
    if (!this.url) return null;
    return this.url.port || this.getDefaultPort();
  }

  getDefaultPort() {
    const protocol = this.getProtocol();
    const defaults = {
      'http': '80',
      'https': '443',
      'ftp': '21',
      'ssh': '22'
    };
    return defaults[protocol] || '';
  }

  getPath() {
    if (!this.url) return null;
    return this.url.pathname;
  }

  getPathSegments() {
    if (!this.url) return [];
    return this.url.pathname.split('/').filter(segment => segment.length > 0);
  }

  getQueryParams() {
    if (!this.url) return [];
    const params = [];
    this.url.searchParams.forEach((value, key) => {
      params.push({
        key: key,
        value: value,
        decoded: this.tryDecode(value)
      });
    });
    return params;
  }

  getHash() {
    if (!this.url) return null;
    return this.url.hash.replace('#', '');
  }

  getHashParams() {
    const hash = this.getHash();
    if (!hash || !hash.includes('=')) return [];
    
    const params = [];
    const pairs = hash.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params.push({
          key: key,
          value: value || '',
          decoded: this.tryDecode(value || '')
        });
      }
    });
    return params;
  }

  getUsername() {
    if (!this.url) return null;
    return this.url.username;
  }

  getPassword() {
    if (!this.url) return null;
    return this.url.password;
  }

  tryDecode(value) {
    try {
      const decoded = decodeURIComponent(value);
      return decoded !== value ? decoded : null;
    } catch {
      return null;
    }
  }

  getOrigin() {
    if (!this.url) return null;
    return this.url.origin;
  }
}

class PopupUI {
  constructor() {
    this.contentEl = document.getElementById('content');
    this.urlDisplayEl = document.getElementById('urlDisplay');
    this.noUrlEl = document.getElementById('noUrl');
    this.copyAllBtn = document.getElementById('copyAll');
    this.toastEl = document.getElementById('toast');
    this.currentUrl = null;
    
    this.init();
  }

  async init() {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0 && tabs[0].url) {
        this.currentUrl = tabs[0].url;
        this.parseAndDisplay(this.currentUrl);
      } else {
        this.showNoUrl();
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
      this.showNoUrl();
    }

    this.copyAllBtn.addEventListener('click', () => this.copyToClipboard(this.currentUrl, this.copyAllBtn));
  }

  parseAndDisplay(urlString) {
    const parser = new URLParser(urlString);
    
    if (!parser.isValid()) {
      this.showNoUrl();
      return;
    }

    this.urlDisplayEl.textContent = urlString;
    this.contentEl.innerHTML = '';

    // Protocol, Host, Port section
    this.addSection('Conexão', [
      { key: 'Protocolo', value: parser.getProtocol() },
      { key: 'Host', value: parser.getHost() },
      { key: 'Porta', value: parser.getPort() || '(padrão)' },
      { key: 'Origem', value: parser.getOrigin() }
    ].filter(item => item.value));

    // Authentication (if present)
    const username = parser.getUsername();
    const password = parser.getPassword();
    if (username || password) {
      this.addSection('Autenticação', [
        { key: 'Usuário', value: username },
        { key: 'Senha', value: password ? '••••••••' : null, realValue: password }
      ].filter(item => item.value));
    }

    // Path section
    const pathSegments = parser.getPathSegments();
    if (pathSegments.length > 0) {
      this.addSection('Caminho', [
        { key: 'Path Completo', value: parser.getPath() },
        ...pathSegments.map((segment, index) => ({
          key: `Segmento ${index + 1}`,
          value: segment,
          decoded: parser.tryDecode(segment)
        }))
      ], pathSegments.length);
    }

    // Query Parameters section
    const queryParams = parser.getQueryParams();
    if (queryParams.length > 0) {
      const items = queryParams.map(param => ({
        key: param.key,
        value: param.value,
        decoded: param.decoded
      }));
      this.addSection('Query String', items, queryParams.length);
    }

    // Hash/Fragment section
    const hash = parser.getHash();
    if (hash) {
      const hashParams = parser.getHashParams();
      if (hashParams.length > 0) {
        const items = hashParams.map(param => ({
          key: param.key,
          value: param.value,
          decoded: param.decoded
        }));
        this.addSection('Fragmento (Hash)', [
          { key: 'Hash Completo', value: hash },
          ...items
        ], hashParams.length);
      } else {
        this.addSection('Fragmento (Hash)', [
          { key: 'Hash', value: hash }
        ]);
      }
    }
  }

  addSection(title, items, badgeCount = null) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <div class="section-title">
        ${title}
        ${badgeCount ? `<span class="section-badge">${badgeCount}</span>` : ''}
      </div>
      <span class="section-toggle">›</span>
    `;

    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });

    const content = document.createElement('div');
    content.className = 'section-content';

    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item';

      const copyValue = item.realValue || item.value;

      itemEl.innerHTML = `
        <div class="item-info">
          <div class="item-key">${this.escapeHtml(item.key)}</div>
          <div class="item-value">${this.escapeHtml(item.value)}</div>
          ${item.decoded ? `<div class="item-value decoded">↳ ${this.escapeHtml(item.decoded)}</div>` : ''}
        </div>
        <button class="copy-btn" title="Copiar valor">⎘</button>
      `;

      const copyBtn = itemEl.querySelector('.copy-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copyToClipboard(copyValue, copyBtn);
      });

      content.appendChild(itemEl);
    });

    section.appendChild(header);
    section.appendChild(content);
    this.contentEl.appendChild(section);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async copyToClipboard(text, buttonEl) {
    try {
      await navigator.clipboard.writeText(text);
      
      // Visual feedback on button
      const originalHtml = buttonEl.innerHTML;
      buttonEl.classList.add('copied');
      buttonEl.innerHTML = '✓';

      // Show toast
      this.showToast('Copiado para a área de transferência!');

      setTimeout(() => {
        buttonEl.classList.remove('copied');
        buttonEl.innerHTML = originalHtml;
      }, 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showToast('Erro ao copiar');
    }
  }

  showToast(message) {
    this.toastEl.textContent = message;
    this.toastEl.classList.remove('hidden');
    this.toastEl.classList.add('show');

    setTimeout(() => {
      this.toastEl.classList.remove('show');
      setTimeout(() => {
        this.toastEl.classList.add('hidden');
      }, 300);
    }, 2000);
  }

  showNoUrl() {
    this.contentEl.classList.add('hidden');
    this.urlDisplayEl.classList.add('hidden');
    this.copyAllBtn.classList.add('hidden');
    this.noUrlEl.classList.remove('hidden');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupUI();
});
