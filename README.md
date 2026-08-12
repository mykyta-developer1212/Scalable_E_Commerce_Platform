Проєкт ялвяє собою REST-API інтернет-магазина, побудоване за принципом мікросервісної архітектури. Він складається з трьох незалежних сервісів: User Service, ProductService, Order Service. Кожен сервіс виконує окрему бізнес-функцію, має власну базу даних PostgreSQL і запускається в окремому Docker-контейнері, та взаємодіє через HTTP-запити. 
Для розробки використано Node.js, Express.js, Docker, PostgreSQL, DockerCompose, Prisma. Обмін даними між сервісами та клієнтом здійснюється через HTTP-запити за допомогою REST API. 

User Service відповідає за роботу роботу з користувачами:
• реєстрація користувачів;
• отримання списку користувачів;
• пошук користувача за ID;
• редагування інформації;
• видалення користувача;
Cервіс доступний за адресою 
https://exciting-freedom-production-f0df.up.railway.app/
Маршрути:
GET    /users
GET    /users/:id
POST   /users/register
POST   /users/login
PUT    /profile
DELETE /profile

Product Service відповідає за роботу з товарами:
• перегляд каталогу;
• пошук товару;

Сервіс доступний за адресою:
https://exciting-freedom-production-f0df.up.railway.app/
Маршрути:
GET    /products
GET    /products/:id

Order Service відповідає за створення та керування замовленнями:
Cервіс доступний за адресою:
https://exciting-freedom-production-f0df.up.railway.app/
Маршрути:
• перегляд усіх замовлень;
• перегляд замовлення за ID;

GET /orders
GET /orders/:id
