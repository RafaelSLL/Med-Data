# Med Data Front-end

Projeto Front-end em ReactJS responsavel por agendamentos de clinicas medicas

## Bibliotecas:

- react-router-dom
- axios
- json-server
- react-bootstrap bootstrap
- react-icons
- react-input-mask

```bash
npm install react-router-dom axios json-server react-bootstrap bootstrap react-icons react-input-mask
```

### Lembre-se, é necessário importar o bootstrap no arquivo main.jsx

```js
import 'bootstrap/dist/css/bootstrap.min.css'
```

### Configuração do JSON-SERVER:

- No package.json, insira um novo script:
```json
"server":"json-server --watch data/db.json"
```
- Crie uma pasta e arquivo: data/db.json (NA RAIZ)
- Dentro dele inicialize as tabelas do banco de dados

``` json 
{
    "medicos": [],
    "pacientes": [],
    "consultas": []
}
```