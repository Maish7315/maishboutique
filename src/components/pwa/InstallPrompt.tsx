import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="install-prompt"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-7 h-7 text-primary-foreground" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg">Install Maish Fashion</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get the app experience! Shop faster, get notifications, and access offline.
            </p>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleInstall}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
              <Button
                variant="outline"
                onClick={() => setDismissed(true)}
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
