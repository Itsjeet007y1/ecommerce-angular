import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = environment.shopApiUrl + '/products';

  private categoryUrl = environment.shopApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    //Need to build URL based on category id.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, 
                        thePageSize: number, 
                        categoryId: number): Observable<GetResponseProducts> {

    //Need to build URL based on category id.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProduct(theKeyword: string): Observable<Product[]> {
    //Need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, 
                         thePageSize: number, 
                         theKeyword: string): Observable<GetResponseProducts> {

    //Need to build URL based on keyword.
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => 
        response._embedded.productCategory)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    // need to build product url based on id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}