angular
.module('droneCafe')
.factory('clientCtrlService', function($http) {

    return {
        //получение информации о клиенте (ред)
        getUserInfo: function(user) {
            let userInfo = {
                params: {
                    name: user.name,
                    email: user.email
                }
            };
            return $http.get('/api/clients', userInfo);
        },
        //создание нового клиента
        createNewUser: function(user) {
            let userInfo = {
                name: user.name,
                email: user.email
            };
            return $http({
                method: 'POST',
                url: '/api/clients',
                data: userInfo
            });
        },
        //обновление баланса клиента 
        updateUserBalance: function(userid, newBalance) {
            let userInfo = {
                balance: newBalance
            };
            return $http({
                method: 'PUT',
                url: '/api/clients/' + userid,
                data: userInfo
            });
        },
        //получение списка блюд в меню
        getMenu: function() {
            return $http.get('/api/meals');
        },
        //получение списка заказанных блюд пользователя
        getUserOrders: function(userid) {
            let ordersInfo = {
                params: {
                    userId: userid
                }
            };
            return $http.get('/api/orders', ordersInfo);
        },
        //добавление блюда к заказу
        createOrder: function(userid, mealid){
            let orderInfo = {
                userId: userid,
                mealId: mealid
            };

            return $http({
                method: 'POST',
                url: '/api/orders',
                data: orderInfo
            });
        },
        //удаление блюда из заказа
        deleteOrder: function(orderid){
            return $http({
                method: 'DELETE',
                url: '/api/orders/' + orderid
            });
        },
        //обновление статуса заказа
        updateOrderStatus: function(orderid, newStatus, orderPrice){
            let orderInfo = {
                status: newStatus,
                price: orderPrice
            };
            return $http({
                method: 'PUT',
                url: '/api/orders/' + orderid,
                data: orderInfo
            });
        }        
    }

});
