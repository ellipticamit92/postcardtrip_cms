import { Heading } from "@/components/atoms/Heading";
import IEHTable from "@/components/organisms/IEHTable";
import IEHService from "@/services/ieh.service";

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
      <Heading text="All Highlight" href="/" />
      {updateData && <IEHTable data={updateData} pagination={pagination} />}
    </>
  );
}
