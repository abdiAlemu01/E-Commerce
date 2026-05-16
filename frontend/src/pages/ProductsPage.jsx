import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';
import { FiSearch } from 'react-icons/fi';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, keyword: searchTerm }],
    queryFn: () => productService.getProducts({ page, keyword: searchTerm }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('common.products')}</h1>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-48 mb-4"></div>
              <div className="skeleton h-4 mb-2"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.data?.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="card hover:shadow-lg transition"
              >
                <img
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-primary-600 font-bold">${product.price}</p>
                  {product.rating > 0 && (
                    <span className="text-sm text-gray-600">
                      ⭐ {product.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data.pagination.hasPrevPage}
                className="btn btn-secondary"
              >
                {t('common.previous')}
              </button>
              <span className="px-4 py-2">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.pagination.hasNextPage}
                className="btn btn-secondary"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
