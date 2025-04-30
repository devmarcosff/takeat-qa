import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('pwa-install-accepted');
        if (hasAccepted) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            localStorage.setItem('pwa-install-accepted', 'true');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-accepted', 'true');
        setShowInstallPrompt(false);
    };

    if (!showInstallPrompt) return null;

    return (
        <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Instalar Takeat App</DialogTitle>
                    <DialogDescription>
                        Instale o aplicativo Takeat para uma experiência melhor! Você terá acesso offline e uma interface mais rápida.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <Button onClick={handleInstall} className="w-full">
                        Instalar
                    </Button>
                    <Button variant="outline" onClick={handleDismiss} className="w-full">
                        Agora não
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 