import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'], // Fixed typo here
})
export class DetailsComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  cartService: CartService = inject(CartService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  product: Product | null = null;
  isInCart: boolean = false;
  quantity: number = 1;

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductById(productId).subscribe((product) => {
        this.product = product;
        this.checkIfInCart();
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.isInCart = true;
    }
  }
  removeFromCart(): void {
    if (this.product) {
      this.cartService.removeFromCart(this.product.id);
      this.isInCart = false;
    }
  }
  buynow(): void {
    if (this.product) {
      if (!this.isInCart) {
        this.cartService.addToCart(this.product, this.quantity);
      }
      this.router.navigate(['/cart']);
    }
  }
  updateQuantity(value: 'min' | 'add'): void {
    if (value === 'add' && this.quantity < 10) {
      this.quantity += 1;
    } else if (value === 'min' && this.quantity > 1) {
      this.quantity -= 1;
    }
    console.log(this.quantity);
  }

  checkIfInCart(): void {
    if (this.product) {
      this.isInCart = this.cartService.isProductInCart(this.product.id);
    }
  }
}
