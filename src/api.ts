export const fetchEvents = async (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api'}/events?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`
      );
      const data = await response.json();
  
      // Map the response to match expected structure
      return data.events.map((event: any) => ({
        id: event._id,
        name: event.name,
        description: event.classifications[0]?.genre || 'No description',
        date: event.dates[0]?.start?.dateTime || 'No date',
        location: event.venue[0]?.address?.line1 || 'No location',
        lat: event.location.latitude, // Map latitude to lat
        lng: event.location.longitude, // Map longitude to lng
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };
  