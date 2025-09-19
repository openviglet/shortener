# 🔗 Encurtador de URL - OpenViglet

Um encurtador de URL simples, gratuito e que funciona inteiramente no GitHub Pages. Não requer servidor backend - toda a funcionalidade é implementada no lado do cliente usando JavaScript e localStorage.

## ✨ Características

- **Gratuito e Open Source**: Licenciado sob Apache 2.0
- **Sem servidor necessário**: Funciona inteiramente no GitHub Pages
- **Interface em Português**: Interface limpa e intuitiva
- **QR Code automático**: Gera QR codes para URLs encurtadas
- **Histórico local**: Mantém histórico das URLs encurtadas no navegador
- **Responsivo**: Funciona em desktop e mobile
- **URLs personalizadas**: Gera códigos aleatórios de 6 caracteres
- **Estatísticas básicas**: Contador de cliques para cada URL

## 🚀 Como usar

### Acesso online
Visite: `https://openviglet.github.io/shortener`

### Para encurtar uma URL:
1. Cole a URL longa no campo de entrada
2. Clique em "Encurtar"
3. Copie a URL encurtada gerada
4. Use o QR code se necessário

### Para acessar uma URL encurtada:
- Acesse a URL encurtada no navegador
- Você será redirecionado automaticamente após 3 segundos
- Ou clique em "Ir agora" para redirecionamento imediato

## 🛠️ Instalação local

### Pré-requisitos
- Navegador web moderno
- Servidor web local (opcional, para desenvolvimento)

### Executar localmente
1. Clone o repositório:
```bash
git clone https://github.com/openviglet/shortener.git
cd shortener
```

2. Abra `index.html` no navegador ou execute um servidor local:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

3. Acesse `http://localhost:8000`

## 🏗️ Implantação no GitHub Pages

### Configuração automática:
1. Faça fork deste repositório
2. Vá em Settings → Pages
3. Selecione "Deploy from a branch"
4. Escolha a branch `main` e pasta `/ (root)`
5. Clique em "Save"
6. Sua URL será: `https://seuusuario.github.io/shortener`

### Configuração personalizada:
1. Edite `_config.yml` para ajustar a URL base
2. Modifique `script.js` se necessário para URLs personalizadas
3. Faça commit e push das alterações

## 📁 Estrutura do projeto

```
shortener/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── 404.html           # Página de redirecionamento
├── _config.yml        # Configuração Jekyll/GitHub Pages  
├── README.md          # Documentação
└── LICENSE            # Licença Apache 2.0
```

## 🔧 Tecnologias utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com Flexbox/Grid
- **JavaScript ES6+**: Lógica de negócio
- **LocalStorage API**: Armazenamento local
- **QRCode.js**: Geração de QR codes
- **GitHub Pages**: Hospedagem gratuita

## 🎨 Personalização

### Alterar cores:
Edite as variáveis CSS em `styles.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### Modificar domínio base:
Edite `script.js` na linha da propriedade `baseUrl`:
```javascript
this.baseUrl = 'https://seudominio.com/';
```

### Customizar comprimento do código:
Modifique a função `generateShortCode()` em `script.js`:
```javascript
for (let i = 0; i < 8; i++) { // Altere 6 para 8 para códigos mais longos
```

## 🔒 Limitações e considerações

### Armazenamento:
- URLs são armazenadas no localStorage do navegador
- Dados são específicos por domínio/navegador
- Limite do localStorage: ~5-10MB por domínio

### Escalabilidade:
- Adequado para uso pessoal/pequeno
- Para uso empresarial, considere soluções com backend

### Segurança:
- Não valida conteúdo das URLs de destino
- URLs maliciosas podem ser encurtadas
- Implemente validação adicional se necessário

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Ideias para contribuição:
- [ ] Sistema de expiração de URLs
- [ ] Estatísticas mais detalhadas
- [ ] Integração com APIs de QR code
- [ ] Temas personalizáveis
- [ ] Importação/exportação de dados
- [ ] PWA (Progressive Web App)
- [ ] Análise de URLs maliciosas

## 📄 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **OpenViglet Team** - [GitHub](https://github.com/openviglet)

## 🙏 Reconhecimentos

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - Geração de QR codes
- [GitHub Pages](https://pages.github.com/) - Hospedagem gratuita
- Comunidade open source

---

⭐ **Se este projeto foi útil, considere dar uma estrela no GitHub!**