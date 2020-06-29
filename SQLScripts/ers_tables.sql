create schema ers;
set schema 'ers';

create table roles( --table order creation matters
	"role_id" serial primary key,
	"role" text
);

create table users(
	"user_id" serial primary key, --don't provide value for serial column
	"username" text not null unique,
	"password" text not null, --"" b/c password is a keyword
	"firstName" text not null,
	"lastName" text not null,
	"email" text,
	"role" int references roles("role_id") --FK to roles table 
);

create table reimbursement_status(
	"status_id" serial primary key,
	"status" text
);

create table reimbursement_type(
	"type_id" serial primary key,
	"type" text
);

create table reimbursement(
	"reimbursement_id" serial primary key,
	"author" int references users("user_id"),
	"amount" numeric(100,2),
	"date_submitted" date,
	"date_resolved" date,
	"description" text,
	"resolver" int,
	"status" int references reimbursement_status("status_id"),
	"type" int references reimbursement_type("type_id")
);