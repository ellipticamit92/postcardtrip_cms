import { FC } from "react";

interface ShowDataProps {
  title: string;
  data: string[];
  id: string;
}

const ShowData: FC<ShowDataProps> = ({ title, data, id }) => {
  return (
    <div className="border-b-2 pb-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ol className="list-decimal">
        {data?.map((item: any) => (
          <li className="ml-8 text-xs" key={item[id]}>
            {item?.text ?? item?.name}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ShowData;
