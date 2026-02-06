# URL Parameters - Extensão Safari

*Leia em outros idiomas: [English](README.md), [Español](README.es.md)*

Uma extensão para Safari que analisa a URL da aba atual, exibindo seus componentes de forma organizada com opção de copiar cada item para a área de transferência.

## Funcionalidades

- **Análise completa da URL**: Exibe todos os componentes da URL de forma organizada
  - Protocolo (http, https, etc.)
  - Host/Domínio
  - Porta
  - Caminho (path) e segmentos
  - Query strings (parâmetros GET)
  - Fragmentos (hash)
  - Autenticação (quando presente)

- **Decodificação automática**: Valores codificados em URL são automaticamente decodificados e exibidos

- **Copiar para área de transferência**: Cada item possui um botão para copiar o valor

- **Interface nativa**: Design que segue o estilo visual do macOS/Safari, com suporte a modo escuro

## Instalação

### Pré-requisitos

- macOS 11.0 ou superior
- Xcode 12.0 ou superior
- Safari 14.0 ou superior

### Passo a Passo

1. **Preparar o Xcode (primeira vez)**

   Se for a primeira vez usando o Xcode ou após uma atualização, execute:

   ```bash
   xcodebuild -runFirstLaunch
   ```

2. **Converter para projeto Xcode**

   Navegue até a pasta do projeto e execute:

   ```bash
   cd url-parameters
   xcrun safari-web-extension-converter . --project-location ../ --app-name "URL Parameters" --bundle-identifier com.seudominio.urlparameters
   ```

   Este comando criará um projeto Xcode na pasta pai com a estrutura necessária para uma Safari Web Extension.

3. **Abrir no Xcode**

   ```bash
   open "../URL Parameters/URL Parameters.xcodeproj"
   ```

4. **Configurar o projeto**

   - Clique no projeto "URL Parameters" no painel esquerdo (ícone azul)
   - Selecione o target "URL Parameters" 
   - Vá na aba "Signing & Capabilities"
   - Em "Team", selecione seu Apple ID (ou adicione uma conta)
   - Repita para o target "URL Parameters Extension"

5. **Compilar e executar**

   - Pressione `Cmd + R` para compilar e executar
   - O app será instalado e você poderá habilitar a extensão no Safari

6. **Habilitar no Safari**

   - Abra Safari → Ajustes → Extensões
   - Marque a caixa "URL Parameters"
   - Permita a extensão em todos os sites ou nos sites desejados

### Modo Desenvolvedor (para testes)

Se quiser testar sem assinar com Apple ID:

1. Safari → Ajustes → Avançado → Mostrar menu Desenvolvedor
2. Desenvolvedor → Permitir extensões não assinadas
3. Recompile o projeto no Xcode

## Estrutura do Projeto

```
url-parameters/
├── manifest.json              # Configuração da extensão
├── background.js              # Script de background
├── popup/
│   ├── popup.html            # Interface do popup
│   ├── popup.css             # Estilos (com suporte a dark mode)
│   └── popup.js              # Lógica de análise da URL
├── icons/
│   ├── icon.svg              # Ícone fonte (SVG) - light mode
│   ├── icon-dark.svg         # Ícone fonte (SVG) - dark mode
│   ├── icon-16.png           # Ícones em vários tamanhos
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-256.png
│   ├── icon-512.png
│   ├── icon-*-dark.png       # Ícones dark mode
│   └── generate-icons.sh     # Script para regenerar ícones
├── update-xcode-icons.sh     # Script para atualizar ícones no Xcode
└── README.md
```

## Uso

1. Navegue para qualquer página no Safari
2. Clique no ícone da extensão na barra de ferramentas
3. Veja a URL esmiuçada em suas partes
4. Clique no botão de copiar (⎘) para copiar qualquer valor
5. Use o botão "Copiar URL" para copiar a URL completa

## Exemplos

Para uma URL como:
```
https://example.com:8080/api/users?name=Jo%C3%A3o&age=30#section1
```

A extensão exibirá:

| Componente | Valor |
|------------|-------|
| Protocolo | https |
| Host | example.com |
| Porta | 8080 |
| Path | /api/users |
| Segmento 1 | api |
| Segmento 2 | users |
| name | João (decodificado de Jo%C3%A3o) |
| age | 30 |
| Hash | section1 |

## Desenvolvimento

### Regenerar ícones

Se modificar o ícone SVG, regenere os PNGs:

```bash
cd icons
./generate-icons.sh
```

Para instalar a ferramenta de conversão (opcional, melhora qualidade):

```bash
brew install librsvg
```

### Atualizar ícones no Xcode

Após regenerar os ícones, atualize-os no projeto Xcode:

```bash
./update-xcode-icons.sh
```

### Testar alterações

Após fazer alterações nos arquivos web (HTML, CSS, JS):

1. No Xcode, limpe o build: `Cmd + Shift + K`
2. Recompile: `Cmd + R`
3. Se necessário, no Safari desabilite e reabilite a extensão

### Solução de Problemas

**Erro "A required plugin failed to load":**
```bash
xcodebuild -runFirstLaunch
```

**Extensão não aparece no Safari:**
1. Verifique se o app está rodando (aparece no Dock)
2. Vá em Safari → Ajustes → Extensões e habilite

**Ícone não atualiza:**
1. Limpe o build no Xcode (`Cmd + Shift + K`)
2. Delete o app em ~/Library/Containers/
3. Recompile

## Licença

MIT License - sinta-se livre para usar e modificar.

## Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.
