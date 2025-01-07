"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchEvents } from "@/api";
import EventDetails from "./EventDetails";
import { Event } from "@/types/event";

const EventMap = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>(null);

  // Filter states
  const [eventType, setEventType] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

  // Fetch events and filters dynamically
  const loadEvents = async () => {
    if (!mapRef.current) return;
  
    const bounds = mapRef.current.getBounds();
    const minLat = bounds.getSouthWest().lat;
    const maxLat = bounds.getNorthEast().lat;
    const minLng = bounds.getSouthWest().lng;
    const maxLng = bounds.getNorthEast().lng;
  
    try {
      const query = new URLSearchParams({
        minLat: minLat.toString(),
        maxLat: maxLat.toString(),
        minLng: minLng.toString(),
        maxLng: maxLng.toString(),
        ...(eventType && { eventType }),
        ...(genre && { genre }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      }).toString();
  
      const response = await fetch(`http://localhost:4000/api/events?${query}`);
      const data = await response.json();
  
      // Map response to ensure lat/lng fields exist
      const transformedEvents = data.events.map((event: any) => ({
        ...event,
        lat: event.location?.latitude, // Map latitude to lat
        lng: event.location?.longitude, // Map longitude to lng
        eventType: event.classifications?.[0]?.segment || "Other", // Handle event type
        genre: event.classifications?.[0]?.genre || "Other", // Handle genre
        date: event.dates?.[0]?.start?.dateTime || null, // Handle date
      }));
  
      setEvents(transformedEvents);
      setEventTypes(data.eventTypes || []);
      setGenres(data.genresByEventType?.[eventType || ""] || []);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };  

  // Update filtered events
  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesEventType = eventType ? event.eventType === eventType : true;
      const matchesGenre = genre ? event.genre === genre : true;

      const eventDate = new Date(event.date || "").getTime();
      const startDate = dateRange.start ? new Date(dateRange.start).getTime() : null;
      const endDate = dateRange.end ? new Date(dateRange.end).getTime() : null;

      const matchesDate =
        (!startDate || eventDate >= startDate) &&
        (!endDate || eventDate <= endDate);

      return matchesEventType && matchesGenre && matchesDate;
    });

    setFilteredEvents(filtered);
  }, [eventType, genre, dateRange, events]);

  // Initialize map and set event listeners
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(mapRef.current);

      mapRef.current.on("moveend", loadEvents);
    }

    loadEvents();
  }, []);

  // Add filtered events to the map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const customIcon = (size: [number, number], className = "") =>
      L.divIcon({
        className: `custom-marker ${className}`,
        html: `<div style="width: ${size[0]}px; height: ${size[1]}px; 
            background: url('/icons/location.png') no-repeat center center; 
            background-size: contain; pointer-events: auto;"></div>`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
      });

    filteredEvents.forEach((event) => {
      const latitude = event.lat;
      const longitude = event.lng;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        console.error("Invalid coordinates for event:", event);
        return;
      }

      const marker = L.marker([latitude, longitude], { icon: customIcon([30, 40]) }).addTo(map);

      let isHovered = false;

      marker.on("mouseover", (e) => {
        if (isHovered) return;
        isHovered = true;
        setHoveredEvent(event);
        const position = map.latLngToContainerPoint(e.latlng);
        setHoveredPosition({ top: position.y, left: position.x });
        marker.setIcon(customIcon([40, 50], "hovered"));
      });

      marker.on("mouseout", () => {
        isHovered = false;
        setHoveredEvent(null);
        setHoveredPosition(null);
        marker.setIcon(customIcon([30, 40]));
      });

      marker.on("click", () => {
        setSelectedEvent(event);
      });
    });
  }, [filteredEvents]);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Filter Panel */}
      <div className="absolute bottom-4 left-4 z-30 bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
        {/* Event Type Dropdown */}
        <div>
          <label className="text-white block mb-1">Event Type:</label>
          <select
            value={eventType || ""}
            onChange={(e) => {
              setEventType(e.target.value || null);
              setGenre(null); // Reset genre when eventType changes
              loadEvents(); // Fetch new data
            }}
            className="p-2 bg-gray-700 text-white rounded-md w-full"
          >
            <option value="">All</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Dropdown */}
        <div>
          <label className="text-white block mb-1">Genre:</label>
          <select
            value={genre || ""}
            onChange={(e) => setGenre(e.target.value || null)}
            className="p-2 bg-gray-700 text-white rounded-md w-full"
            disabled={!eventType}
          >
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div>
          <label className="text-white block mb-1">Start Date:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="p-2 bg-gray-700 text-white rounded-md w-full"
          />
        </div>
        <div>
          <label className="text-white block mb-1">End Date:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="p-2 bg-gray-700 text-white rounded-md w-full"
          />
        </div>
      </div>

      {/* Map Container */}
      <div id="map" className="w-full h-full z-10"></div>

      {/* Event Hover Tooltip */}
      {hoveredEvent && hoveredPosition && (
        <div
          className="absolute z-40 bg-gray-800 p-4 shadow-lg rounded-md text-sm text-white border border-gray-600"
          style={{
            top: `${hoveredPosition.top}px`,
            left: `${hoveredPosition.left}px`,
            transform: "translate(-50%, -10%)",
          }}
        >
          <p className="text-lg font-bold">{hoveredEvent.name}</p>
          <p>
            {hoveredEvent.location?.line1 || hoveredEvent.location?.city || "Location not available"}
          </p>
        </div>
      )}

      {/* Event Details Panel */}
      {selectedEvent && (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-800 text-white shadow-lg border-l border-gray-700 z-50 transition-transform transform translate-x-0">
          <div className="p-6">
            <EventDetails event={selectedEvent} />
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMap;
