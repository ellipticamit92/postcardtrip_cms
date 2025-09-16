import { Heading } from "@/components/atoms/Heading";
import { PencilIcon } from "lucide-react";

const AddReviewPage = () => {
  return (
    <>
      <Heading
        text="Create Destination"
        href="/destination"
        Icon={PencilIcon}
      />
    </>
  );
};

export default AddReviewPage;
