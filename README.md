# sistema biblioteca simples

sistema web de gerenciamento de livros desenvolvido para trabalho academico

aluno

pietro de souza mastantuono

## tecnologias

frontend

react
vite
fetch api
css

backend

node js
express
cors
mysql2

banco de dados

mysql

## estrutura

frontend

backend

backend/banco.sql

## como preparar o banco

1 abra o mysql workbench

2 abra o arquivo backend/banco.sql

3 execute todo o script

4 confirme que o banco biblioteca_pietro foi criado

o projeto usa por padrao o usuario root sem senha

caso seu mysql tenha senha altere o campo password no arquivo backend/servidor.js

## como iniciar o backend

abra o terminal dentro da pasta backend

execute

npm install

depois

npm start

o servidor deve ficar na porta 3001

## como iniciar o frontend

abra outro terminal dentro da pasta frontend

execute

npm install

depois

npm run dev

o vite vai mostrar o endereco do sistema no terminal

## funcionalidades

listar livros

paginar livros

cadastrar livro

editar livro

excluir livro

visualizar detalhes

validar dados

mostrar mensagens de erro

conectar com mysql

api rest

cors

nome do aluno visivel na interface

## rotas da api

get /livros

get /livros/id

post /livros

put /livros/id

delete /livros/id

## observacao


o arquivo banco.sql deve ser mantido dentro da pasta backend
