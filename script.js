class URLShortener {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname;
        this.dataUrl = './data/urls.json';
        this.urls = {};
        this.init();
    }

    async init() {
        // Check for redirect first, before loading URLs
        const hash = window.location.hash.substring(1);
        if (hash) {
            await this.loadUrls();
            this.handleRedirect();
            return; // Don't initialize the full interface if redirecting
        }
        
        // Normal initialization
        await this.loadUrls();
        this.bindEvents();
        this.loadRecentLinks();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateBtn');
        const longUrl = document.getElementById('longUrl');
        const copyBtn = document.getElementById('copyBtn');

        generateBtn.addEventListener('click', () => this.generateInstructions());
        longUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateInstructions();
            }
        });
        copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Input validation
        longUrl.addEventListener('input', () => this.validateInput());
    }

    validateInput() {
        const longUrl = document.getElementById('longUrl');
        const errorDiv = document.getElementById('error-message');
        
        if (longUrl.value && !this.isValidUrl(longUrl.value)) {
            errorDiv.textContent = 'Por favor, insira uma URL válida (deve começar com http:// ou https://)';
            errorDiv.classList.remove('hidden');
            return false;
        } else {
            errorDiv.classList.add('hidden');
            return true;
        }
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    async loadUrls() {
        try {
            const response = await fetch(this.dataUrl);
            if (response.ok) {
                this.urls = await response.json();
            } else {
                console.warn('Could not load URLs data, using empty dataset');
                this.urls = {};
            }
        } catch (error) {
            console.error('Error loading URLs:', error);
            this.urls = {};
        }
    }

    generateShortCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    generateInstructions() {
        const longUrlInput = document.getElementById('longUrl');
        const generateBtn = document.getElementById('generateBtn');
        const errorDiv = document.getElementById('error-message');
        const resultDiv = document.getElementById('result');

        const longUrl = longUrlInput.value.trim();

        if (!longUrl) {
            errorDiv.textContent = 'Por favor, insira uma URL';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (!this.validateInput()) {
            return;
        }

        // Check if URL already exists
        const existing = this.findExistingUrl(longUrl);
        if (existing) {
            this.displayExisting(longUrl, existing.shortCode);
            return;
        }

        // Generate unique short code
        let shortCode;
        do {
            shortCode = this.generateShortCode();
        } while (this.urls[shortCode]);

        // Display instructions
        this.displayInstructions(longUrl, shortCode);

        // Clear input
        longUrlInput.value = '';

        errorDiv.classList.add('hidden');
    }

    findExistingUrl(longUrl) {
        for (const [shortCode, data] of Object.entries(this.urls)) {
            if (data.originalUrl === longUrl) {
                return { shortCode, ...data };
            }
        }
        return null;
    }

    displayExisting(originalUrl, shortCode) {
        const shortUrl = `${this.baseUrl}#${shortCode}`;
        
        document.getElementById('originalUrl').textContent = originalUrl;
        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('instructions').classList.add('hidden');

        // No QR code for existing URLs to keep it simple
        document.getElementById('qrcode').innerHTML = '<p>URL já existente no repositório</p>';

        // Scroll to result
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    displayInstructions(originalUrl, shortCode) {
        const shortUrl = `${this.baseUrl}#${shortCode}`;
        
        document.getElementById('originalUrl').textContent = originalUrl;
        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('result').classList.remove('hidden');
        
        // Show instructions for manual addition
        const instructionsDiv = document.getElementById('instructions');
        instructionsDiv.innerHTML = `
            <div class="instructions-content">
                <h4>📝 Instruções para Adicionar a URL</h4>
                <p>Para tornar esta URL ativa, adicione a seguinte entrada ao arquivo <code>data/urls.json</code>:</p>
                <pre><code>"${shortCode}": {
  "originalUrl": "${originalUrl}",
  "createdAt": "${new Date().toISOString()}",
  "clicks": 0,
  "createdBy": "manual"
}</code></pre>
                <p><strong>Passos:</strong></p>
                <ol>
                    <li>Edite o arquivo <code>data/urls.json</code> no repositório</li>
                    <li>Adicione a entrada acima (não esqueça da vírgula se não for o último item)</li>
                    <li>Faça commit das mudanças</li>
                    <li>A URL estará ativa em alguns minutos</li>
                </ol>
                <a href="https://github.com/openviglet/shortener/edit/main/data/urls.json" target="_blank" class="edit-link">
                    ✏️ Editar arquivo no GitHub
                </a>
            </div>
        `;
        instructionsDiv.classList.remove('hidden');

        // Generate QR code for the potential URL
        this.generateQRCode(shortUrl);

        // Scroll to result
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async generateQRCode(url) {
        const qrDiv = document.getElementById('qrcode');
        qrDiv.innerHTML = '';

        try {
            if (typeof QRCode !== 'undefined') {
                await QRCode.toCanvas(qrDiv, url, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
            } else {
                // Fallback: create QR code using a free API service
                const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                qrDiv.innerHTML = `<img src="${qrApiUrl}" alt="QR Code" style="border: 1px solid #ddd; border-radius: 5px;" />`;
            }
        } catch (error) {
            // Another fallback: show a link to generate QR code manually
            qrDiv.innerHTML = `
                <p style="margin-bottom: 10px;">QR Code não disponível</p>
                <a href="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
                   target="_blank" 
                   style="color: #667eea; text-decoration: underline;">
                   Gerar QR Code
                </a>
            `;
            console.error('Error generating QR code:', error);
        }
    }

    copyToClipboard() {
        const shortUrl = document.getElementById('shortUrl').textContent;
        const copyBtn = document.getElementById('copyBtn');

        navigator.clipboard.writeText(shortUrl).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shortUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyBtn.textContent = '✓';
            setTimeout(() => {
                copyBtn.textContent = '📋';
            }, 2000);
        });
    }

    loadRecentLinks() {
        const recentLinksDiv = document.getElementById('recentLinks');

        if (Object.keys(this.urls).length === 0) {
            recentLinksDiv.innerHTML = '<p class="no-links">Nenhuma URL encurtada ainda. URLs são adicionadas manualmente via commits no repositório.</p>';
            return;
        }

        // Sort by creation date (newest first)
        const sortedUrls = Object.entries(this.urls).sort((a, b) => 
            new Date(b[1].createdAt) - new Date(a[1].createdAt)
        );

        const linksHtml = sortedUrls.map(([shortCode, data]) => {
            const shortUrl = `${this.baseUrl}#${shortCode}`;
            const createdDate = new Date(data.createdAt).toLocaleDateString('pt-BR');
            
            return `
                <div class="link-item">
                    <div class="link-info">
                        <div class="link-short">${shortUrl}</div>
                        <div class="link-original">${data.originalUrl}</div>
                        <small>Criado em: ${createdDate} • Cliques: ${data.clicks} • Por: ${data.createdBy || 'unknown'}</small>
                    </div>
                    <div class="link-actions">
                        <button onclick="urlShortener.copyLink('${shortUrl}')">Copiar</button>
                    </div>
                </div>
            `;
        }).join('');

        recentLinksDiv.innerHTML = linksHtml;
    }

    copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            // Could add toast notification here
            console.log('Link copied to clipboard');
        });
    }

    handleRedirect() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const urlData = this.urls[hash];
            
            if (urlData) {
                // Note: We can't increment click count since we can't write back to the repository
                // This would require a server-side component or manual updates
                
                // Show redirect message and redirect
                this.showRedirectMessage(urlData.originalUrl);
                setTimeout(() => {
                    window.location.href = urlData.originalUrl;
                }, 3000);
            } else {
                this.showErrorMessage('Link encurtado não encontrado ou ainda não foi adicionado ao repositório.');
            }
        }
    }

    showRedirectMessage(originalUrl) {
        document.body.innerHTML = `
            <div class="container">
                <div style="text-align: center; padding: 50px 20px;">
                    <h1>🔗 Redirecionando...</h1>
                    <p style="margin: 20px 0;">Você será redirecionado para:</p>
                    <p style="word-break: break-all; background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace;">${originalUrl}</p>
                    <p style="margin-top: 20px; color: #666;">Redirecionamento automático em 3 segundos...</p>
                    <a href="${originalUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Ir agora</a>
                </div>
            </div>
        `;
    }

    showErrorMessage(message) {
        document.body.innerHTML = `
            <div class="container">
                <div style="text-align: center; padding: 50px 20px;">
                    <h1>❌ Erro</h1>
                    <p style="margin: 20px 0; color: #c33;">${message}</p>
                    <p style="margin: 20px 0;">Para adicionar novas URLs, edite o arquivo <code>data/urls.json</code> no repositório.</p>
                    <a href="${this.baseUrl}" style="display: inline-block; margin: 10px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Voltar ao início</a>
                    <a href="https://github.com/openviglet/shortener/edit/main/data/urls.json" target="_blank" style="display: inline-block; margin: 10px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">Editar URLs</a>
                </div>
            </div>
        `;
    }
}

// Initialize the URL shortener when the page loads
let urlShortener;
document.addEventListener('DOMContentLoaded', async () => {
    urlShortener = new URLShortener();
});

// Handle browser back/forward navigation
window.addEventListener('hashchange', () => {
    if (!window.location.hash) {
        location.reload();
    }
});