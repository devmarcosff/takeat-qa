'use client';

import axios from 'axios';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface IClientInfo {
    clientExist: boolean;
    clientBelongsToStore: boolean;
    totalClientCashback: string;
    minimum_rescue: string;
    clientEmail?: string;
    expires_at?: string;
    totalClientPoints?: string | null;
}

interface IClubContext {
    hasClub: boolean;
    tokenClub: string | null;
    clientInfo: IClientInfo | null;
    setHasClub: (hasClub: boolean) => void;
    setTokenClub: (token: string) => void;
    checkClientClub: (phone: string, storeId: number) => Promise<void>;
    confirmBirthday: (birthday: string, phone: string) => Promise<boolean>;
    canUseCashback: boolean;
    isLoading: boolean;
    error: string | null;
    checkRestaurantClub: (restaurantId: string) => Promise<void>;
}

const ClubContext = createContext<IClubContext | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
    const [hasClub, setHasClub] = useState(false);
    const [tokenClub, setTokenClub] = useState<string | null>(null);
    const [clientInfo, setClientInfo] = useState<IClientInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Verifica se o cliente pode usar cashback
    const canUseCashback = useMemo(() => {
        if (!clientInfo) return false;

        const totalCashback = parseFloat(clientInfo.totalClientCashback);
        const minimumRescue = parseFloat(clientInfo.minimum_rescue);

        return Boolean(
            clientInfo.clientExist &&
            clientInfo.clientBelongsToStore &&
            totalCashback > minimumRescue
        );
    }, [clientInfo]);

    // Verifica se o restaurante tem clube
    const checkRestaurantClub = useCallback(async (restaurantId: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://backend-gd.takeat.app/public/restaurant/foodies/${restaurantId}`);
            setHasClub(response.data.hasClub);
            if (response.data.hasClub) {
                setTokenClub(response.data.token_clube);
                localStorage.setItem('@deliveryTakeatRestaurant:token_clube', response.data.token_clube);
            }
        } catch (error) {
            console.error('Error checking restaurant club:', error);
            setError('Erro ao verificar clube do restaurante');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Verifica se o cliente pertence ao clube
    const checkClientClub = useCallback(async (phone: string, storeId: number) => {
        const cacheKey = `club:${phone}:${storeId}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            setClientInfo(JSON.parse(cached));
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://backend-gd.takeat.app/public/clube/client/${phone}/${storeId}`
            );
            setClientInfo(response.data);
            localStorage.setItem(cacheKey, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error checking client club:', error);
            setError('Erro ao verificar cliente do clube');
            setClientInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Confirma data de nascimento do cliente
    const confirmBirthday = useCallback(async (birthday: string, phone: string): Promise<boolean> => {
        if (!tokenClub) return false;

        try {
            setIsLoading(true);
            const response = await axios.post('https://backend.clubecliente.com/takeat/confirm-birthday', {
                birthday,
                phone: phone.replace(/[-\s]/g, ''),
                token: tokenClub
            });
            return response.data.success;
        } catch (error) {
            console.error('Error confirming birthday:', error);
            setError('Erro ao confirmar data de nascimento');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [tokenClub]);

    // Carrega dados do cache ao inicializar
    useEffect(() => {
        const cachedToken = localStorage.getItem('@deliveryTakeatRestaurant:token_clube');
        if (cachedToken) {
            setTokenClub(cachedToken);
            setHasClub(true);
        }
    }, []);

    const value = useMemo(() => ({
        hasClub,
        tokenClub,
        clientInfo,
        setHasClub,
        setTokenClub,
        checkClientClub,
        confirmBirthday,
        canUseCashback,
        isLoading,
        error,
        checkRestaurantClub
    }), [
        hasClub,
        tokenClub,
        clientInfo,
        checkClientClub,
        confirmBirthday,
        canUseCashback,
        isLoading,
        error,
        checkRestaurantClub
    ]);

    return (
        <ClubContext.Provider value={value}>
            {children}
        </ClubContext.Provider>
    );
}

export function useClub() {
    const context = useContext(ClubContext);
    if (context === undefined) {
        throw new Error('useClub must be used within a ClubProvider');
    }
    return context;
} 