import React from 'react'
import './Products.css'

const Products = () => {
  return (
    <div className="products-container">
        <div className="products-header">
        <Link href='#products-list'>
            <img
                className="desktop-banner"
                src="/assets/products/product-banner.png"
                alt="Products Banner"
            />
        </Link>
        <Link href='#products-list'>
            <img
                className="mobile-banner"
                src="/assets/products/product-banner-mobile.png"
                alt="Products Mobile Banner"
            />
        </Link>
        </div>

		<div className="products" id="products-list">
			<h2 >Emergency Knowledge, <span style={{color:'var(--orange)'}}>Simplified</span></h2>
            <p>Pocket-sized guides for rapid response across medical emergencies.</p>
		</div>
        
        <div className="products-list" >
            <div className="product-item">
                <a
                    href="/api/product-click?productId=first-aid-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="/assets/products/product1.png" alt="First Aid Guide" />
                    <h2>Order Now</h2>
                    <p>You will be redirected to an external site to place your order.</p>
                </a>
            </div>
        </div>
	</div>
  )
}

export default Products