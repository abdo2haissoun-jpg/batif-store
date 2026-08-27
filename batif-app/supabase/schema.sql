-- =====================================================
-- BATIF STORE DATABASE SCHEMA
-- Supabase PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ADMIN PROFILES
-- =====================================================
CREATE TABLE admin_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT 'Administrator',
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. STORE SETTINGS
-- =====================================================
CREATE TABLE store_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_name TEXT DEFAULT 'BATIF STORE',
  store_email TEXT DEFAULT 'contact@batif.store',
  store_phone TEXT DEFAULT '+212 661 735 339',
  delivery_fee NUMERIC(10,2) DEFAULT 30.00,
  currency TEXT DEFAULT 'MAD',
  instagram TEXT DEFAULT '@batif.store',
  store_status TEXT DEFAULT 'open' CHECK (store_status IN ('open', 'closed')),
  cities JSONB DEFAULT '["Casablanca","Rabat","Marrakech","Fez","Tangier"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCTS
-- =====================================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category TEXT NOT NULL,
  material TEXT,
  fit TEXT,
  care TEXT,
  sku TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_limited BOOLEAN DEFAULT FALSE,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. PRODUCT IMAGES
-- =====================================================
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  image_type TEXT DEFAULT 'main' CHECK (image_type IN ('main', 'front', 'back', 'detail', 'editorial', 'additional')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PRODUCT COLORS
-- =====================================================
CREATE TABLE product_colors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  hex TEXT NOT NULL DEFAULT '#000000',
  sort_order INTEGER DEFAULT 0
);

-- =====================================================
-- 6. PRODUCT SIZES
-- =====================================================
CREATE TABLE product_sizes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- =====================================================
-- 7. PRODUCT VARIANTS (stock per color+size)
-- =====================================================
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  color_id UUID REFERENCES product_colors(id) ON DELETE CASCADE NOT NULL,
  size_id UUID REFERENCES product_sizes(id) ON DELETE CASCADE NOT NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  sku TEXT,
  UNIQUE(product_id, color_id, size_id)
);

-- =====================================================
-- 8. ORDERS
-- =====================================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT,
  note TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cod',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled', 'returned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. ORDER ITEMS
-- =====================================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_color_size ON product_variants(color_id, size_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can only read published products and their images/colors/sizes
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_images.product_id AND status = 'published')
  );

CREATE POLICY "Public can view product colors" ON product_colors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_colors.product_id AND status = 'published')
  );

CREATE POLICY "Public can view product sizes" ON product_sizes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_sizes.product_id AND status = 'published')
  );

CREATE POLICY "Public can view product variants" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND status = 'published')
  );

-- Public can view store settings
CREATE POLICY "Public can view store settings" ON store_settings
  FOR SELECT USING (true);

-- Public can create orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Public can view their own orders (by order number)
CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

-- Admin policies (using JWT role)
CREATE POLICY "Admins can do everything with products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with product images" ON product_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with product colors" ON product_colors
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with product sizes" ON product_sizes
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with product variants" ON product_variants
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with order items" ON order_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage store settings" ON store_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage admin profiles" ON admin_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  order_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_num
  FROM orders;
  
  order_num := 'BT-' || LPAD(next_num::TEXT, 5, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to decrease stock atomically
CREATE OR REPLACE FUNCTION decrease_stock(
  p_product_id UUID,
  p_color_id UUID,
  p_size_id UUID,
  p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock INTO current_stock
  FROM product_variants
  WHERE product_id = p_product_id
    AND color_id = p_color_id
    AND size_id = p_size_id
  FOR UPDATE;
  
  IF current_stock IS NULL OR current_stock < p_quantity THEN
    RETURN FALSE;
  END IF;
  
  UPDATE product_variants
  SET stock = stock - p_quantity
  WHERE product_id = p_product_id
    AND color_id = p_color_id
    AND size_id = p_size_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to restore stock
CREATE OR REPLACE FUNCTION restore_stock(
  p_product_id UUID,
  p_color_id UUID,
  p_size_id UUID,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock = stock + p_quantity
  WHERE product_id = p_product_id
    AND color_id = p_color_id
    AND size_id = p_size_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default store settings
INSERT INTO store_settings (store_name, store_email, store_phone, delivery_fee, currency, instagram, store_status)
VALUES ('BATIF STORE', 'contact@batif.store', '+212 661 735 339', 30.00, 'MAD', '@batif.store', 'open')
ON CONFLICT (id) DO NOTHING;
