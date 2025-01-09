    export type Event = {
        id: string; 
        name: string;
        description?: string;
        date?: string;
        eventType?: string; // Added eventType
        genre?: string;
        subGenre?: string;
        price?: string;
        images?: { url: string }[];
        location?: {
            line1?: string;
            city?: string;
            postalCode?: string;
            timezone?: string;
        };
        lat?: number; 
        lng?: number; 
        venue?: {
            address?: {
                line1?: string;
                line2?: string;
            };
            city?: string;
            postalCode?: string;
            timezone?: string;
        }[];
        sales?: {
            startDateTime?: string;
            endDateTime?: string;
        }[];
        url?: string;
    };
