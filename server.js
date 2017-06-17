const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const APIv1 = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/app')); 

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

const drone = require('netology-fake-drone-api');

const mongoose = require('mongoose');

const model = require('./app/data/modelData.js');

mongoose.connect('mongodb://Anastasiya.Morina:qwerty@ds123312.mlab.com:23312/dronecafe')

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения:'));
db.once('open', function() {
    
	console.log('Подключение к БД: ', 'mongodb://Anastasiya.Morina:qwerty@ds123312.mlab.com:23312/dronecafe');
    
	APIv1.route('/clients')
        	//получение информации о клиенте
		.get((req, res) => {
			model.Client.find({name : req.query.name, email : req.query.email}, (err, client) => {
				if (err){
					res.send(err);
				} else {
					res.json(client);
				};
			});
		})
        	//создание нового клиента
		.post((req, res) => {
			const client = new model.Client({name : req.body.name, email : req.body.email, balance : 100});
			client.save((err) => {
				if (err) {
					res.send(err);
				} else {
					res.json(client);
				}
			});
		});

	APIv1.route('/clients/:client_id')
        	//обновление баланса клиента
		.put((req, res) => {
			model.Client.findById(req.params.client_id, (err, client) => {
				  if (err) {
					  res.send(err);
				  } else {
					  client.balance = req.body.balance;
					  client.save((err) => {
						  if (err) {
							  res.send(err);
						  } else {
							  res.send('Баланс обновлен!');
						  };
					  });
				  };
			});
		});

	//получение списка блюд в меню
	APIv1.route('/meals')
		.get((req, res) => {
			model.Meal.find((err, meals) => {
				if (err){
					res.send(err);
				} else {
					res.json(meals);
				};
			});
		});
    
    APIv1.route('/orders')
        //получение списка заказанных блюд пользователя
        .get((req, res) => {
            let matchQuery = {
                $match: {}
            };

            if ((req.query.userId !== null) && (req.query.userId !== undefined)) {
                let userId = req.query.userId;
                matchQuery.$match["userId"] = mongoose.Types.ObjectId(userId);
            };
        
            if ((req.query.status !== null) && (req.query.status !== undefined)) {
                matchQuery.$match["status"] = req.query.status;
            };

            model.Order.aggregate({
                $lookup: {
                    "from" : "meals",
                    "localField" : "mealId",
                    "foreignField" : "_id",
                    "as" : "meal"
                }},
                { $unwind: "$meal" },
                { $project: {
                    "_id": 1,
                    "userId": 1,
                    "mealId": 1,
                    "status": 1,
                    "price": "$meal.price",
                    "mealName": "$meal.title"
                }}, matchQuery)
                .exec((err, orders) => {
                    if (err){
                        res.send(err);
                    } else {
                        res.json(orders);
                    };
                });
    	})
        //добавление блюда к заказу
	.post((req, res) => {
		const newOrder = new model.Order({
			userId : mongoose.Types.ObjectId(req.body.userId), 
			mealId : mongoose.Types.ObjectId(req.body.mealId), 
			status : 'Заказано'
		});
		newOrder.save((err) => {
			if (err) {
				res.send(err);
			} else {
			    	res.send('Заказ создан');
			    	io.emit('order created');
			}
		});
	});

	APIv1.route('/orders/:order_id')
        //обновление статуса заказа
		.put((req, res) => {
            model.Order.findById(req.params.order_id, (err, order) => {
                if (err) {
                    res.send(err);
                } else {
                    order.status = req.body.status;
                    order.save((err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            if (order.status == 'Заказано'){
                                io.emit('order created');
                            };
                            if (order.status == 'Доставляется') {
                                drone
                                    .deliver()
                                    .then(() => {
                                        order.status = 'Подано';
                                        order.save((err) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                io.emit('status changed', order);
                                                setTimeout(()=>{
                                                    model.Order.remove({_id: req.params.order_id}, (function (err) {
                                                        if (err) {
                                                            res.send(err);
                                                        } else {
                                                            io.emit('order deleted');
                                                            res.send('Выполненный заказ удален')
                                                        };
                                                    }))
                                                }, 120000);
                                            }
                                        });
                                        
                                    })
                                    .catch(() => {
                                        order.status = 'Возникли сложности';
                                        order.save((err) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                io.emit('status changed', order);
                                                setTimeout(()=>{
                                                    model.Order.remove({_id: req.params.order_id}, (function (err) {
                                                        if (err) {
                                                            res.send(err);
                                                        } else {
                                                            io.emit('order deleted');
                                                            res.send('Не выполненный заказ удален')
                                                        };
                                                    }))
                                                }, 120000);
                                            }
                                        });
                                    });
                            };
                        };
                    });
                };
            });
	})
        //удаление блюда из заказа
	.delete((req, res) => {
		model.Order.remove({_id: req.params.order_id}, (err) => {
			if (err) {
			    res.send(err);
			} else {
			    res.send('Заказ удален')
			};
	    	});
	});
})

app.use('/api', APIv1);

server.listen(port, function () {
    console.log('Подключение к порту %d', port);
});

io.on('connection', function (socket) {
    console.log('Подключение пользователя');

    socket.on('status changed', (order) => {
        io.emit('status changed', order);
    });
    
    socket.on('disconnect', function () {
        console.log('Отключение пользователя');
    });
});
