class URLShortener {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname;
        this.storageKey = 'shortened_urls';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecentLinks();
        this.handleRedirect();
    }

    bindEvents() {
        const shortenBtn = document.getElementById('shortenBtn');
        const longUrl = document.getElementById('longUrl');
        const copyBtn = document.getElementById('copyBtn');
        const clearDataBtn = document.getElementById('clearData');

        shortenBtn.addEventListener('click', () => this.shortenUrl());
        longUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.shortenUrl();
            }
        });
        copyBtn.addEventListener('click', () => this.copyToClipboard());
        clearDataBtn.addEventListener('click', () => this.clearAllData());

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

    generateShortCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async shortenUrl() {
        const longUrlInput = document.getElementById('longUrl');
        const shortenBtn = document.getElementById('shortenBtn');
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

        // Check if URL is already shortened
        const existing = this.findExistingUrl(longUrl);
        if (existing) {
            this.displayResult(longUrl, existing.shortCode);
            return;
        }

        // Show loading state
        shortenBtn.disabled = true;
        shortenBtn.textContent = 'Encurtando...';
        errorDiv.classList.add('hidden');

        try {
            // Generate unique short code
            let shortCode;
            do {
                shortCode = this.generateShortCode();
            } while (this.getStoredUrls()[shortCode]);

            // Store the mapping
            this.storeUrl(shortCode, longUrl);

            // Display result
            this.displayResult(longUrl, shortCode);

            // Clear input
            longUrlInput.value = '';

            // Update recent links
            this.loadRecentLinks();

        } catch (error) {
            errorDiv.textContent = 'Erro ao encurtar URL. Tente novamente.';
            errorDiv.classList.remove('hidden');
            console.error('Error shortening URL:', error);
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.textContent = 'Encurtar';
        }
    }

    findExistingUrl(longUrl) {
        const urls = this.getStoredUrls();
        for (const [shortCode, data] of Object.entries(urls)) {
            if (data.originalUrl === longUrl) {
                return { shortCode, ...data };
            }
        }
        return null;
    }

    displayResult(originalUrl, shortCode) {
        const shortUrl = `${this.baseUrl}#${shortCode}`;
        
        document.getElementById('originalUrl').textContent = originalUrl;
        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('result').classList.remove('hidden');

        // Generate QR code
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

    storeUrl(shortCode, originalUrl) {
        const urls = this.getStoredUrls();
        urls[shortCode] = {
            originalUrl,
            createdAt: new Date().toISOString(),
            clicks: 0
        };
        localStorage.setItem(this.storageKey, JSON.stringify(urls));
    }

    getStoredUrls() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return {};
        }
    }

    loadRecentLinks() {
        const urls = this.getStoredUrls();
        const recentLinksDiv = document.getElementById('recentLinks');

        if (Object.keys(urls).length === 0) {
            recentLinksDiv.innerHTML = '<p class="no-links">Nenhuma URL encurtada ainda.</p>';
            return;
        }

        // Sort by creation date (newest first)
        const sortedUrls = Object.entries(urls).sort((a, b) => 
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
                        <small>Criado em: ${createdDate} • Cliques: ${data.clicks}</small>
                    </div>
                    <div class="link-actions">
                        <button onclick="urlShortener.copyLink('${shortUrl}')">Copiar</button>
                        <button onclick="urlShortener.deleteLink('${shortCode}')" class="delete-btn">Excluir</button>
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

    deleteLink(shortCode) {
        if (confirm('Tem certeza que deseja excluir este link encurtado?')) {
            const urls = this.getStoredUrls();
            delete urls[shortCode];
            localStorage.setItem(this.storageKey, JSON.stringify(urls));
            this.loadRecentLinks();
        }
    }

    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem(this.storageKey);
            this.loadRecentLinks();
            document.getElementById('result').classList.add('hidden');
        }
    }

    handleRedirect() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const urls = this.getStoredUrls();
            const urlData = urls[hash];
            
            if (urlData) {
                // Increment click count
                urlData.clicks++;
                urls[hash] = urlData;
                localStorage.setItem(this.storageKey, JSON.stringify(urls));
                
                // Show redirect message and redirect
                this.showRedirectMessage(urlData.originalUrl);
                setTimeout(() => {
                    window.location.href = urlData.originalUrl;
                }, 3000);
            } else {
                this.showErrorMessage('Link encurtado não encontrado ou expirado.');
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
                    <a href="${this.baseUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Voltar ao início</a>
                </div>
            </div>
        `;
    }
}

// Initialize the URL shortener when the page loads
let urlShortener;
document.addEventListener('DOMContentLoaded', () => {
    urlShortener = new URLShortener();
});

// Handle browser back/forward navigation
window.addEventListener('hashchange', () => {
    if (!window.location.hash) {
        location.reload();
    }
});