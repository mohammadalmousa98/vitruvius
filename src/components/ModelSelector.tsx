import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Model } from '../types';

interface ModelSelectorProps {
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsQuery = query(collection(db, 'models'));
        const snapshot = await getDocs(modelsQuery);
        const modelsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Model[];
        setModels(modelsData);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Model</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Model</h2>

      {models.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No models available</p>
          <p className="text-sm text-gray-500 mt-2">
            Please contact support to add base models
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => onSelectModel(model)}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                selectedModel?.id === model.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {model.thumbnailUrl ? (
                <img
                  src={model.thumbnailUrl}
                  alt={model.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              <h3 className="font-medium text-sm text-gray-900">{model.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{model.description}</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {model.gender}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {model.bodyType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedModel && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm font-medium text-primary-900">
            Selected: {selectedModel.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
