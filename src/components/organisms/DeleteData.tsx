import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteData = ({ model, id }: { model: string; id: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this destination?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/auth/${model}/${id}`, {
        method: "DELETE",
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to delete destination");
      }

      toast.success("Destination deleted successfully");

      // Refresh or refetch destinations list
      router.refresh(); // or mutate() if you're using SWR/React Query
    } catch (err: any) {
      toast.error(err.message || "Error deleting destination");
      console.error("Delete error:", err);
    }
  };

  return (
    <span
      className="cursor-pointer font-semibold hover:text-red-500"
      onClick={handleDelete}
    >
      Delete
    </span>
  );
};

export default DeleteData;
