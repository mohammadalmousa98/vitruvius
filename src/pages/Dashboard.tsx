import { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PaywallBanner from '../components/PaywallBanner';
import ProductUploader from '../components/ProductUploader';
import ModelSelector from '../components/ModelSelector';
import JobList from '../components/JobList';
import { Model, Product, POSES } from '../types';

const Dashboard = () => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadProducts = async () => {
    if (!currentUser) return;

    try {
      setLoadingProducts(true);
      const productsQuery = query(
        collection(db, 'products'),
        where('ownerUid', '==', currentUser.uid)
      );
      const snapshot = await getDocs(productsQuery);
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!selectedModel || !selectedProduct || !userData || !currentUser) {
      alert('Please select both a model and a product');
      return;
    }

    // Check credits (4 poses = 4 credits)
    const requiredCredits = POSES.length;
    if (userData.credits < requiredCredits) {
      alert(`Insufficient credits. You need ${requiredCredits} credits but only have ${userData.credits}.`);
      return;
    }

    try {
      setGenerating(true);

      // Create job document
      const jobData = {
        ownerUid: currentUser.uid,
        productId: selectedProduct.id,
        modelId: selectedModel.id,
        poses: POSES.map(p => p.type),
        status: 'pending',
        outputImages: [],
        creditsUsed: requiredCredits,
        createdAt: new Date(),
      };

      const jobRef = await addDoc(collection(db, 'jobs'), jobData);

      // Call Cloud Function to generate images
      const generateImages = httpsCallable(functions, 'generateModelImages');
      await generateImages({ jobId: jobRef.id });

      // Refresh user data to get updated credits
      await refreshUserData();

      alert('Image generation started! Check the Recent Jobs section for progress.');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to start image generation. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Upload products, select models, and generate professional fashion photos
        </p>

        <PaywallBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProductUploader />

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Products</h2>

            {!loadingProducts && products.length === 0 && (
              <button
                onClick={loadProducts}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
              >
                Load Products
              </button>
            )}

            {loadingProducts && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all flex items-center gap-3 ${
                      selectedProduct?.id === product.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.category} {product.color && `• ${product.color}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
        </div>

        {selectedModel && selectedProduct && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Images</h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Selected Configuration:</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Product: {selectedProduct.name}</li>
                <li>• Model: {selectedModel.name}</li>
                <li>• Poses: {POSES.length} ({POSES.map(p => p.label).join(', ')})</li>
                <li>• Credits required: {POSES.length}</li>
                <li>• Your current credits: {userData?.credits || 0}</li>
              </ul>
            </div>

            <button
              onClick={handleGenerateImages}
              disabled={generating || !userData || userData.credits < POSES.length}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {generating ? 'Generating...' : `Generate ${POSES.length} Images (${POSES.length} credits)`}
            </button>

            {userData && userData.credits < POSES.length && (
              <p className="mt-2 text-sm text-red-600 text-center">
                Insufficient credits. Please upgrade your plan.
              </p>
            )}
          </div>
        )}

        <JobList />
      </div>
    </Layout>
  );
};

export default Dashboard;
