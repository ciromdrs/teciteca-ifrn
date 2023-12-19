# teciteca-ifrn
Teciteca Virtual

## Como publicar o site no servidor do IFRN
### Linux
1. Baixe o código deste repositório:
    ```bash
    git clone 'link para este repositório'
    ```

1. Acesse o diretório `public_html` dentro dele:
    ```bash
    cd teciteca-ifrn/public_html
    ```

1. Execute o comando abaixo 
    ```bash
    sftp -r -P 22 teciteca@www2.ifrn.edu.br:public_html <<< 'put .'
    ```

1. Informe a senha que lhe foi passada pela coordenação do projeto e aguarde o upload dos arquivos.

1. Acesse https://www2.ifrn.edu.br/teciteca/ usando o navegador de sua preferência.