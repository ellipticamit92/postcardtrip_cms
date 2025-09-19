import IEHModal from "@/components/organisms/IEH/IEFModal";
import IEHTable from "@/components/organisms/IEH/IEHTable";
import PageHeader from "@/components/organisms/PageHeader";
import IEHService from "@/services/ieh.service";
import { Siren } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HighlightPage() {
  const highlightData = await IEHService.getAll({ type: "highlight" });
  const { data, pagination } = highlightData;
  const updateData = data?.map((item) => {
    if ("hlid" in item) {
      return {
        id: item.hlid,
        text: item.text,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        type: "highlight",
      };
    }
    return {
      id: null,
      text: item.text,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      type: "highlight",
    };
  });

  return (
    <>
      <PageHeader
        title="Highlight"
        description="Manage reusable highlight for your packages"
        Icon={Siren}
        modalComponent={IEHModal}
        modalProps={{ isEdit: false, title: "Highlight" }}
      />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
