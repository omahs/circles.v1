import { toast } from "react-toastify";

type GrantWorkflowDto = {
  snapshot?: {
    name: string;
    id: string;
    network: string;
    symbol: string;
  };
  permissions?: string[];
  channelCategory?: {
    label: string;
    value: string;
  };
  roles?: {
    [k: string]: boolean;
  };
};

export async function createGrantWorkflow(
  circleId: string,
  template: GrantWorkflowDto
) {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v1/${circleId}/useTemplate?templateId=1`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
      credentials: "include",
    }
  );

  if (res.ok) {
    toast.success("Grant Workflow created successfully!");
    return res.json();
  }
}
