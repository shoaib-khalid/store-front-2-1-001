import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home-v3', loadChildren: () => import('./components/pages/homethree/homethree.module').then(m => m.HomethreeModule), data: { breadcrumb: 'Homepage' } },
  { path: '', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule), data: { breadcrumb: 'Homepage' }},
  { path: 'home-v2', loadChildren: () => import('./components/pages/hometwo/hometwo.module').then(m => m.HometwoModule), data: { breadcrumb: 'Homepage' } },  
  { path: 'about', loadChildren: () => import('./components/pages/about/about.module').then(m => m.AboutModule), data: { breadcrumb: 'About Us' } },
  { path: 'blog-grid', loadChildren: () => import('./components/pages/bloggrid/bloggrid.module').then(m => m.BloggridModule), data: { breadcrumb: 'Blog Grid' } },
  { path: 'blog-list', loadChildren: () => import('./components/pages/bloglist/bloglist.module').then(m => m.BloglistModule), data: { breadcrumb: 'Blog List' } },
  { path: 'blog-masonry', loadChildren: () => import('./components/pages/blogmasonry/blogmasonry.module').then(m => m.BlogmasonryModule), data: { breadcrumb: 'Blog Masonry' } },
  { path: 'cart', loadChildren: () => import('./components/pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
  { path: 'checkout', loadChildren: () => import('./components/pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
  { path: 'contact', loadChildren: () => import('./components/pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: 'Contact Us' } },
  { path: 'error', loadChildren: () => import('./components/pages/error/error.module').then(m => m.ErrorModule), data: { breadcrumb: 'Error 404' } },
  { path: 'login', loadChildren: () => import('./components/pages/login/login.module').then(m => m.LoginModule) , data: { breadcrumb: 'Login' }},
  { path: 'register', loadChildren: () => import('./components/pages/register/register.module').then(m => m.RegisterModule), data: { breadcrumb: 'Register' } },
  { path: 'post-single/:id', loadChildren: () => import('./components/pages/postsingle/postsingle.module').then(m => m.PostsingleModule), data: { breadcrumb: 'Post Details' } },
  { path: 'product-single/:id', loadChildren: () => import('./components/pages/productsingle/productsingle.module').then(m => m.ProductsingleModule), data: { breadcrumb: 'Product Details' } },
  { path: 'product-single-v2/:prodSeoName', loadChildren: () => import('./components/pages/productsingletwo/productsingletwo.module').then(m => m.ProductsingletwoModule), data: { breadcrumb: 'Product Details' } },
  { path: 'product-page/:id', loadChildren: () => import('./components/pages/product-page/product-page.module').then(m => m.ProductpageModule), data: { breadcrumb: 'Product Details' } },
  { path: 'wishlist', loadChildren: () => import('./components/pages/wishlist/wishlist.module').then(m => m.WishlistModule), data: { breadcrumb: 'Wishlist' } },
  { path: 'shop-v1', loadChildren: () => import('./components/pages/shopone/shopone.module').then(m => m.ShoponeModule), data: { breadcrumb: 'Shop v1 (Default)' } },
  { path: 'shop-v2/:catId', loadChildren: () => import('./components/pages/shoptwo/shoptwo.module').then(m => m.ShoptwoModule), data: { breadcrumb: 'Shop v2 (Full Width)' } },
  { path: 'shop-v3', loadChildren: () => import('./components/pages/shopthree/shopthree.module').then(m => m.ShopthreeModule), data: { breadcrumb: 'Shop v3 (No Sidebar)' } },
  { path: 'shop-v4', loadChildren: () => import('./components/pages/shopfour/shopfour.module').then(m => m.ShopfourModule), data: { breadcrumb: 'Shop v4 (List view)' } },
  { path: 'thankyou', loadChildren: () => import('./components/pages/thankyou/thankyou.module').then(m => m.ThankyouModule), data: { breadcrumb: 'Thankyou'} },
  { path: '**', loadChildren: () => import('./components/pages/error/error.module').then(m => m.ErrorModule), data: { breadcrumb: 'Error 404' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
