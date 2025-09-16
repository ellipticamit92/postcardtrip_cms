import PageHeader from "@/components/molecules/PageHeader";
import DestinationGrid from "@/components/organisms/destinations/DestinationGrid";
import DestinationTable from "@/components/organisms/destinations/DestinationTable";
import ViewLayout from "@/components/templates/ViewLayout";
import DestinationService from "@/services/destination.service";
import { PencilIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const ReviewsPage = async () => {
  const destinationsData = await DestinationService.getAll();
  const { data, pagination } = destinationsData;
  return (
    <>
      <PageHeader
        title="Reviews"
        description="Manage user travel reviews"
        Icon={PencilIcon}
        href="/reviews/add"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"name"}
        GridComponent={DestinationGrid}
        ListComponent={DestinationGrid}
        TableComponent={DestinationTable}
      />
    </>
  );
};

export default ReviewsPage;
