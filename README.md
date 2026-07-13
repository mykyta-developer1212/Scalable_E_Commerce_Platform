Проєкт ялвяє собою REST-API інтернет-магазина, побудоване за принципом мікросервісної архітектури. Він складається з трьох незалежних сервісів: User Service, ProductService, Order Service. Кожен сервіс виконує окрему бізнес-функцію, має власну базу даних PostgreSQL і запускається в окремому Docker-контейнері. та взаємодіє через HTTP-запити. 
Для розробки використано Node.js, Express.js, Docker, PostgreSQL та DockerCompose. Обмін даними між сервісами та клієнтом здійснюється через HTTP-запити за допомогою REST API. 

Під час деплою проєкту на Render Free Tier враховано особливість cold start після періоду неактивності сервісу. Реалізовано health check endpoint для перевірки доступності та готовності мікросервісів до обробки HTTP-запитів. Endpoint використовується для контролю стану API Gateway та перевірки працездатності системи перед виконанням основних API-операцій.
Посилання:
https://scalable-e-commerce-platform-5.onrender.com/health

User Service відповідає за роботу роботу з користувачами:
• реєстрація користувачів;
• отримання списку користувачів;
• пошук користувача за ID;
• редагування інформації;
• видалення користувача;
Cервіс доступний за адресою 
https://scalable-e-commerce-platform-5.onrender.com/
Маршрути:
GET    /users
GET    /users/:id
POST   /users/register
POST   /users/login
PUT    /users/:id
DELETE /users/:id

Product Service відповідає за роботу з товарами:
• додавання товарів;
• перегляд каталогу;
• пошук товару;
• оноволення інформації;
• видалення товару;
Сервіс доступний за адресою:
https://scalable-e-commerce-platform-5.onrender.com/
Маршрути:
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id

Order Service відповідає за створення та керування замовленнями:
Cервіс доступний за адресою:
https://scalable-e-commerce-platform-5.onrender.com/
Маршрути:
• створення замовлення;
• перегляд усіх замовлень;
• перегляд замовлення за ID;
• оновлення статусу;
• видалення замовлення
