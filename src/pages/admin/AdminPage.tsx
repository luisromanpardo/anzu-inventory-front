import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { useAuthStore, useUIStore } from '../../stores';
import { Button } from '../../components/ui';
import type { SyncStatus } from '../../types';
import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function AdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchSyncStatus();
  }, [isAuthenticated, user, navigate]);

  const fetchSyncStatus = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getSyncStatus();
      setSyncStatus(data);
    } catch {
      addToast({ message: 'Failed to load sync status', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const result = await adminApi.triggerSync();
      addToast({
        message: `Sync complete: ${result.cards_created} created, ${result.cards_updated} updated`,
        type: 'success',
      });
      setSyncStatus({
        synced_at: new Date().toISOString(),
        cards_created: result.cards_created,
        cards_updated: result.cards_updated,
        status: 'completed',
        duration_ms: result.duration_ms,
      });
    } catch {
      addToast({ message: 'Sync failed', type: 'error' });
      setSyncStatus((prev) => prev ? { ...prev, status: 'failed' } : null);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-shop-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusIcon = () => {
    if (!syncStatus) return null;
    switch (syncStatus.status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={20} className="text-shop-violet animate-spin" />;
      default:
        return <Clock size={20} className="text-muted-text" />;
    }
  };

  const getStatusText = () => {
    if (!syncStatus) return 'Unknown';
    switch (syncStatus.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running...';
      default:
        return 'Idle';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-ink-black mb-6">Admin Panel</h1>

      {/* Sync Status Card */}
      <div className="bg-canvas rounded-[28px] p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-ink-black mb-4 flex items-center gap-2">
          <RefreshCw size={20} />
          Database Sync
        </h2>

        {syncStatus && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-subtle-gray rounded-[11.4046px]">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className="text-body font-medium text-ink-black">Status: {getStatusText()}</p>
                  {syncStatus.synced_at && (
                    <p className="text-caption text-muted-text">
                      Last sync: {new Date(syncStatus.synced_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              {syncStatus.duration_ms && (
                <p className="text-body-sm text-muted-text">
                  Duration: {(syncStatus.duration_ms / 1000).toFixed(2)}s
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-[11.4046px] p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{syncStatus.cards_created}</p>
                <p className="text-caption text-green-600">Cards Created</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-[11.4046px] p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{syncStatus.cards_updated}</p>
                <p className="text-caption text-blue-600">Cards Updated</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-[11.4046px] p-4 mb-6">
          <p className="text-body-sm text-yellow-800">
            ⚠️ La sincronización puede tardar varios minutos dependiendo de la cantidad de cartas
            en la base de datos. No cierre esta página mientras la sync esté en curso.
          </p>
        </div>

        {/* Sync Button */}
        <Button
          onClick={handleSync}
          disabled={isSyncing || syncStatus?.status === 'running'}
          className="w-full bg-shop-violet text-white hover:bg-shop-violet/90"
        >
          {isSyncing ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Sincronizar ahora
            </>
          )}
        </Button>
      </div>
    </div>
  );
}