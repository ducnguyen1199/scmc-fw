import React, { useEffect, useState, FC } from "react";
import { useDropzone } from "react-dropzone";
import { TCustomImage } from "../types/customImage";

const thumbsContainer: React.CSSProperties = {
  marginTop: 10,
  width: "50%",
  display: "grid",
  gridTemplateColumns: "33% 33% 33%",
  gridAutoFlow: "dense",
  gap: 5,
};

const thumb: React.CSSProperties = {
  borderRadius: 2,
  border: "1px solid #eaeaea",
  padding: 4,
  boxSizing: "border-box",
  gridColumn: "span 1",
  gridRow: "span 1",
};

const thumbInner: React.CSSProperties = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img: React.CSSProperties = {
  display: "block",
  width: "100%",
  aspectRatio: "3/4",
};

export interface FileWithPreview extends File {
  id: string;
  preview: string;
  width: number;
  height: number;
  timestamp: Date;
}

type TUploadImagesProps = {
  images: TCustomImage[];
  onChange: (files: FileWithPreview[]) => void;
};

export const UploadImages: FC<TUploadImagesProps> = ({ images, onChange }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles: File[]) => {
      const filesPromise = Promise.allSettled(
        acceptedFiles.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const { width, height } = await getWidthHeightImage(preview);
          return Object.assign(file, {
            id: crypto.randomUUID(),
            preview,
            width,
            height,
            timestamp: new Date(),
          });
        })
      );
      filesPromise.then((rs) => {
        setFiles(rs.map(({ value }: any) => value));
      });
    },
  });

  const removeFile = (id: string) => {
    setFiles((cur) => cur.filter((item) => item.id !== id));
  };

  const thumbs = [files, images]
    .flat()
    .sort(
      (x, y) =>
        compareTime(new Date(x.timestamp), new Date(y.timestamp)) ||
        compareName(x.name, y.name)
    )
    .map((item, index) => {
      const ar = getAspectRadio(item.width, item.height);
      return (
        <div
          style={{
            ...thumb,
            gridColumn: `span ${ar[0] / 3}`,
            gridRow: `span ${ar[1] / 4}`,
          }}
          key={item.id}
          className="thumbContain"
        >
          <div style={thumbInner}>
            <img
              // @ts-ignore
              src={item.image?.publicUrl || item.preview}
              style={{ ...img, aspectRatio: `${ar[0]}/${ar[1]}` }}
              // Revoke data uri after image is loaded
              onLoad={() => {
                // @ts-ignore
                if (item.preview) URL.revokeObjectURL(item.preview);
              }}
              alt={item.name}
            />
          </div>
          {/* @ts-ignore */}
          {item.preview && (
            <div className="thumbRemove" onClick={() => removeFile(item.id)}>
              x
            </div>
          )}
        </div>
      );
    });

  useEffect(() => {
    onChange(files);
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section>
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{
          padding: "40px",
          background: "#00000024",
          borderRadius: "20px",
          border: "1px dashed gray",
          width: "50%",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
};

const getWidthHeightImage = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };
  });
};

const getAspectRadio = (width: number, height: number) => {
  if (width / 3 > height / 4) {
    return [Math.ceil((((width * 4) / height) % 3) + 0.5) * 3, 4];
  }
  if (width / 3 > height / 4) {
    return [3, Math.ceil((((height * 3) / width) % 4) + 0.5) * 4];
  }
  return [3, 4];
};

const compareTime = (timestamp1: Date, timestamp2: Date) => {
  return timestamp2.getTime() - timestamp1.getTime();
};

const compareName = (name1: string, name2: string) => {
  if (name1 < name2) {
    return -1;
  }
  if (name1 > name2) {
    return 1;
  }
  return 0;
};
