CREATE DATABASE authSystem;

USE authSystem;
CREATE TABLE `USER`
(
Id int not null auto_increment primary key,
Username nvarchar(50) not null,
Password nvarchar(250) not null,
Phone nvarchar(50) not null,
Email nvarchar(50) not null,
TimeCreated datetime default now()
);

USE authSystem;
CREATE TABLE `Avatar`
(
Id int not null primary key,
UserId int not null,
TimeUploaded datetime default now(),
Size int not null,
Type nvarchar(10) not null,
OriginalName nvarchar(200) not null,
constraint FK_USER_AVATAR foreign key (UserId) references `User`(Id)
);