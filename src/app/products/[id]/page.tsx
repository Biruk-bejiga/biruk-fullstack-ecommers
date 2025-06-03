import { mockProducts } from '@/lib/mockProducts';
import { notFound } from 'next/navigation';

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const id = params.id;
  const product = mockProducts.find(product => product.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <img src={product.imageUrl} alt={product.name} width={300} height={300} />
      {/* Add more product details here */}
    </div>
  );
};

export default ProductDetail;
