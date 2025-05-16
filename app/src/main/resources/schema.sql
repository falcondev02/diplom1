CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- Категории товаров
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

-- Товары
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,                -- ⬅️  uuid → bigserial
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  image_url TEXT,
  in_stock INT NOT NULL DEFAULT 0,      -- 🆕

  category_id INT NOT NULL
      REFERENCES product_categories(id) ON DELETE RESTRICT
);

-- Заказы (ВМЕСТО ENUM — просто VARCHAR)
-- Заказы (добавлено поле address)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'NEW',
  address TEXT NOT NULL,                       -- 🆕 ОБЯЗАТЕЛЬНО
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT  NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),  -- ⬅️ bigint
  quantity INT NOT NULL,
  price_cents INT NOT NULL
);
