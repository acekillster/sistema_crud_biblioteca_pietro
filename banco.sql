create database if not exists biblioteca_pietro;

use biblioteca_pietro;

create table if not exists livros (
    id int auto_increment primary key,
    titulo varchar(150) not null,
    autor varchar(120) not null,
    categoria varchar(80) not null,
    ano_publicacao int not null,
    quantidade int not null default 0,
    descricao varchar(500)
);

insert into livros
(titulo, autor, categoria, ano_publicacao, quantidade, descricao)
values
("o pequeno principe", "antoine de saint exupery", "literatura", 1943, 4, "livro classico sobre amizade e aprendizado"),
("dom casmurro", "machado de assis", "romance", 1899, 3, "romance brasileiro classico"),
("1984", "george orwell", "ficcao", 1949, 5, "historia sobre uma sociedade controlada"),
("o hobbit", "j r r tolkien", "fantasia", 1937, 6, "aventura de bilbo bolseiro"),
("a revolucao dos bichos", "george orwell", "satira", 1945, 2, "fabula com critica politica"),
("capitaes da areia", "jorge amado", "romance", 1937, 4, "historia sobre jovens em salvador");
