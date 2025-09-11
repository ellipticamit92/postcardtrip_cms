import { Heading } from "@/components/atoms/Heading";
import IEHTable from "@/components/organisms/IEHTable";
import IEHService from "@/services/ieh.service";

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
      <Heading text="All Inclusion" href="/" />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
