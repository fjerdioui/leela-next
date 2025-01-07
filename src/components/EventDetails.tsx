import React, { useEffect, useState } from "react";
import { Event } from "@/types/event";

interface EventDetailsProps {
  event: Event; // Accept the full event object
}

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Unknown date";

import { createHash } from "crypto"; // For generating unique hashes

const generateImageHash = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");
    const buffer = await response.arrayBuffer();

    // Generate a hash from the image content
    const hash = createHash("sha256");
    hash.update(new Uint8Array(buffer));
    return hash.digest("hex");
  } catch (error) {
    console.error("Error generating hash for image:", error);
    return ""; // Fallback to avoid breaking logic
  }
};

const deduplicateImages = async (
  images: { url: string; width?: number; height?: number }[]
): Promise<{ url: string; width?: number; height?: number }[]> => {
  const uniqueImages: { [hash: string]: { url: string; width?: number; height?: number } } = {};

  for (const image of images) {
    const hash = await generateImageHash(image.url); // Generate unique hash
    if (hash && !uniqueImages[hash]) {
      uniqueImages[hash] = image; // Store the first occurrence
    }
  }

  return Object.values(uniqueImages); // Return deduplicated images
};

const EventDetails = ({ event }: EventDetailsProps) => {
  const [uniqueImages, setUniqueImages] = useState<
    { url: string; width?: number; height?: number }[]
  >([]);

  useEffect(() => {
    const processImages = async () => {
      if (event.images) {
        const deduplicated = await deduplicateImages(event.images); // Await the result
        setUniqueImages(deduplicated); // Set the deduplicated images
      }
    };

    processImages(); // Trigger async processing
  }, [event.images]);

  if (!event) {
    return <p className="text-gray-400">No event details available.</p>;
  }

  const address =
    event.location?.line1 ||
    event.venue?.[0]?.address?.line1 ||
    event.venue?.[0]?.city ||
    "Unknown address";

  const startDate = formatDate(event.sales?.[0]?.startDateTime);
  const endDate = formatDate(event.sales?.[0]?.endDateTime);

  return (
    <div
      className="flex flex-col space-y-3 text-white max-h-full overflow-y-auto p-4"
      style={{ maxHeight: "80vh" }}
    >
      <h2 className="text-2xl font-bold">{event.name}</h2>

      <p className="text-gray-400">
        <span className="font-semibold">Date:</span> {`${startDate} to ${endDate}`}
      </p>

      <p className="text-gray-400">
        <span className="font-semibold">Address:</span> {address}
      </p>

      {event.location?.postalCode && (
        <p className="text-gray-400">
          <span className="font-semibold">Postal Code:</span> {event.location.postalCode}
        </p>
      )}

      {event.location?.timezone && (
        <p className="text-gray-400">
          <span className="font-semibold">Timezone:</span> {event.location.timezone}
        </p>
      )}

      {event.genre && (
        <p className="text-gray-400">
          <span className="font-semibold">Genre:</span> {event.genre}
        </p>
      )}

      {event.subGenre && (
        <p className="text-gray-400">
          <span className="font-semibold">Subgenre:</span> {event.subGenre}
        </p>
      )}

      {event.price && (
        <p className="text-gray-400">
          <span className="font-semibold">Price:</span> {event.price}
        </p>
      )}

      {event.url && (
        <div>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-400"
          >
            Buy Tickets
          </a>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Gallery</h3>
        <div className="grid grid-cols-3 gap-4">
          {uniqueImages.map((image, index) => (
            <div
              key={index}
              className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={image.url}
                alt={`${event.name} image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400">{event.description || "No description available"}</p>
    </div>
  );
};

export default EventDetails;
