import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

const DeleteData = ({
  model,
  id,
  ieh,
  isButton,
  isIcon,
}: {
  model: string;
  id: string;
  ieh?: boolean;
  isButton?: boolean;
  isIcon?: boolean;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this");
    if (!confirmDelete) return;

    try {
      let res;
      if (ieh) {
        res = await fetch(`/api/auth/ieh/${id}`, {
          method: "DELETE",
        });
      } else {
        res = await fetch(`/api/auth/${model}/${id}`, {
          method: "DELETE",
        });
      }

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to delete");
      }

      toast.success("Deleted successfully");

      // Refresh or refetch destinations list
      router.refresh(); // or mutate() if you're using SWR/React Query
    } catch (err: any) {
      toast.error(err.message || "Error deleting");
      console.error("Delete error:", err);
    }
  };

  if (isIcon) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 px-2 text-destructive hover:text-white"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  if (isButton) {
    return (
      <Button
        variant="destructive"
        size="xs"
        onClick={handleDelete}
        className="text-white"
      >
        Delete
      </Button>
    );
  }
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
