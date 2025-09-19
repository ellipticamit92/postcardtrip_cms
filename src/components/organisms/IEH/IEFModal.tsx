"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { IEHForm, IEHFormValues } from "./IEHForm";
import { IEHType } from "@/types/type";

interface IEHModalProps {
  isEdit: boolean;
  title?: string;
  isTable?: boolean;
  data?: IEHFormValues;
  id?: number;
  modalOpen?: boolean;
}

const ModalTriggerButton: FC<{
  isEdit: boolean;
  title?: string;
  isTable?: boolean;
  handleModalOpen: () => void;
}> = ({ isEdit, title, isTable, handleModalOpen }) => {
  const label = isEdit ? "Edit" : "Add";

  return (
    <Button
      variant={isTable ? "default" : "gradient"}
      size={isTable ? "xs" : "sm"}
      className="shadow-glow"
      onClick={handleModalOpen}
    >
      {!isTable && <Plus className="h-4 w-4" />}
      {label} {!isTable && title}
    </Button>
  );
};

const IEHModal: FC<IEHModalProps> = ({
  isEdit,
  title = "",
  isTable = false,
  data,
  id,
}) => {
  const [open, setOpen] = useState(false);

  const label = isEdit ? "Edit" : "Add";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ModalTriggerButton
          isEdit={isEdit}
          title={title}
          isTable={isTable}
          handleModalOpen={() => setOpen(!open)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {label} {title}
          </DialogTitle>
        </DialogHeader>
        <IEHForm
          type={title.toLowerCase() as IEHType}
          handleModalOpen={() => setOpen(false)}
          initialData={data}
          id={id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IEHModal;
