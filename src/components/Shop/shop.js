import { productAPI, productSummaryAPI, productImagesAPI } from '@/services/api';
import { resolveAssetUrl } from '@/utils/image';

async function fetchCategories() {
  try {
    const { categoryAPI } = await import('@/services/api');
    const categories = await categoryAPI.getCategories();
    return categories.map(c => ({ id: String(c.id), name: c.name }));
  } catch (error) {
    console.error('获取分类失败:', error);
    return [
      { id: '0', name: '全部分类' },
      { id: '1', name: '50系列' },
      { id: '2', name: '40系列' },
      { id: '3', name: '30系列' },
      { id: '4', name: '显卡配件' }
    ];
  }
}

async function fetchProducts() {
  try {
    const summaries = await productSummaryAPI.getSummaries();
    return summaries.map(product => ({
      id: product.id,
      category_id: product.category_id,
      cid: product.category_id,
      title: product.name,
      name: product.name,
      desc: '',
      price: product.price,
      src: resolveAssetUrl(product.image_url),
      image_url: product.image_url,
      stock: product.stock
    }));
  } catch (error) {
    console.error('获取产品数据失败:', error);
    return [];
  }
}

async function fetchProductDetail(id) {
  try {
    const product = await productAPI.getProduct(id);
    const image = resolveAssetUrl(product.image_url);

    let swiperImages = [{ url: '#', src: image }];
    try {
      const images = await productImagesAPI.getImages(id);
      const swiperImgs = images.filter(img => img.type === 'swiper');
      if (swiperImgs.length > 0) {
        swiperImages = swiperImgs.map(img => ({
          url: '#',
          src: resolveAssetUrl(img.image_url)
        })).filter(img => img.src);
      }
    } catch (err) {
      const suffixes = ['B', 'C', 'D', 'E'];
      if (product.image_url) {
        const match = product.image_url.match(/Index\/(.+?)\./);
        if (match) {
          const baseName = match[1];
          for (const suffix of suffixes) {
            for (const ext of ['.jpg', '.png']) {
              const variantPath = `@/assets/Index/${baseName}${suffix}${ext}`;
              const resolved = resolveAssetUrl(variantPath);
              if (resolved && !resolved.startsWith('@/assets/')) {
                swiperImages.push({ url: '#', src: resolved });
              }
            }
          }
        }
      }
    }

    return {
      ...product,
      title: product.title || product.name,
      desc: product.description || '',
      bright: product.bright || '❤七天无理由退货 | 极速退款',
      bright2: product.bright2 || '☆PLUS额外省',
      bright3: product.bright3 || '✈支持送礼',
      src: image,
      imgs: swiperImages.map(item => item.src),
      detail: product.detail_html || `
        <h3>包装清单</h3>
        <p>${product.name}</p>
        <p>重要信息和保修卡</p>
        <h3>商品详情</h3>
        <p>支持七天无理由退货</p>
      `,
      swiper: swiperImages,
      stock: product.stock
    };
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return null;
  }
}

export default {
  fetchCategories,
  fetchProducts,
  fetchProductDetail
};