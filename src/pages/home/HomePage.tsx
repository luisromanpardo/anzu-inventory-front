import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeApi } from '../../api';
import { Card } from '../../components/ui';
import type { HomeCard } from '../../types';

export function HomePage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<HomeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const data = await homeApi.getTopCards();
        setCards(data);
      } catch {
        setError('Failed to load cards. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-shop-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-muted-text">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center bg-red-50 border border-red-200 rounded-[11.4046px] p-6">
          <p className="text-body text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-shop-violet hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - 40px gap from content per design system */}
      <section className="text-center mb-12 p-8">
        <h1 className="text-3xl font-bold text-ink-black mb-4">
          Las cartas más compartidas
        </h1>
        <p className="text-body text-muted-text max-w-2xl mx-auto">
          Descubrí las cartas más populares en la comunidad de Yu-Gi-Oh! y encontrá
          propietarios para completar tu colección.
        </p>
      </section>

      {/* Cards Grid with stagger animation */}
      {cards.length === 0 ? (
        <div className="text-center py-12 bg-subtle-gray rounded-[11.4046px]">
          <p className="text-body text-muted-text">No cards found</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <Card
                card={card}
                onClick={() => navigate(`/cards/${card.id}`)}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}