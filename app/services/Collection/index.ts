import { UserType } from "@/app/types";

export const addField = async (
  collectionId: string,
  createDto: {
    name: string;
    type: string;
    default?: string;
    options?: { label: string; value: string }[];
    isPartOfFormView: boolean;
    userType?: UserType;
    onUpdateNotifyUserTypes?: UserType[];
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addProperty`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(createDto),
      }
    )
  ).json();
};

export const updateField = async (
  collectionId: string,
  name: string,
  update: {
    isPartOfFormView?: boolean;
    name?: string;
    type?: string;
    default?: string;
  }
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/updateProperty?propertyId=${name}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: collectionId,
          ...update,
        }),
      }
    )
  ).json();
};

export const updateFormCollection = async (
  collectionId: string,
  update: {
    name?: string;
    description?: string;
  }
) => {
  return await (
    await fetch(`${process.env.API_HOST}/collection/v1/${collectionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(update),
    })
  ).json();
};