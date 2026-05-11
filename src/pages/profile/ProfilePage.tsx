import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../stores';
import { usersApi } from '../../api';
import { Button, Input } from '../../components/ui';
import type { User } from '../../types';
import { Save } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [discord, setDiscord] = useState('');
  const [konamiId, setKonamiId] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await usersApi.getMe();
        setProfile(data);
        setUsername(data.username || '');
        setInstagram(data.social?.instagram || '');
        setTwitter(data.social?.twitter || '');
        setFacebook(data.social?.facebook || '');
        setWhatsapp(data.social?.whatsapp || '');
        setDiscord(data.social?.discord || '');
        setKonamiId(data.social?.konami_id || '');
        setIsPublic(data.is_public ?? true);
      } catch {
        addToast({ message: 'Failed to load profile', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated, navigate, addToast]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await usersApi.updateMe({
        username,
        instagram: instagram || undefined,
        twitter: twitter || undefined,
        facebook: facebook || undefined,
        whatsapp: whatsapp || undefined,
        discord: discord || undefined,
        konami_id: konamiId || undefined,
        is_public: isPublic,
      });
      addToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch {
      addToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-ink-black mb-6">Mi Perfil</h1>

      <div className="bg-canvas rounded-[28px] p-6 shadow-lg space-y-6">
        {/* Username */}
        <div>
          <label className="text-body-sm text-muted-text block mb-2">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="text-body-sm text-muted-text block mb-2">Email</label>
          <Input
            value={profile?.email || ''}
            disabled
            className="opacity-60 cursor-not-allowed"
          />
          <p className="text-caption text-soft-gray mt-1">Email cannot be changed</p>
        </div>

        {/* Social Links */}
        <div className="border-t border-subtle-gray pt-6">
          <h3 className="text-body font-semibold text-ink-black mb-4">Redes Sociales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Instagram</label>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Twitter/X</label>
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Facebook</label>
              <Input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Facebook profile"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">WhatsApp</label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+54 11 1234 5678"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Discord</label>
              <Input
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="username#1234"
              />
            </div>
            <div>
              <label className="text-body-sm text-muted-text block mb-2">Konami ID</label>
              <Input
                value={konamiId}
                onChange={(e) => setKonamiId(e.target.value)}
                placeholder="Your Konami ID"
              />
            </div>
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-subtle-gray rounded-[11.4046px]">
          <div>
            <p className="text-body font-medium text-ink-black">Perfil público</p>
            <p className="text-caption text-muted-text">Allow others to see your inventory</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isPublic ? 'bg-shop-violet' : 'bg-subtle-gray'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isPublic ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-shop-violet text-white hover:bg-shop-violet/90"
        >
          <Save size={16} className="mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}