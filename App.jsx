import React from "react";
import { useEffect, useState } from "react";

const enderecoApi = "http://localhost:3001";

const livroVazio = {
  titulo: "",
  autor: "",
  categoria: "",
  ano_publicacao: "",
  quantidade: "",
  descricao: ""
};

function App() {
  const [tela, setTela] = useState("lista");
  const [livros, setLivros] = useState([]);
  const [livroAtual, setLivroAtual] = useState(null);
  const [formulario, setFormulario] = useState(livroVazio);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarLivros();
  }, [pagina]);

  async function buscarLivros() {
    setCarregando(true);

    try {
      const resposta = await fetch(
        `${enderecoApi}/livros?pagina=${pagina}&limite=5`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro);
      }

      setLivros(dados.livros);
      setTotalPaginas(dados.paginas);
    } catch (erro) {
      setMensagem(erro.message || "nao foi possivel carregar os livros");
    } finally {
      setCarregando(false);
    }
  }

  function abrirCadastro() {
    setFormulario(livroVazio);
    setLivroAtual(null);
    setMensagem("");
    setTela("formulario");
  }

  function abrirEdicao(livro) {
    setFormulario({
      titulo: livro.titulo,
      autor: livro.autor,
      categoria: livro.categoria,
      ano_publicacao: livro.ano_publicacao,
      quantidade: livro.quantidade,
      descricao: livro.descricao || ""
    });

    setLivroAtual(livro);
    setMensagem("");
    setTela("formulario");
  }

  async function abrirDetalhes(id) {
    try {
      const resposta = await fetch(`${enderecoApi}/livros/${id}`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro);
      }

      setLivroAtual(dados);
      setTela("detalhes");
    } catch (erro) {
      setMensagem(erro.message || "erro ao abrir detalhes");
    }
  }

  function mudarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  async function salvarLivro(evento) {
    evento.preventDefault();
    setMensagem("");

    try {
      const modoEdicao = livroAtual !== null;
      const metodo = modoEdicao ? "PUT" : "POST";
      const endereco = modoEdicao
        ? `${enderecoApi}/livros/${livroAtual.id}`
        : `${enderecoApi}/livros`;

      const resposta = await fetch(endereco, {
        method: metodo,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro);
      }

      setMensagem(
        modoEdicao
          ? "livro atualizado com sucesso"
          : "livro cadastrado com sucesso"
      );

      setFormulario(livroVazio);
      setLivroAtual(null);
      setTela("lista");
      buscarLivros();
    } catch (erro) {
      setMensagem(erro.message || "erro ao salvar livro");
    }
  }

  async function excluirLivro(id) {
    const confirmou = window.confirm("deseja realmente excluir este livro");

    if (!confirmou) {
      return;
    }

    try {
      const resposta = await fetch(`${enderecoApi}/livros/${id}`, {
        method: "DELETE"
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro);
      }

      setMensagem("livro excluido com sucesso");
      buscarLivros();
    } catch (erro) {
      setMensagem(erro.message || "erro ao excluir livro");
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <div>
          <h1>biblioteca simples</h1>
          <p>controle de livros</p>
        </div>

        <div className="aluno">
          aluno
          <strong>pietro de souza mastantuono</strong>
        </div>
      </header>

      <nav className="menu">
        <button onClick={() => setTela("lista")}>lista de livros</button>
        <button onClick={abrirCadastro}>cadastrar livro</button>
      </nav>

      {mensagem && <div className="mensagem">{mensagem}</div>}

      <main>
        {tela === "lista" && (
          <section>
            <div className="tituloArea">
              <div>
                <h2>livros cadastrados</h2>
                <p>consulte edite exclua ou veja os detalhes</p>
              </div>

              <button className="botaoPrincipal" onClick={abrirCadastro}>
                novo livro
              </button>
            </div>

            {carregando ? (
              <p className="aviso">carregando livros</p>
            ) : livros.length === 0 ? (
              <p className="aviso">nenhum livro cadastrado</p>
            ) : (
              <div className="tabelaArea">
                <table>
                  <thead>
                    <tr>
                      <th>titulo</th>
                      <th>autor</th>
                      <th>categoria</th>
                      <th>ano</th>
                      <th>quantidade</th>
                      <th>acoes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {livros.map((livro) => (
                      <tr key={livro.id}>
                        <td>{livro.titulo}</td>
                        <td>{livro.autor}</td>
                        <td>{livro.categoria}</td>
                        <td>{livro.ano_publicacao}</td>
                        <td>{livro.quantidade}</td>
                        <td className="acoes">
                          <button onClick={() => abrirDetalhes(livro.id)}>
                            detalhes
                          </button>
                          <button onClick={() => abrirEdicao(livro)}>
                            editar
                          </button>
                          <button
                            className="botaoExcluir"
                            onClick={() => excluirLivro(livro.id)}
                          >
                            excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="paginacao">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
              >
                anterior
              </button>

              <span>
                pagina {pagina} de {totalPaginas}
              </span>

              <button
                disabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
              >
                proxima
              </button>
            </div>
          </section>
        )}

        {tela === "formulario" && (
          <section className="cartao">
            <h2>{livroAtual ? "editar livro" : "cadastrar livro"}</h2>

            <form onSubmit={salvarLivro}>
              <label>
                titulo
                <input
                  name="titulo"
                  value={formulario.titulo}
                  onChange={mudarCampo}
                  required
                />
              </label>

              <label>
                autor
                <input
                  name="autor"
                  value={formulario.autor}
                  onChange={mudarCampo}
                  required
                />
              </label>

              <label>
                categoria
                <input
                  name="categoria"
                  value={formulario.categoria}
                  onChange={mudarCampo}
                  required
                />
              </label>

              <label>
                ano de publicacao
                <input
                  type="number"
                  name="ano_publicacao"
                  value={formulario.ano_publicacao}
                  onChange={mudarCampo}
                  min="1000"
                  required
                />
              </label>

              <label>
                quantidade
                <input
                  type="number"
                  name="quantidade"
                  value={formulario.quantidade}
                  onChange={mudarCampo}
                  min="0"
                  required
                />
              </label>

              <label>
                descricao
                <textarea
                  name="descricao"
                  value={formulario.descricao}
                  onChange={mudarCampo}
                  rows="4"
                />
              </label>

              <div className="linhaBotoes">
                <button type="submit" className="botaoPrincipal">
                  salvar
                </button>

                <button type="button" onClick={() => setTela("lista")}>
                  cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {tela === "detalhes" && livroAtual && (
          <section className="cartao detalhes">
            <h2>detalhes do livro</h2>

            <div className="detalheItem">
              <strong>titulo</strong>
              <span>{livroAtual.titulo}</span>
            </div>

            <div className="detalheItem">
              <strong>autor</strong>
              <span>{livroAtual.autor}</span>
            </div>

            <div className="detalheItem">
              <strong>categoria</strong>
              <span>{livroAtual.categoria}</span>
            </div>

            <div className="detalheItem">
              <strong>ano de publicacao</strong>
              <span>{livroAtual.ano_publicacao}</span>
            </div>

            <div className="detalheItem">
              <strong>quantidade</strong>
              <span>{livroAtual.quantidade}</span>
            </div>

            <div className="detalheItem">
              <strong>descricao</strong>
              <span>{livroAtual.descricao || "sem descricao"}</span>
            </div>

            <div className="linhaBotoes">
              <button onClick={() => abrirEdicao(livroAtual)}>editar</button>
              <button onClick={() => setTela("lista")}>voltar</button>
            </div>
          </section>
        )}
      </main>

      <footer>
        sistema desenvolvido por pietro de souza mastantuono
      </footer>
    </div>
  );
}

export default App;
