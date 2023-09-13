export type TCustomImage = {
  id: string;
  name: string;
  width: number;
  height: number;
  timestamp: Date;
  image: {
    publicUrl: string;
  };
};

export type TCustomImageReq = {
  name: string;
  image: File;
  width: number;
  height: number;
  timestamp: Date;
  custom: {
    connect: {
      id: string;
    };
  };
};
