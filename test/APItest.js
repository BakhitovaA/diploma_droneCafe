const supertest = require('supertest');
const expect = require('chai').expect;
const assert = require("chai").assert;
let should = require('chai').should();

const model = require('../app/data/modelData.js');

describe('Тестирование API для Drone Cafe', () => {
    let server;
    before((done) => {
        require('../server');
        setTimeout(() => {
            server = supertest.agent('http://localhost:3000');
            done();
        }, 1000);
    });

    describe('создание/получение пользователя', () => {

        it('/api/clients должен сохранить нового пользователя', done => {
            server
                .post('/api/clients')
                .send({'name': 'Anastasiya', 
                      'email': 'anastasiya@test.ru'})
                .set('charset', /UTF-8/)
                .expect("Content-type", /json/)
                .expect(200)
                .expect({
                    "name": "Anastasiya",
                    "email": "anastasiya@test.ru",
                    "balance": 100
                })
                .end((err, res) => {
                    done();
                });
        });
        
        it('/api/clients должен вернуть корректные данные зарегистрированного пользователя', done => {
            server
                .get('/api/clients')
                .send({'name': 'Anastasiya', 
                      'email': 'anastasiya@test.ru'})
                .set('charset', /UTF-8/)
                .expect("Content-type", /json/)
                .expect(200)
                .expect({
                    "name": "Anastasiya",
                    "email": "anastasiya@test.ru",
                    "balance": 100
                })
                .end((err, res) => {
                    done();
                });
        });
        
    });
    
    describe('получение списка меню', () => {  
        it('/api/meals должен вернуть список', done => {
            server
                .get('/api/meals')
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });  
    });
    
    describe('получение списка заказанных блюд пользователя', () => {  
        it('/api/orders должен вернуть список', done => {
            server
                .get('/api/orders')
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });  
        it('/api/orders должен добавить блюдо к заказу', done => {
            let newOrder = new model.Order({ 
                userId: "5945ac7b5fd2c90004cd2fe5", 
                mealId: "5945ab354b07bccfef57d4b7",
                status : ''});
            server
                .post('/api/orders')
                .send(newOrder)
                .expect(200)
                .end((err, res) => {
                    done();
                });
        });
    });
    
    describe('удаление заказа', () => {
        it('/api/orders/594430c341f5b13b30a96354 вернет код 200', done => {
            server
                .delete('api/orders/594430c341f5b13b30a96354')
                .expect(200)
                .end((err, response) => {
                    done();
                });
        });

    });
    
});
