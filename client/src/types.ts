export type User = {
  id: number;
  email: string;
  createdAt: string;
};

export type Address = {
  id: number;
  name: string;
  description?: string | null;
  lng: number;
  lat: number;
  createdAt: string;
};

export type Notice = {
  type: "success" | "error" | "info";
  message: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};
