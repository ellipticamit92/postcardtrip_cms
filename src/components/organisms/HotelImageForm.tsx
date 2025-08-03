"use client";

import { useHotelImages } from "@/hooks/useHotelImages";
import { useState } from "react";
import z from "zod";
import { Form } from "../ui/form";

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  overview: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type HotelImageFormData = z.infer<typeof schema>;

interface HotelImageFormProps {
  hotelId?: number;
}

export function HotelImageForm() {
  return (
    <div>
      asdfasdf<div>asdfasdf</div>
    </div>
  );
}

// export default function HotelImageGallery({ hotelId }: HotelImageGalleryProps) {
//   const { images, loading, error, createImage, deleteImage } =
//     useHotelImages(hotelId);
//   const [newImageUrl, setNewImageUrl] = useState("");
//   const [newImageCaption, setNewImageCaption] = useState("");

//   const handleAddImage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newImageUrl) {
//       try {
//         await createImage({
//           url: newImageUrl,
//           caption: newImageCaption || undefined,
//           hotelId,
//         });
//         setNewImageUrl("");
//         setNewImageCaption("");
//       } catch (error) {
//         console.error("Failed to add image:", error);
//       }
//     }
//   };

//   if (loading) return <div className="p-4">Loading images...</div>;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Hotel Images</h2>

//       {/* Add new image form */}
//       <form onSubmit={handleAddImage} className="mb-6 p-4 border rounded">
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Image URL</label>
//           <input
//             type="url"
//             value={newImageUrl}
//             onChange={(e) => setNewImageUrl(e.target.value)}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Caption (Optional)
//           </label>
//           <input
//             type="text"
//             value={newImageCaption}
//             onChange={(e) => setNewImageCaption(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add Image
//         </button>
//       </form>

//       {/* Image grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {images.map((image) => (
//           <div key={image.hiid} className="border rounded p-4">
//             <img
//               src={image.url}
//               alt={image.caption || "Hotel image"}
//               className="w-full h-48 object-cover rounded mb-2"
//             />
//             {image.caption && (
//               <p className="text-sm text-gray-600 mb-2">{image.caption}</p>
//             )}
//             <button
//               onClick={() => deleteImage(image.hiid)}
//               className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>

//       {images.length === 0 && (
//         <p className="text-gray-500 text-center py-8">
//           No images found for this hotel.
//         </p>
//       )}
//     </div>
//   );
// }
