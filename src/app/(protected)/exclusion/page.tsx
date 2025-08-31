import { Heading } from "@/components/atoms/Heading";
import IEHTable from "@/components/organisms/IEHTable";
import IEHService from "@/services/ieh.service";

export const dynamic = "force-dynamic";

export default async function ExclusionPage() {
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
      <Heading text="All Exclusion" />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
