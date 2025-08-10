// "use client";

// import { z } from "zod";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { FormInput } from "../atoms/FormInput";
// import { FormSelect } from "../atoms/FormSelect";
// import { Form } from "../ui/form";
// import { Loader2 } from "lucide-react";
// import ImageUploader from "../atoms/ImageUploader";
// import { useHotelImages } from "@/hooks/use-hotel-images";

// const hotelImageSchema = z.object({
//   url: z.string().min(2, "Hotel image url is required"),
//   caption: z.string().min(2, "Hotel Image caption is too short"),
//   hotelId: z.string().min(1, "Please atleast one number"),
// });

// type HotelImageFormValues = z.infer<typeof hotelImageSchema>;

// interface HotelImageFormProps {
//   hotels: { label: string; value: string }[];
//   initialData?: HotelImageFormValues;
//   hotelImageId?: number;
// }

// export function HotelImageForm({
//   hotels,
//   initialData,
//   hotelImageId,
// }: HotelImageFormProps) {
//   const { loading, createImage, updateImage } = useHotelImages({
//     autoFetch: false,
//   });
//   const form = useForm<HotelImageFormValues>({
//     resolver: zodResolver(hotelImageSchema),
//     defaultValues: initialData || {
//       url: "",
//       hotelId: hotels?.[0]?.value || "0",
//       caption: "",
//     },
//   });

//   const { control, handleSubmit, reset } = form;

//   const onSubmit = async (data: HotelImageFormValues) => {
//     try {
//       const isEditMode = Boolean(hotelImageId);

//       const submitData = {
//         caption: data.caption.trim(),
//         url: data.url.trim(),
//         hotelId: parseInt(data.hotelId),
//       };

//       console.log("DEBUG data - ", submitData);

//       let result;
//       if (isEditMode && hotelImageId) {
//         result = await updateImage(hotelImageId, submitData);
//       } else {
//         result = await createImage(submitData);
//       }

//       if (!isEditMode) {
//         //reset();
//       }
//     } catch (err: any) {
//       console.error("Error submitting destination", err);
//       toast.error(err.message || "Error submitting destination");
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
//         <Controller
//           control={control}
//           name="url"
//           render={({ field }) => (
//             <ImageUploader
//               value={field.value}
//               onChange={field.onChange}
//               label="Upload Hotel Image"
//             />
//           )}
//         />
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <FormInput
//             label="Hotel Image Caption"
//             name="caption"
//             placeholder="Enter hotel image caption"
//             control={control}
//           />
//           <FormSelect
//             label="Select Hotel"
//             name="hotelId"
//             control={control}
//             options={hotels}
//             placeholder="Select Hotel"
//           />
//           <FormInput
//             disabled
//             name="url"
//             control={control}
//             label="Hotel Image URL"
//           />
//         </div>

//         <Button type="submit" disabled={loading}>
//           {loading && <Loader2 className="animate-spin mr-2" />}
//           {initialData ? "Update" : "Add"} Hotel Image
//         </Button>
//       </form>
//     </Form>
//   );
// }
