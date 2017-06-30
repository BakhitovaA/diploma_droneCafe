## Демо-версия системы

Интерфейс клиента: [https://diplomadronecafe.herokuapp.com/#!/](https://diplomadronecafe.herokuapp.com/#!/)

Интерфейс повара: [https://diplomadronecafe.herokuapp.com/#!/kitchen](https://diplomadronecafe.herokuapp.com/#!/kitchen)

## Архитектура системы

```
app/                             -- структурные файлы приложения
    bower_components/            -- пакеты, установленные через bower
    chef/                        -- компонент для интерфейса повара
      chef.html                  -- интерфейс
      chefCtrl.js                -- контроллер
      chefCtrlService.js         -- сервис
    client/                      -- компонент для интерфейса клиента
      client.html                -- интерфейс
      clientCtrl.js              -- контроллер
      clientCtrl.js              -- сервис
    data/                        -- дополнительные файлы приложения
        menu.json                -- исходный файл с блюдами меню
        modelData.js             -- схемы для БД
    test/
        APItest.js               -- тестирование приложения
    app.js                       -- angular-модуль
    index.html                   -- главная страница приложения
node_modules/                    -- пакеты, установленные через npm
.bowerrc                         -- настройка для bower
.gitignore                       -- настройка для git
bower.json                       -- конфигурации bower
package.json                     -- конфигурации npm
README.md                        -- описание приложения
server.js                        -- сервер
```

## Локальный запуск приложения
```
npm start
```
Затем перейти по адресу: [http://localhost:3000/](http://localhost:3000/)
