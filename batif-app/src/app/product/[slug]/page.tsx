'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductWithDetails, ProductColor, ProductSize } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data.product)
        if (data.product?.product_colors?.length) {
          setSelectedColor(data.product.product_colors[0])
        }
        if (data.product?.product_sizes?.length) {
          setSelectedSize(data.product.product_sizes[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableStock = (colorId: string, sizeId: string): number => {
    if (!product) return 0
    const variant = product.product_variants?.find(
      (v) => v.color_id === colorId && v.size_id === sizeId
    )
    return variant?.stock || 0
  }

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) {
      toast.error('Please select color and size')
      return
    }

    const stock = getAvailableStock(selectedColor.id, selectedSize.id)
    if (stock <= 0) {
      toast.error('This variant is out of stock')
      return
    }

    addItem(product, selectedColor, selectedSize)
    toast.success('Added to bag')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    )
  }

  const images = product.product_images || []
  const colors = product.product_colors || []
  const sizes = product.product_sizes || []

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight">BATIF</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/shop" className="hover:opacity-70">Shop</a>
            <a href="/about" className="hover:opacity-70">About</a>
            <a href="/cart" className="hover:opacity-70">Cart</a>
          </nav>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          ← Back to shop
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 bg-gray-100">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex].url}
                  alt={product.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 border ${
                      selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-light mb-2">{product.name}</h1>
            <p className="text-2xl text-gray-900 mb-4">{product.price} MAD</p>
            {product.original_price && (
              <p className="text-lg text-gray-400 line-through mb-4">
                {product.original_price} MAD
              </p>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        selectedColor?.id === color.id
                          ? 'border-black'
                          : 'border-gray-300'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => {
                    const stock = selectedColor
                      ? getAvailableStock(selectedColor.id, size.id)
                      : 0
                    const isAvailable = stock > 0

                    return (
                      <button
                        key={size.id}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`w-12 h-12 border text-sm ${
                          selectedSize?.id === size.id
                            ? 'bg-black text-white border-black'
                            : isAvailable
                              ? 'border-gray-300 hover:border-black'
                              : 'border-gray-200 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {size.name}
                      </button>
                    )
                  })}
                </div>
                {selectedSize && selectedColor && (
                  <p className="text-sm text-gray-500 mt-2">
                    {getAvailableStock(selectedColor.id, selectedSize.id)} in stock
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors mb-4"
            >
              Add to Bag
            </button>

            {/* Product Details */}
            {product.description && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            )}

            {product.material && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Material</h3>
                <p className="text-sm text-gray-600">{product.material}</p>
              </div>
            )}

            {product.fit && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Fit</h3>
                <p className="text-sm text-gray-600">{product.fit}</p>
              </div>
            )}

            {product.care && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Care</h3>
                <p className="text-sm text-gray-600">{product.care}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
