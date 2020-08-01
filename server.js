const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bcrypt = require('bcrypt');

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '4858',
    database : 'tharavadu'
  }
});

const hash = bcrypt.hashSync('vk81', 10);

const app = express();
app.use(cors());
app.use(express.json());

var today = new Date();
var mm = String(today.getMonth() + 1).padStart(2, '0'); 

app.get('/users',(req,resp)=>{
	db('users').orderBy('birthday')
	.then(info=>resp.json(info));
})

app.put('/updateChelav',(req,resp)=>{
	if(req.body.update === 'yes')
		db('users')
  		.where('name', '=', req.body.name)
  		.increment('chelavs', 1)
  		.then(res=>resp.json("done"))
	else if(req.body.update === 'no')
		db('users')
  		.where('name', '=', req.body.name)
  		.decrement('chelavs', 1)
  		.then(res=>resp.json("done"))
})

app.put('/checkIsPro',(req,resp)=>{
db('users')
  .where('chelavs', '>',2)
  .update({
    status: '~Pro~',
  }).then(out=>resp.json("done")).catch((err)=>resp.json(err));
})

app.put('/checkIsNoob',(req,resp)=>{
db('users')
  .where('chelavs', '<',3)
  .update({
    status: 'Noob',
  }).then(out=>resp.json("done")).catch((err)=>resp.json(err));
})

app.get('/bdaycard',(req,resp)=>{
	db.select('*').from('users')
	.then(users=>   users.filter(user=>Number(user.birthday.slice(5,7)) === Number(mm)))
	.then(info=> resp.json(info))
})

app.post('/signin',(req,resp)=>{
 db('signin').where({
  name : req.body.name,
}).select('*').then(user=>{
	if(user){

	if(bcrypt.compareSync(req.body.password, user[0].hash))
		resp.json("enter");
	else
		resp.json("invalid");
}
	
		
}).catch(err=>resp.json("no user"));

})

app.listen(3010);