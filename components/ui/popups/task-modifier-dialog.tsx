"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { Task } from "@/lib/types";
import { Textarea } from "../textarea";
import { modifyTasksAsync } from "@/app/store/asyncActions";
import { useAppDispatch } from "@/app/store";
import Dropzone from "../dropzone";
import { Attachment } from "@/lib/types";
import { Separator } from "../separator";
import { useState } from "react";

interface TaskModifierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function TaskModifierDialog({
  isOpen,
  onClose,
  task,
}: TaskModifierDialogProps) {
  const dispatch = useAppDispatch();
  const [modifiedDescription, setModifiedDescription] = useState(
    task.description
  );
  const [modifiedAttachments, setModifiedAttachments] = useState<Attachment[]>(
    task.attachment || []
  );

  const handleEdit = async () => {
    const updatedTask = {
      ...task,
      description: modifiedDescription,
      attachment: modifiedAttachments,
    };

    await dispatch(modifyTasksAsync(updatedTask));
    onClose();
  };

  const handleAttachmentChange = (attachments: Attachment[]) => {
    setModifiedAttachments(attachments);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>
            {`Editar full de treball núm. ` + task.task_num}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div>
          <div className="space-y-4 py-2 pt-0 pb-4">
            <div className="space-y-2">
              <label className="secondary" htmlFor="apparelName">
                Aparell
              </label>
              <p>{task.apparel_name}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="type">Tipus full de treball</label>
              <p>{task.type}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Descripció</label>
              <Textarea
                id="description"
                value={modifiedDescription}
                onChange={(e) => setModifiedDescription(e.target.value)}
                placeholder="Descripció del treball a realitzar"
                className="w-full h-2 p-2 border rounded-md resize-none"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label>Adjunts</label>
              <Dropzone
                onFileChange={(files) => {
                  handleAttachmentChange(files);
                }}
                existingAttachments={modifiedAttachments}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel·la
          </Button>
          <Button onClick={handleEdit}>Desa els canvis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
