import { apiService } from '@/lib/gatepass/apiService';
import { operationalData } from '@/lib/gatepass/operationalData';
import RoomDetailsClient from './RoomDetailsClient';

export const dynamicParams = true; // Allow new rooms to be loaded dynamically even if not pre-rendered

export async function generateStaticParams() {
    try {
        const rooms = await apiService.getRooms();
        if (!rooms || rooms.length === 0) {
            return operationalData.getRooms().map(room => ({ id: room.id }));
        }
        return rooms.map((room) => ({
            id: room.id.toString(),
        }));
    } catch (error) {
        // Silently fallback to operational data during build if backend is down
        // This prevents the build from failing or logging massive network errors
        return operationalData.getRooms().map(room => ({ id: room.id }));
    }
}

export default function RoomDetails() {
    return <RoomDetailsClient />;
}
