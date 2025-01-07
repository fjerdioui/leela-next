// Path: src/app/page.tsx

import React from 'react';
import EventMap from '@/components/event/EventMap';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <EventMap />
    </main>
  );
};

export default Home;
