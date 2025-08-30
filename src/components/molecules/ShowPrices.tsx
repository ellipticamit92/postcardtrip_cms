import { toIndianCurrency } from "@/lib/helper";
import { FC } from "react";

interface ShowPriceProps {
  title: string;
  price: number;
}

const ShowPrice: FC<ShowPriceProps> = ({ title, price }) => {
  return (
    <div className="border-b-2 pb-2 flex gap-2 items-center">
      <h2 className="text-md font-semibold">{title} : - </h2>
      <h3 className="text-sm">{toIndianCurrency(Number(price))}</h3>
    </div>
  );
};

export default ShowPrice;
