# Dados das URLs Encurtadas

Este diretório contém os dados das URLs encurtadas armazenados em formato JSON.

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

## Como Adicionar Novas URLs

Para adicionar uma nova URL encurtada, siga estes passos:

1. Edite o arquivo `urls.json`
2. Adicione uma nova entrada com um código único (6 caracteres alfanuméricos)
3. Faça commit das mudanças no repositório
4. As URLs estarão disponíveis imediatamente no site

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

Isso criará a URL encurtada: `https://openviglet.github.io/shortener/#github`

## Notas Importantes

- Códigos devem ser únicos
- URLs devem começar com `http://` ou `https://`
- O contador de cliques será atualizado automaticamente (se implementado)
- Mantenha o formato JSON válido para evitar erros