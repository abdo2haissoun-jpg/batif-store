'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { FadeInView } from '@/components/FadeInView'
import { ShopByCategory } from '@/components/ShopByCategory'
import { PoloEditionSection } from '@/components/PoloEditionSection'
import { FeaturedEditorialSection } from '@/components/FeaturedEditorialSection'
import { ValuePropsBar } from '@/components/ValuePropsBar'
import { ShopPage } from '@/components/ShopPage'
import { ProductDetailPage } from '@/components/ProductDetailPage'
import { AboutPage } from '@/components/AboutPage'
import { LegalPage } from '@/components/LegalPage'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { WishlistDrawer } from '@/components/WishlistDrawer'
import { SearchModal } from '@/components/SearchModal'
import { QuickViewModal } from '@/components/QuickViewModal'
import { AccountModal } from '@/components/AccountModal'
import { ContactPage } from '@/components/ContactPage'
import { AboutModal } from '@/components/AboutModal'
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal'
import { Toast } from '@/components/Toast'
import { PRODUCTS as HARDCODED_PRODUCTS } from '@/data/products'
import { Product, CartItem, LegalTab } from '@/types/store'
import { fetchProducts, createOrder } from '@/lib/store-api'

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>(HARDCODED_PRODUCTS)
  const [productsLoaded, setProductsLoaded] = useState(false)

  useEffect(() => {
    fetchProducts().then((dbProducts) => {
      setProducts(dbProducts)
      setProductsLoaded(true)
      console.log(`[BATIF] Loaded ${dbProducts.length} products (${dbProducts === HARDCODED_PRODUCTS ? 'hardcoded fallback' : 'from Supabase'})`)
    })
  }, [])

  const [activeNav, setActiveNav] = useState<string>('HOME')
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('ALL')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0])
  const [currentLegalTab, setCurrentLegalTab] = useState<LegalTab>('TERMS')

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false)
  const [isCookiePrefsOpen, setIsCookiePrefsOpen] = useState<boolean>(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false)

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product)
    setActiveNav('PRODUCT')
    setIsQuickViewOpen(false)
    setIsSearchOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToShop = (category = 'ALL') => {
    setShopCategoryFilter(category)
    setActiveNav('SHOP')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToHome = () => {
    setActiveNav('HOME')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToAbout = () => {
    setActiveNav('ABOUT')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToContact = () => {
    setActiveNav('CONTACT')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToLegal = (tab: LegalTab) => {
    setCurrentLegalTab(tab)
    setActiveNav('LEGAL')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (product: Product, size = 'L', color = 'Standard') => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      )
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += 1
        return next
      }
      return [
        ...prev,
        { product, quantity: 1, selectedSize: size, selectedColor: color },
      ]
    })
    showToast(`Added "${product.name}" to your bag.`)
  }

  const handleQuickOrder = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard')
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems((prev) => {
      const next = [...prev]
      next[index].quantity = quantity
      return next
    })
  }

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
    showToast('Item removed from your bag.')
  }

  const handleCheckoutSuccess = async (orderDetails: {
    customerName: string
    phone: string
    city: string
    address: string
    postalCode?: string
    note?: string
  }) => {
    const orderItems = cartItems.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      color: item.selectedColor,
      size: item.selectedSize,
      quantity: item.quantity,
      unit_price: item.product.price,
    }))

    const result = await createOrder({
      customer_name: orderDetails.customerName,
      phone: orderDetails.phone,
      city: orderDetails.city,
      address: orderDetails.address,
      postal_code: orderDetails.postalCode,
      note: orderDetails.note,
      items: orderItems,
    })

    if (result.success) {
      setCartItems([])
      return { orderNumber: result.order_number }
    } else {
      showToast('Order failed. Please try again.')
      return null
    }
  }

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlistItems.some((p) => p.id === product.id)
    if (exists) {
      setWishlistItems((prev) => prev.filter((p) => p.id !== product.id))
      showToast(`Removed "${product.name}" from wishlist.`)
    } else {
      setWishlistItems((prev) => [...prev, product])
      showToast(`Saved "${product.name}" to wishlist.`)
    }
  }

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard')
    setWishlistItems((prev) => prev.filter((p) => p.id !== product.id))
    setIsWishlistOpen(false)
    setIsCartOpen(true)
  }

  const isProductWishlisted = (id: string) => wishlistItems.some((p) => p.id === id)

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const carousel1Products = products.slice(0, 6)
  const carousel2Products = products.slice(6, 12)

  return (
    <div className="min-h-screen bg-white text-black font-inter-tight selection:bg-black selection:text-white flex flex-col">
      <Header
        activeTab={activeNav}
        setActiveTab={(tab) => {
          if (tab === 'SHOP') {
            navigateToShop('ALL')
          } else if (tab === 'HOME') {
            navigateToHome()
          } else if (tab === 'ABOUT') {
            navigateToAbout()
          } else {
            setActiveNav(tab)
          }
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenContact={() => navigateToContact()}
        onOpenAbout={navigateToAbout}
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
      />

      <main className="flex-1">
        {activeNav === 'PRODUCT' && selectedProduct ? (
          <ProductDetailPage
            key={selectedProduct.id}
            product={selectedProduct}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onQuickOrder={handleQuickOrder}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isProductWishlisted}
            onNavigateHome={navigateToHome}
            onNavigateShop={navigateToShop}
            onSelectProduct={navigateToProduct}
            onShowToast={showToast}
          />
        ) : activeNav === 'SHOP' ? (
          <ShopPage
            key={shopCategoryFilter}
            products={products}
            initialCategory={shopCategoryFilter}
            onSelectProduct={navigateToProduct}
            onQuickOrder={handleQuickOrder}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isProductWishlisted}
          />
        ) : activeNav === 'ABOUT' ? (
          <AboutPage
            onNavigateShop={() => navigateToShop('ALL')}
            onOpenContact={() => navigateToContact()}
          />
        ) : activeNav === 'CONTACT' ? (
          <ContactPage
            onShowToast={showToast}
          />
        ) : activeNav === 'LEGAL' ? (
          <LegalPage
            key={currentLegalTab}
            initialTab={currentLegalTab}
            onNavigateHome={navigateToHome}
            onNavigateShop={() => navigateToShop('ALL')}
            onShowToast={showToast}
          />
        ) : (
          <>
            <HeroSection
              heroProduct={products[0]}
              onOrderNow={handleQuickOrder}
              onExploreCollection={() => navigateToShop('ALL')}
            />

            <FadeInView>
              <ShopByCategory
                sectionId="shop-section"
                title="EXPLORE THE COLLECTION"
                products={carousel1Products}
                onSelectProduct={navigateToProduct}
                onQuickOrder={handleQuickOrder}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isProductWishlisted}
              />
            </FadeInView>

            <FadeInView>
              <PoloEditionSection
                onShopPolo={() => {
                  navigateToShop('POLO EDITION')
                }}
              />
            </FadeInView>

            <FadeInView>
              <ShopByCategory
                title="MORE ESSENTIALS"
                products={carousel2Products}
                onSelectProduct={navigateToProduct}
                onQuickOrder={handleQuickOrder}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isProductWishlisted}
              />
            </FadeInView>

            <FadeInView>
              <FeaturedEditorialSection
                onShopNow={() => {
                  navigateToShop('T-SHIRTS')
                }}
              />
            </FadeInView>

            <FadeInView>
              <ValuePropsBar />
            </FadeInView>
          </>
        )}
      </main>

      <Footer
        onOpenAbout={navigateToAbout}
        onOpenContact={() => navigateToContact()}
        onOpenLegal={navigateToLegal}
        onOpenCookiePreferences={() => setIsCookiePrefsOpen(true)}
        onShowToast={showToast}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutSuccess}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={navigateToProduct}
      />

      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? isProductWishlisted(selectedProduct.id) : false}
        onOpenProductPage={navigateToProduct}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onShowToast={showToast}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onNavigateToFullAbout={navigateToAbout}
        onNavigateShop={() => navigateToShop('ALL')}
      />

      <CookiePreferencesModal
        isOpen={isCookiePrefsOpen}
        onClose={() => setIsCookiePrefsOpen(false)}
        onShowToast={showToast}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  )
}
