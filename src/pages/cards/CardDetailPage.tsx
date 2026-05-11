import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsApi } from '../../api';
import { useAuthStore, useUIStore } from '../../stores';
import { CardImage, Button, Modal } from '../../components/ui';
import type { CardWithOwners, Condition, Language } from '../../types';
import { ArrowLeft, Plus, MessageCircle, Users } from 'lucide-react';

const CONDITIONS: Condition[] = ['mint', 'near_mint', 'excellent', 'good', 'light_plaid', 'plaid', 'poor'];
const LANGUAGES: Language[] = ['english', 'japanese', 'spanish', 'french', 'german', 'italian', 'portuguese'];

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const [cardData, setCardData] = useState<CardWithOwners | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add to inventory form state
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<Condition>('near_mint');
  const [language, setLanguage] = useState<Language>('english');

  useEffect(() => {
    const fetchCardData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await cardsApi.getOwners(id);
        setCardData(data);
      } catch (err) {
        setError('Failed to load card details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCardData();
  }, [id]);

  const handleAddToInventory = async () => {
    if (!id) return;
    try {
      // Call API to add item
      addToast({ message: 'Card added to your inventory!', type: 'success' });
      setIsAddModalOpen(false);
    } catch (err) {
      addToast({ message: 'Failed to add card to inventory', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-red-600 mb-4">{error || 'Card not found'}</p>
        <Button variant="ghost" onClick={() => navigate('/cards')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to catalog
        </Button>
      </div>
    );
  }

  const { card, owners } = cardData;

  return (
    <div>
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Image - show full card without cropping */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-[300px] mx-auto">
            <CardImage
              src={card.image_url}
              alt={card.name}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Card Info */}
        <div>
          <h1 className="text-2xl font-bold text-ink-black mb-2">{card.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {card.archetype && (
              <span className="px-3 py-1 bg-shop-violet/10 text-shop-violet rounded-full text-body-sm">
                {card.archetype}
              </span>
            )}
            <span className="px-3 py-1 bg-subtle-gray text-muted-text rounded-full text-body-sm">
              {card.type}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {card.atk !== undefined && (
              <div className="bg-subtle-gray rounded-[8px] p-3 text-center">
                <p className="text-caption text-muted-text mb-1">ATK</p>
                <p className="text-body font-bold text-ink-black">{card.atk}</p>
              </div>
            )}
            {card.def !== undefined && (
              <div className="bg-subtle-gray rounded-[8px] p-3 text-center">
                <p className="text-caption text-muted-text mb-1">DEF</p>
                <p className="text-body font-bold text-ink-black">{card.def}</p>
              </div>
            )}
            {card.level && (
              <div className="bg-subtle-gray rounded-[8px] p-3 text-center">
                <p className="text-caption text-muted-text mb-1">Level</p>
                <p className="text-body font-bold text-ink-black">{card.level}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {card.description && (
            <div className="mb-6">
              <h3 className="text-body font-semibold text-ink-black mb-2">Description</h3>
              <p className="text-body-sm text-muted-text">{card.description}</p>
            </div>
          )}

          {/* Add to Inventory Button */}
          {isAuthenticated && (
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full text-white mb-8"
            >
              <Plus size={16} className="mr-2" />
              Add to my inventory
            </Button>
          )}

          {/* Owners Section */}
          <div className="mb-6">
            <h3 className="text-body font-semibold text-ink-black mb-4 flex items-center gap-2">
              <Users size={18} />
              Owners ({owners.length})
            </h3>
            {owners.length === 0 ? (
              <p className="text-body-sm text-muted-text">No owners yet</p>
            ) : (
              <div className="space-y-3">
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-subtle-gray rounded-[11.4046px]"
                  >
                    <div>
                      <p className="text-body font-medium text-ink-black">{owner.username}</p>
                      <p className="text-caption text-muted-text">
                        {owner.cantidad}x • {owner.condicion.replace('_', ' ')} • {owner.idioma}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {owner.instagram && (
                        <a
                          href={`https://instagram.com/${owner.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-full transition-colors text-shop-violet"
                          title={`Instagram: @${owner.instagram}`}
                        >
                          IG
                        </a>
                      )}
                      {owner.twitter && (
                        <a
                          href={`https://twitter.com/${owner.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-full transition-colors text-shop-violet"
                          title={`Twitter: @${owner.twitter}`}
                        >
                          X
                        </a>
                      )}
                      {owner.whatsapp && (
                        <a
                          href={`https://wa.me/${owner.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-full transition-colors"
                        >
                          <MessageCircle size={16} className="text-muted-text" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Inventory Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add to Inventory"
        description={`Add ${card.name} to your inventory`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-body-sm text-muted-text font-medium block mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-5 py-3 rounded-[9999px] border border-subtle-gray text-ink-black text-body focus:outline-none focus:ring-2 focus:ring-shop-violet focus:border-shop-violet transition-all duration-200"
            />
          </div>
          <div>
            <label className="text-body-sm text-muted-text font-medium block mb-2">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className="w-full px-5 py-3 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black text-body focus:outline-none focus:ring-2 focus:ring-shop-violet focus:border-shop-violet transition-all duration-200"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-body-sm text-muted-text font-medium block mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-5 py-3 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black text-body focus:outline-none focus:ring-2 focus:ring-shop-violet focus:border-shop-violet transition-all duration-200"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="primary"
            onClick={handleAddToInventory}
            className="w-full text-white"
          >
            Add to Inventory
          </Button>
        </div>
      </Modal>
    </div>
  );
}