(function initDesktopCloudSyncBridge() {
  const pmSync = window.environmentApp && window.environmentApp.pmSync;
  if (!pmSync) {
    return;
  }

  window.pfinePushSnapshotToCloud = async function pfinePushSnapshotToCloud(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') {
      return null;
    }
    try {
      const response = await pmSync.push(snapshot);
      if (!response || !response.ok) {
        console.warn('[PFine Sync] Push returned non-ok response:', response && response.error);
      }
      return response;
    } catch (error) {
      console.error('[PFine Sync] Failed to push snapshot:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };

  window.pfinePullSnapshotFromCloud = async function pfinePullSnapshotFromCloud() {
    try {
      return await pmSync.pull();
    } catch (error) {
      console.error('[PFine Sync] Failed to pull snapshot:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };

  if (typeof pmSync.onUpdated === 'function') {
    pmSync.onUpdated((updatedSnapshot) => {
      if (!updatedSnapshot || typeof updatedSnapshot !== 'object') {
        return;
      }
      window.__pfineLatestCloudSnapshot = updatedSnapshot;
      window.dispatchEvent(new CustomEvent('pfine:cloud-snapshot-updated', {
        detail: updatedSnapshot
      }));
    });
  }
})();