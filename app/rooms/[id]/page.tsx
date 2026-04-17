import { apiService } from '@/lib/gatepass/apiService';
import RoomDetailsClient from './RoomDetailsClient';

export const dynamicParams = false;


export async function generateStaticParams() {
    try {
        const rooms = await apiService.getRooms();
        if (!rooms || rooms.length === 0) {
            return [{ id: '1' }];
        }
        return rooms.map((room) => ({
            id: room.id.toString(),
        }));
    } catch (error) {
        console.error('Failed to fetch rooms for static generation:', error);
        // Fallback to a placeholder ID to ensure the build passes for output: export
        return [{ id: 'placeholder' }];
    }
}

export default function RoomDetails() {
    return <RoomDetailsClient />;
}
