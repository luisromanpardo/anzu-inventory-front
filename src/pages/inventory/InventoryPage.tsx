import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore, useAuthStore, useUIStore } from '../../stores';
import { Button, Modal } from '../../components/ui';
import type { InventoryItem, Condition, Language, Edition } from '../../types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const CONDITIONS: Condition[] = ['mint', 'near_mint', 'excellent', 'good', 'light_plaid', 'plaid', 'poor'];
const LANGUAGES: Language[] = ['english', 'japanese', 'spanish', 'french', 'german', 'italian', 'portuguese'];
const EDITIONS: Edition[] = ['1st_edition', 'unlimited'];

export function InventoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, fetchMyInventory, addItem, updateItem, deleteItem } = useInventoryStore();
  const { addToast } = useUIStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add form state
  const [selectedCardId, setSelectedCardId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addCondition, setAddCondition] = useState<Condition>('near_mint');
  const [addLanguage, setAddLanguage] = useState<Language>('english');
  const [addEdition, setAddEdition] = useState<Edition>('unlimited');
  const [addNotes, setAddNotes] = useState('');

  // Edit form state
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCondition, setEditCondition] = useState<Condition>('near_mint');
  const [editLanguage, setEditLanguage] = useState<Language>('english');
  const [editEdition, setEditEdition] = useState<Edition>('unlimited');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyInventory();
  }, [isAuthenticated, navigate, fetchMyInventory]);

  const filteredItems = items.filter(item =>
    item.card?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  const handleOpenAddModal = () => {
    setSelectedCardId('');
    setAddQuantity(1);
    setAddCondition('near_mint');
    setAddLanguage('english');
    setAddEdition('unlimited');
    setAddNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditQuantity(item.cantidad);
    setEditCondition(item.condicion);
    setEditLanguage(item.idioma);
    setEditEdition(item.edicion || 'unlimited');
    setEditNotes(item.notas || '');
  };

  const handleAddSubmit = async () => {
    if (!selectedCardId) return;
    try {
      await addItem({
        card_id: selectedCardId,
        cantidad: addQuantity,
        condicion: addCondition,
        idioma: addLanguage,
        edicion: addEdition,
        notas: addNotes || undefined,
      });
      addToast({ message: 'Card added to inventory', type: 'success' });
      setIsAddModalOpen(false);
    } catch {
      addToast({ message: 'Failed to add card', type: 'error' });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    try {
      await updateItem(editingItem.id, {
        cantidad: editQuantity,
        condicion: editCondition,
        idioma: editLanguage,
        edicion: editEdition,
        notas: editNotes || undefined,
      });
      addToast({ message: 'Card updated', type: 'success' });
      setEditingItem(null);
    } catch {
      addToast({ message: 'Failed to update card', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this card from your inventory?')) return;
    try {
      await deleteItem(id);
      addToast({ message: 'Card removed from inventory', type: 'success' });
    } catch {
      addToast({ message: 'Failed to remove card', type: 'error' });
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-black">Mi Inventario</h1>
          <p className="text-body-sm text-muted-text">
            {items.length} / 100 cartas distintas
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-shop-violet text-white hover:bg-shop-violet/90">
          <Plus size={16} className="mr-2" />
          Agregar carta
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={20} />
        <input
          type="text"
          placeholder="Buscar en mi inventario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-[10000px] bg-transparent border border-subtle-gray text-ink-black placeholder:text-placeholder-text focus:outline-none focus:ring-2 focus:ring-shop-violet"
        />
      </div>

      {/* Inventory Table */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-subtle-gray rounded-[11.4046px]">
          <p className="text-body text-muted-text mb-4">Tu inventario está vacío</p>
          <Button onClick={handleOpenAddModal} variant="rounded-white">
            <Plus size={16} className="mr-2" />
            Agrega tu primera carta
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-subtle-gray">
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Carta</th>
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Cantidad</th>
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Condición</th>
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Idioma</th>
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Edición</th>
                <th className="text-left py-3 px-4 text-body-sm font-medium text-muted-text">Notas</th>
                <th className="text-right py-3 px-4 text-body-sm font-medium text-muted-text">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-subtle-gray hover:bg-subtle-gray/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/cards/${item.card_id}`)}>
                      <div className="w-12 h-16 rounded-[4px] overflow-hidden bg-subtle-gray flex-shrink-0">
                        {item.card?.image_url && (
                          <img
                            src={item.card.image_url}
                            alt={item.card?.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-body font-medium text-ink-black">{item.card?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-body text-ink-black">{item.cantidad}</td>
                  <td className="py-3 px-4 text-body text-ink-black capitalize">{item.condicion.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-body text-ink-black capitalize">{item.idioma}</td>
                  <td className="py-3 px-4 text-body text-ink-black">
                    {item.edicion === '1st_edition' ? '1st Edition' : 'Unlimited'}
                  </td>
                  <td className="py-3 px-4 text-body text-muted-text text-caption max-w-[150px] truncate">
                    {item.notas || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(item);
                        }}
                        className="p-2 hover:bg-subtle-gray rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-muted-text" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar carta"
        description="Busca y selecciona una carta para agregar a tu inventario"
      >
        <div className="space-y-4">
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Card ID</label>
            <input
              type="text"
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              placeholder="Enter card ID or search..."
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
            />
          </div>
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Cantidad</label>
            <input
              type="number"
              min="1"
              value={addQuantity}
              onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
            />
          </div>
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Condición</label>
            <select
              value={addCondition}
              onChange={(e) => setAddCondition(e.target.value as Condition)}
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Idioma</label>
            <select
              value={addLanguage}
              onChange={(e) => setAddLanguage(e.target.value as Language)}
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Edición</label>
            <select
              value={addEdition}
              onChange={(e) => setAddEdition(e.target.value as Edition)}
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
            >
              {EDITIONS.map((e) => (
                <option key={e} value={e}>{e === '1st_edition' ? '1st Edition' : 'Unlimited'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-body-sm text-muted-text block mb-2">Notas (opcional)</label>
            <textarea
              value={addNotes}
              onChange={(e) => setAddNotes(e.target.value)}
              placeholder="Any additional notes..."
              className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet resize-none"
              rows={3}
            />
          </div>
          <Button
            onClick={handleAddSubmit}
            className="w-full bg-shop-violet text-white hover:bg-shop-violet/90"
            disabled={!selectedCardId}
          >
            Agregar a mi inventario
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title="Editar carta"
          description={editingItem.card?.name}
        >
          <div className="space-y-4">
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Condición</label>
              <select
                value={editCondition}
                onChange={(e) => setEditCondition(e.target.value as Condition)}
                className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Idioma</label>
              <select
                value={editLanguage}
                onChange={(e) => setEditLanguage(e.target.value as Language)}
                className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Edición</label>
              <select
                value={editEdition}
                onChange={(e) => setEditEdition(e.target.value as Edition)}
                className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray bg-canvas text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet"
              >
                {EDITIONS.map((e) => (
                  <option key={e} value={e}>{e === '1st_edition' ? '1st Edition' : 'Unlimited'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Notas (opcional)</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 rounded-[22.8092px] border border-subtle-gray text-ink-black focus:outline-none focus:ring-2 focus:ring-shop-violet resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setEditingItem(null)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleEditSubmit} className="flex-1 bg-shop-violet text-white hover:bg-shop-violet/90">
                Guardar cambios
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}