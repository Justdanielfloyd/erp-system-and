import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const stateIcons = [
  {
    value: "PENDENT",
    label: "Pendent",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "REALITZAT",
    label: "Realitzat",
    icon: CheckCircledIcon,
  },
  {
    value: "EN REVISIÓ",
    label: "En revisió",
    icon: StopwatchIcon,
  },
];

export const labels = [
  {
    value: "failure",
    label: "Avería",
  },
  {
    value: "verification",
    label: "Verificación",
  },
  {
    value: "refund",
    label: "Devolución",
  },
];
export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
export const taskColumnsCat = [
  {
    id: "task_number",
    value: "Número full de treball",
  },
  {
    id: "description",
    value: "Descripció",
  },
  {
    id: "solicited_date",
    value: "Data de sol·licitud",
  },
  {
    id: "priority",
    value: "Prioritat",
  },
  {
    id: "specialty",
    value: "Especialitat",
  },
  {
    id: "state",
    value: "Estat",
  },
];
