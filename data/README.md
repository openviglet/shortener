# Dados das URLs Encurtadas

Este diretório contém os dados das URLs encurtadas armazenados em formato JSON. Com Jekyll, estes dados são processados **server-side** durante o build para gerar páginas individuais de redirecionamento.

## Estrutura dos Dados

### urls.json
Contém o mapeamento de códigos curtos para URLs originais:

```json
{
  "abc123": {
    "originalUrl": "https://example.com/very/long/url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "clicks": 0,
    "createdBy": "manual"
  }
}
```

## Como Funciona com Jekyll

1. **Build Time**: Jekyll lê este arquivo durante o processo de build
2. **Geração de Páginas**: O plugin Ruby (`_plugins/url_generator.rb`) cria uma página individual para cada código curto
3. **Redirecionamento**: Cada página usa meta-refresh e JavaScript para redirecionamento imediato
4. **URLs Resultantes**: `https://seudominio.com/shortener/abc123` → redireciona para a URL original

## Como Adicionar Novas URLs

Para adicionar uma nova URL encurtada, siga estes passos:

1. Edite o arquivo `urls.json`
2. Adicione uma nova entrada com um código único (6 caracteres alfanuméricos)
3. Faça commit das mudanças no repositório
4. O GitHub Actions irá automaticamente rebuild o site Jekyll
5. As URLs estarão disponíveis em alguns minutos

### Exemplo de Adição Manual

```json
{
  "github": {
    "originalUrl": "https://github.com/openviglet/shortener",
    "createdAt": "2024-12-19T22:00:00.000Z",
    "clicks": 0,
    "createdBy": "manual"
  }
}
```

Isso criará a URL encurtada: `https://openviglet.github.io/shortener/github`

## Notas Importantes

- Códigos devem ser únicos
- URLs devem começar com `http://` ou `https://`
- O contador de cliques é mantido apenas para referência (não é atualizado automaticamente)
- Mantenha o formato JSON válido para evitar erros no build Jekyll
- Após fazer commit, aguarde alguns minutos para o GitHub Actions rebuild o site