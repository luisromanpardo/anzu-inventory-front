import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersApi } from '../../api';
import { useAuthStore } from '../../stores';
import { Button } from '../../components/ui';
import type { PublicProfile } from '../../types';
import { ArrowLeft, Package, Calendar } from 'lucide-react';

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        const data = await usersApi.getPublicProfile(username);
        setProfile(data);
      } catch {
        setError('Profile not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-red-600 mb-4">{error || 'Profile not found'}</p>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} className="mr-2" />
          Go home
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <div className="bg-canvas rounded-[28px] p-6 shadow-lg mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-black">{profile.username}</h1>
            <p className="text-body-sm text-muted-text capitalize">{profile.role}</p>
          </div>
          {isOwner && (
            <Link to="/profile">
              <Button variant="rounded-white">Edit Profile</Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-subtle-gray rounded-[11.4046px] p-4 text-center">
            <p className="text-2xl font-bold text-ink-black">{profile.card_count}</p>
            <p className="text-caption text-muted-text">Cards</p>
          </div>
          <div className="bg-subtle-gray rounded-[11.4046px] p-4 text-center">
            <p className="text-2xl font-bold text-ink-black">
              {profile.inventory.reduce((sum, item) => sum + item.cantidad, 0)}
            </p>
            <p className="text-caption text-muted-text">Total copies</p>
          </div>
          <div className="bg-subtle-gray rounded-[11.4046px] p-4 text-center">
            <p className="text-caption text-muted-text flex items-center justify-center gap-1">
              <Calendar size={14} />
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Social Links */}
        {(profile.social.instagram || profile.social.twitter || profile.social.whatsapp || profile.social.discord) && (
          <div className="flex flex-wrap gap-2">
            {profile.social.instagram && (
              <a
                href={`https://instagram.com/${profile.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-subtle-gray rounded-full text-body-sm text-ink-black hover:bg-shop-violet/10 transition-colors"
              >
                @{profile.social.instagram}
              </a>
            )}
            {profile.social.twitter && (
              <a
                href={`https://twitter.com/${profile.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-subtle-gray rounded-full text-body-sm text-ink-black hover:bg-shop-violet/10 transition-colors"
              >
                @{profile.social.twitter}
              </a>
            )}
            {profile.social.whatsapp && (
              <a
                href={`https://wa.me/${profile.social.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-subtle-gray rounded-full text-body-sm text-ink-black hover:bg-shop-violet/10 transition-colors"
              >
                WhatsApp
              </a>
            )}
            {profile.social.discord && (
              <span className="px-4 py-2 bg-subtle-gray rounded-full text-body-sm text-ink-black">
                Discord: {profile.social.discord}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inventory */}
      <div>
        <h2 className="text-xl font-bold text-ink-black mb-4 flex items-center gap-2">
          <Package size={20} />
          Inventory
        </h2>
        {profile.inventory.length === 0 ? (
          <div className="text-center py-8 bg-subtle-gray rounded-[11.4046px]">
            <p className="text-body text-muted-text">This user has no cards in their inventory</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {profile.inventory.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/cards/${item.card_id}`)}
                className="bg-canvas rounded-[11.4046px] p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-[11.4046px] mb-3 bg-subtle-gray">
                  {item.card?.image_url && (
                    <img
                      src={item.card.image_url}
                      alt={item.card?.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <h3 className="text-body font-medium text-ink-black line-clamp-1">{item.card?.name || 'Unknown'}</h3>
                <p className="text-caption text-muted-text">
                  {item.cantidad}x • {item.condicion.replace('_', ' ')} • {item.idioma}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}