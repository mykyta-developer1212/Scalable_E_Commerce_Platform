import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Початок комплексного заповнення бази даних");

  const defaultPasswordHash = await bcrypt.hash("rkrkwe22333223", 10);
  const seedUsers = [
    { email: "olena.koval@gmail.com", name: "Олена Коваль" },
    { email: "andriy.shevchenko@gmail.com", name: "Андрій Шевченко" },
    { email: "dmytro.tkachenko@gmail.com", name: "Дмитро Ткаченко" },
    { email: "sergiy.bondar@gmail.com", name: "Сергій Бондар" },
    { email: "nataliia.kravets@gmail.com", name: "Наталія Кравець" },
  ];

  const savedUsers = [];
  for (const userData of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: defaultPasswordHash,
      },
    });
    savedUsers.push(user);
    console.log(`Користувач готовий: ${user.email}`);
  }

  const seedProducts = [
    { name: "Смартфон Apple iPhone 15", price: 42000.00, stock: 15 },
    { name: "Ноутбук ASUS Zenbook", price: 54500.00, stock: 7 },
    { name: "Механічна клавіатура", price: 4100.00, stock: 25 },
  ];

  const savedProducts = [];
  for (const productData of seedProducts) {

    let product = await prisma.product.findFirst({
      where: { name: productData.name }
    });
    
    if (!product) {
      product = await prisma.product.create({
        data: productData
      });
    }
    savedProducts.push(product);
    console.log(`Товар готовий: ${product.name}`);
  }

  const existingOrdersCount = await prisma.order.count();
  
  if (existingOrdersCount === 0 && savedUsers.length > 0 && savedProducts.length > 0) {

    const seedOrders = [
      {
        userId: savedUsers[0].id,
        productId: savedProducts[0].id, 
        totalPrice: savedProducts[0].price,
      },
      {
        userId: savedUsers[2].id, 
        productId: savedProducts[1].id,
        totalPrice: savedProducts[1].price,
      },
    ];

    for (const orderData of seedOrders) {
      const order = await prisma.order.create({
        data: orderData
      });
      console.log(`Замовлення #${order.id} успішно створено для User ID: ${order.userId}`);
    }
  } else if (existingOrdersCount > 0) {
    console.log("Таблиця замовлень вже містить дані. Пропускаємо створення тест-замовлень.");
  }

  console.log("Всі таблиці успішно заповнено");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("Помилка під час заповнення:");
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });