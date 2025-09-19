import IEHModal from "@/components/organisms/IEH/IEFModal";
import IEHTable from "@/components/organisms/IEH/IEHTable";
import PageHeader from "@/components/organisms/PageHeader";
import IEHService from "@/services/ieh.service";
import { SquaresIntersect } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InclusionPage() {
  const inclusionData = await IEHService.getAll({ type: "inclusion" });
  const { data, pagination } = inclusionData;
  const updateData = data?.map((item) => {
    if ("lid" in item) {
      return {
        id: item.lid,
        text: item.text,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: "inclusion",
      };
    }
    return {
      id: null,
      text: item.text,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      type: "inclusion",
    };
  });

  return (
    <>
      <PageHeader
        title="Inclusion"
        description="Manage travel destinations and locations"
        Icon={SquaresIntersect}
        modalComponent={IEHModal}
        modalProps={{ isEdit: false, title: "Inclusion" }}
      />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
