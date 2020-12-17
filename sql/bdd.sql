/* script de création de la base de données */
drop database if exists StarThief;
create database StarThief;
USE StarThief
/* script de création des tables de la base de données */
/* suppression des tables */
DROP TABLE if exists Niveau;
DROP TABLE if exists Users;
DROP TABLE if exists Sauvegarde;

create table Niveau(
    idNiv INT auto_increment not null,
    libelle VARCHAR(50),
primary key(idNiv))engine=innodb;

create table Users(
    id INT auto_increment not null,
    username VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
primary key(id))engine=innodb;

create table Sauvegarde(
    idSauv INT auto_increment not null,
    idUser INT,
    idNiveau INT,
primary key(idSauv))engine=innodb;
 
alter table Sauvegarde add constraint FK_sauv_user foreign key (idUser) references Users(id);
alter table Sauvegarde add constraint FK_sauv_niv foreign key (idNiveau) references Niveau(idNiv);

insert into Niveau(libelle) value ("une bombe");
insert into Niveau(libelle) value ("deux bombe");
insert into Niveau(libelle) value ("trois bombe");
insert into Niveau(libelle) value ("quatre bombe");
insert into Niveau(libelle) value ("cinq bombe");
insert into Niveau(libelle) value ("six bombe");






