import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardsApi } from '../../api';
import { Card, Button } from '../../components/ui';
import type { HomeCard, PaginationInfo } from '../../types';
import { Search } from 'lucide-react';

export function CardsPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<HomeCard[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState('');

  const fetchCards = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await cardsApi.search({
        q: searchQuery || undefined,
        archetype: archetypeFilter || undefined,
        page,
        limit: 20,
      });
      setCards(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(1);
  }, [searchQuery, archetypeFilter]);

  const handlePageChange = (newPage: number) => {
    fetchCards(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-black mb-6">Catálogo de Cartas</h1>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-[10000px] bg-transparent border border-subtle-gray text-ink-black placeholder:text-placeholder-text focus:outline-none focus:ring-2 focus:ring-shop-violet"
          />
        </div>
        <select
          value={archetypeFilter}
          onChange={(e) => setArchetypeFilter(e.target.value)}
          className="px-4 py-3 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
        >
          <option value="">Todos los arquetipos</option>
          {/* Add archetype options dynamically */}
        </select>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-body text-muted-text">No se encontraron cartas</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => navigate(`/cards/${card.id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Anterior
              </Button>
              <span className="text-body-sm text-muted-text px-4">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}