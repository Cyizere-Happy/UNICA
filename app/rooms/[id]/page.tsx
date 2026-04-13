import { apiService } from '@/lib/gatepass/apiService';
import RoomDetailsClient from './RoomDetailsClient';

export const dynamicParams = false;


export async function generateStaticParams() {
    try {
        const rooms = await apiService.getRooms();
        return rooms.map((room) => ({
            id: room.id.toString(),
        }));
    } catch (error) {
        console.error('Failed to fetch rooms for static generation:', error);
        // Return an empty array to let the build pass.
        // Dynamic segments will be handled on the client.
        return [];
    }
}

export default function RoomDetails() {
    return <RoomDetailsClient />;
}
