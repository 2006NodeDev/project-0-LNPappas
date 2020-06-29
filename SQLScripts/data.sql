set schema 'ers';

insert into roles ("role")
	values ('admin'),('finance-manager'), ('user');

select * from roles r; 

insert into users("username","password","firstName", "lastName", "email", "role")
	values	('patches','password','Richard','Hendricks','patches@piedpiper.com','1'),
			('koolaid','password','Erlich','Bachman','koolaid@aviato.net','3'),
			('bighead','password','Nelson','Bighetti','bighead@hooli.com','3'),
			('cheifsystemsarchitect','password','Bertram','Gilfoyle','cheifsystemsarchitect@piedpiper.com','3'),
			('tesla','password','Dinesh','Chugtai','tesla@piedpiper.com','1'),
			('mhall','password','Monica','Hall','mhall@raviga.com','2'),
			('jared','password','Donald','Dunn','Jared@piedpiper.com','1'),
			('triplecoma','password','Russ','Hannenman','triplecoma@radioontheinternet.net','2'),
			('lbream','password','Laurie','Bream','lbream@raviga.com','2'),
			('pgregory','password','Peter','Gregory','formerly@raviga.com','2');
			
select * from users u;

insert into reimbursement_status ("status")
	values ('processing'),('approved'), ('denied');

select * from reimbursement_status rs; 

insert into reimbursement_type ("type")
	values ('buisness'),('medical'),('travel'),('misc');

select * from reimbursement_type rt; 
	
insert into reimbursement ("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type" )
	values	('3','1.84','2014-04-01','2015-04-10','Big Gulp','6','3','4'),
			('1','5577.99','2015-06-15','2015-06-15','a new laptop to replace my girlfriend','1','2','1'),
			('2','24.20','2014-07-15','2014-08-21','fage replenishment','7','2','1'),
			('2','1345542.00','2016-05-29','2016-05-30','Bachmanity','9','3','4'),
			('8','69.69','2019-12-01','2019-12-01',',,, tequila','8','2','4'),
			('1','20','2019-10-27','2019-11-05','copay for court-appointed therapist','6','2','2'),
			('5','456.00','2019-11-24','2019-11-28','flight to hawaii','1','2','3'),
			('8','14999999999.99','2019-12-01','2019-12-01','sandwich @ RussFest','7','3','1');
			
insert into reimbursement ("author", "amount", "date_submitted","description","status", "type" )
	values	('4','8.99','2019-12-08','beer','1','1');

select  u2."firstName", u2."lastName", r2.date_submitted, r2.date_resolved, rt."type", r2.description, r2.amount, rs.status, u."firstName", u."lastName" 
		from ers.reimbursement as r2
		join ers.users u on u.user_id = r2.resolver 
		left join ers.users u2 on u2.user_id = r2.author
		left join ers.reimbursement_status rs on rs.status_id = r2.status
		left join ers.reimbursement_type rt on rt.type_id = r2."type" 
		group by r2.date_submitted, r2.date_resolved, r2.description, r2.amount, rs.status, rt."type", u2."firstName", u2."lastName", u."firstName", u."lastName"
		order by r2.date_submitted;
