import IEHModal from "@/components/organisms/IEH/IEFModal";
import IEHTable from "@/components/organisms/IEH/IEHTable";
import PageHeader from "@/components/organisms/PageHeader";
import IEHService from "@/services/ieh.service";
import { TriangleAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddCityPage() {
  const exclusionData = await IEHService.getAll({ type: "exclusion" });
  const { data, pagination } = exclusionData;
  const updateData = data?.map((item) => {
    if ("eid" in item) {
      return {
        id: item.eid,
        text: item.text,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: "exclusion",
      };
    }
    return {
      id: null,
      text: item.text,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      type: "exclusion",
    };
  });
  return (
    <>
      <PageHeader
        title="Exclusion"
        description="Manage reusable inclusions for your packages"
        Icon={TriangleAlert}
        modalComponent={IEHModal}
        modalProps={{ isEdit: false, title: "Exclusion" }}
      />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
