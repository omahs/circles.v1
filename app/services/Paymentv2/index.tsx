import { toast } from "react-toastify";

type AddPaymentsRequestDto = {
  collectionId: string;
  dataSlugs: string[];
};

export const addPendingPayment = async (
  circleId: string,
  body: AddPaymentsRequestDto
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/addPendingPayment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    )
  ).json();
};

type PaymentIdsDto = {
  paymentIds: string[];
  transactionHash?: { [key: string]: string };
};

export const makePayments = async (circleId: string, body: PaymentIdsDto) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/makePayments`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  console.log({ res });
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  toast.error("Error updating payment status", {
    theme: "dark",
  });
  return undefined;
};

export const cancelPayments = async (circleId: string, body: PaymentIdsDto) => {
  console.log({ body });
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/cancelPayments`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  console.log({ res });
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  toast.error("Error updating payment status", {
    theme: "dark",
  });
  return undefined;
};
