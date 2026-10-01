# teciteca-ifrn
Teciteca Virtual

## Desenvolvimento

Requisitos: Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Para validar a versão de produção localmente:

```bash
npm run build
npm run preview
```

## Como publicar o site no servidor do IFRN
### Linux
1. Baixe o código deste repositório:
    ```bash
    git clone 'link para este repositório'
    ```

1. Acesse o diretório do projeto e gere a versão de produção:
    ```bash
    cd teciteca-ifrn
    npm install
    npm run build
    ```

1. Envie o conteúdo de `dist/` ao servidor. Primeiro, conecte-se ao servidor via `sftp`:
    ```bash
    sftp -P 22 teciteca@www2.ifrn.edu.br
    ```
    No prompt do SFTP, execute:
    ```text
    put -r dist/* public_html/
    ```

1. Informe a senha que lhe foi passada pela coordenação do projeto e aguarde o upload dos arquivos.

1. Acesse https://www2.ifrn.edu.br/teciteca/ usando o navegador de sua preferência.