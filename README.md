# 🔗 Encurtador de URL - OpenViglet

Um encurtador de URL simples, gratuito e open source que funciona inteiramente no GitHub Pages com Jekyll. Agora com **processamento server-side** para redirecionamentos mais rápidos e confiáveis.

## ✨ Características

- **Gratuito e Open Source**: Licenciado sob Apache 2.0
- **Processamento Server-Side**: Jekyll gera páginas de redirecionamento individuais para cada URL
- **Compatível com GitHub Pages**: Build automático com Jekyll
- **Interface em Português**: Interface limpa e intuitiva
- **QR Code automático**: Gera QR codes para URLs encurtadas
- **Histórico local**: Mantém histórico das URLs encurtadas no navegador
- **Responsivo**: Funciona em desktop e mobile
- **URLs personalizadas**: Gera códigos aleatórios de 6 caracteres
- **Redirecionamento rápido**: Usa meta-refresh e JavaScript para redirecionamento imediato
- **Estatísticas básicas**: Contador de cliques para cada URL

## 🏗️ Como Funciona (Jekyll)

1. **Adição de URLs**: URLs são adicionadas manualmente editando `data/urls.json`
2. **Build Process**: Jekyll lê o arquivo JSON e gera páginas individuais para cada código curto
3. **Redirecionamento**: Cada `/codigo` possui sua própria página HTML com redirecionamento automático
4. **Interface**: A página principal permite gerar instruções para novas URLs

## 🛠️ Instalação local

### Pré-requisitos
- Ruby 3.0+ 
- Jekyll 4.0+
- Git

### Executar localmente
1. Clone o repositório:
```bash
git clone https://github.com/openviglet/shortener.git
cd shortener
```

2. Instale as dependências:
```bash
bundle install
```

3. Execute o Jekyll:
```bash
bundle exec jekyll serve
```

4. Acesse `http://localhost:4000/shortener/`

## 🏗️ Implantação no GitHub Pages

### Configuração automática:
1. Faça fork deste repositório
2. Vá em Settings → Pages
3. Selecione "Deploy from a branch"
4. Escolha a branch `main` e pasta `/ (root)`
5. Clique em "Save"
6. Sua URL será: `https://seuusuario.github.io/shortener`

O GitHub Actions irá automaticamente:
- Instalar Ruby e Jekyll
- Executar `bundle install`
- Executar `bundle exec jekyll build`
- Publicar os arquivos gerados

### Configuração personalizada:
1. Edite `_config.yml` para ajustar a URL base
2. Modifique `assets/js/script.js` se necessário para URLs personalizadas
3. Faça commit e push das alterações

## 📁 Estrutura do projeto

```
shortener/
├── _layouts/           # Layouts Jekyll
│   ├── default.html    # Layout principal
│   └── redirect.html   # Layout para páginas de redirecionamento
├── _plugins/           # Plugins Jekyll
│   └── url_generator.rb # Gerador de páginas de redirecionamento
├── assets/js/          # JavaScript assets
│   └── script.js       # Lógica JavaScript principal
├── data/               # Dados das URLs
│   ├── urls.json       # Arquivo JSON com URLs encurtadas
│   └── README.md       # Documentação dos dados
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── _config.yml         # Configuração Jekyll
├── Gemfile             # Dependências Ruby
├── README.md           # Documentação
└── LICENSE             # Licença Apache 2.0
```

## 🔧 Tecnologias utilizadas

- **Jekyll 4.0+**: Gerador de sites estáticos
- **Ruby**: Linguagem de programação para plugins Jekyll
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com Flexbox/Grid
- **JavaScript ES6+**: Lógica de negócio no cliente
- **QRCode.js**: Geração de QR codes
- **GitHub Pages**: Hospedagem gratuita com build automático
- **GitHub Actions**: CI/CD para build e deploy

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