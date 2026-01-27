import "dotenv/config";

import { db } from "@/db";
import { ProductInsert, products } from "@/db/schema";

const STORE_ID = "b197c6b4-0441-4bfb-9ed4-cce1f51d3fd0";

const CATEGORY_DEFINITIONS = [
  {
    category: "Pizza",
    count: 9,
    bases: ["Margherita", "Pepperoni", "BBQ Chicken", "Veggie", "Truffle Mushroom"],
  },
  {
    category: "Pasta",
    count: 8,
    bases: ["Alfredo", "Bolognese", "Pesto", "Arrabbiata", "Carbonara"],
  },
  {
    category: "Salad",
    count: 8,
    bases: ["Caesar", "Greek", "Kale Crunch", "Garden", "Quinoa"],
  },
  {
    category: "Beverage",
    count: 8,
    bases: ["Iced Tea", "Lemonade", "Cold Brew", "Sparkling Water", "Fruit Smoothie"],
  },
  {
    category: "Dessert",
    count: 8,
    bases: ["Tiramisu", "Chocolate Lava", "Cheesecake", "Gelato", "Brownie"],
  },
  {
    category: "Appetizer",
    count: 9,
    bases: ["Garlic Knots", "Bruschetta", "Mozzarella Sticks", "Stuffed Mushrooms", "Loaded Fries"],
  },
];

const ADJECTIVES = [
  "Classic",
  "Signature",
  "House",
  "Crispy",
  "Zesty",
  "Herb",
  "Spicy",
  "Smoky",
  "Creamy",
  "Golden",
  "Fresh",
  "Rustic",
];

function buildProducts() {
  const products: Array<ProductInsert> = [];

  CATEGORY_DEFINITIONS.forEach(({ category, count, bases }, categoryIndex) => {
    for (let i = 0; i < count; i += 1) {
      const base = bases[i % bases.length];
      const adjective = ADJECTIVES[(i + categoryIndex) % ADJECTIVES.length];
      const name = `${adjective} ${base}`;
      const price = Number((8 + (i % 6) * 1.75 + categoryIndex).toFixed(2));

      products.push({
        storeId: STORE_ID,
        name,
        description: `${category} favorite with ${adjective.toLowerCase()} flavor notes.`,
        price: price.toString(),
      });
    }
  });

  return products;
}

async function seed() {

  const items = buildProducts();

  const inserted = await db.insert(products).values(items).returning();
  console.log(`Inserted ${inserted.length} menu items for store ${STORE_ID}.`);
}

seed()
  .catch((error) => {
    console.error("Failed to seed products", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
