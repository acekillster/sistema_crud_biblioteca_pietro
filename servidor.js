const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const aplicativo = express();
const porta = 3001;

aplicativo.use(cors());
aplicativo.use(express.json());

const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "biblioteca_pietro"
});

conexao.connect((erro) => {
  if (erro) {
    console.log("erro ao conectar no banco");
    console.log(erro.message);
    return;
  }

  console.log("banco conectado com sucesso");
});

function validarLivro(dados) {
  if (!dados.titulo || !dados.autor || !dados.categoria) {
    return "titulo autor e categoria sao obrigatorios";
  }

  if (!dados.ano_publicacao || dados.ano_publicacao < 1000) {
    return "informe um ano de publicacao valido";
  }

  if (dados.quantidade === undefined || dados.quantidade < 0) {
    return "informe uma quantidade valida";
  }

  return null;
}

aplicativo.get("/livros", (requisicao, resposta) => {
  const pagina = Number(requisicao.query.pagina) || 1;
  const limite = Number(requisicao.query.limite) || 5;
  const inicio = (pagina - 1) * limite;

  const consulta = "select * from livros order by id desc limit ? offset ?";

  conexao.query(consulta, [limite, inicio], (erro, resultados) => {
    if (erro) {
      return resposta.status(500).json({ erro: "erro ao buscar livros" });
    }

    const consultaTotal = "select count(*) as total from livros";

    conexao.query(consultaTotal, (erroTotal, resultadoTotal) => {
      if (erroTotal) {
        return resposta.status(500).json({ erro: "erro ao contar livros" });
      }

      const total = resultadoTotal[0].total;

      resposta.json({
        livros: resultados,
        total: total,
        paginas: Math.ceil(total / limite),
        pagina: pagina
      });
    });
  });
});

aplicativo.get("/livros/:id", (requisicao, resposta) => {
  const id = Number(requisicao.params.id);

  if (!id) {
    return resposta.status(400).json({ erro: "id invalido" });
  }

  const consulta = "select * from livros where id = ?";

  conexao.query(consulta, [id], (erro, resultados) => {
    if (erro) {
      return resposta.status(500).json({ erro: "erro ao buscar livro" });
    }

    if (resultados.length === 0) {
      return resposta.status(404).json({ erro: "livro nao encontrado" });
    }

    resposta.json(resultados[0]);
  });
});

aplicativo.post("/livros", (requisicao, resposta) => {
  const dados = requisicao.body;
  const erroValidacao = validarLivro(dados);

  if (erroValidacao) {
    return resposta.status(400).json({ erro: erroValidacao });
  }

  const consulta = `
    insert into livros
    (titulo, autor, categoria, ano_publicacao, quantidade, descricao)
    values (?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    dados.titulo,
    dados.autor,
    dados.categoria,
    Number(dados.ano_publicacao),
    Number(dados.quantidade),
    dados.descricao || ""
  ];

  conexao.query(consulta, valores, (erro, resultado) => {
    if (erro) {
      return resposta.status(500).json({ erro: "erro ao cadastrar livro" });
    }

    resposta.status(201).json({
      mensagem: "livro cadastrado com sucesso",
      id: resultado.insertId
    });
  });
});

aplicativo.put("/livros/:id", (requisicao, resposta) => {
  const id = Number(requisicao.params.id);
  const dados = requisicao.body;
  const erroValidacao = validarLivro(dados);

  if (!id) {
    return resposta.status(400).json({ erro: "id invalido" });
  }

  if (erroValidacao) {
    return resposta.status(400).json({ erro: erroValidacao });
  }

  const consulta = `
    update livros
    set titulo = ?, autor = ?, categoria = ?, ano_publicacao = ?,
    quantidade = ?, descricao = ?
    where id = ?
  `;

  const valores = [
    dados.titulo,
    dados.autor,
    dados.categoria,
    Number(dados.ano_publicacao),
    Number(dados.quantidade),
    dados.descricao || "",
    id
  ];

  conexao.query(consulta, valores, (erro, resultado) => {
    if (erro) {
      return resposta.status(500).json({ erro: "erro ao atualizar livro" });
    }

    if (resultado.affectedRows === 0) {
      return resposta.status(404).json({ erro: "livro nao encontrado" });
    }

    resposta.json({ mensagem: "livro atualizado com sucesso" });
  });
});

aplicativo.delete("/livros/:id", (requisicao, resposta) => {
  const id = Number(requisicao.params.id);

  if (!id) {
    return resposta.status(400).json({ erro: "id invalido" });
  }

  const consulta = "delete from livros where id = ?";

  conexao.query(consulta, [id], (erro, resultado) => {
    if (erro) {
      return resposta.status(500).json({ erro: "erro ao excluir livro" });
    }

    if (resultado.affectedRows === 0) {
      return resposta.status(404).json({ erro: "livro nao encontrado" });
    }

    resposta.json({ mensagem: "livro excluido com sucesso" });
  });
});

aplicativo.listen(porta, () => {
  console.log("servidor funcionando na porta " + porta);
});
