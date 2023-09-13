import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { useRef, useState } from "react";
import { AutoComplete } from "../components/AutoComplete";
import { FileWithPreview, UploadImages } from "../components/UploadImages";
import { client, withApollo } from "../hoc/withApollo";
import { GET_CUSTOMS, GET_CUSTOM_DETAIL } from "../graphql/customs";
import { TCustom } from "../types/custom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.css";
import { toastSuccess } from "../lib/toast";
import { TCustomImage, TCustomImageReq } from "../types/customImage";
import { CREATE_CUSTOM_IMAGES } from "../graphql/customImages";

const UploadCustomImages = () => {
  const files = useRef<FileWithPreview[]>([]);
  const customId = useRef<string>();
  const [disabled, setDisabled] = useState(true);
  const { data: customData } = useQuery<{ customs: TCustom[] }>(GET_CUSTOMS);
  const [fetchDetail, { data: customDetailData }] = useLazyQuery<{
    custom: { images: TCustomImage[] };
  }>(GET_CUSTOM_DETAIL, {
    fetchPolicy: "no-cache",
  });
  const [id, setId] = useState(crypto.randomUUID());
  const [uploadFiles] = useMutation<TCustomImageReq[]>(CREATE_CUSTOM_IMAGES, {
    onCompleted: () => {
      toastSuccess("🚀 Upload successfully!");
      reset();
    },
  });

  const reset = () => {
    files.current = [];
    customId.current = "";
    setDisabled(false);
    setId(crypto.randomUUID());
    fetchDetail({
      variables: {
        where: {
          id: null,
        },
      },
    });
  };

  const saveChange = async () => {
    if (!files.current.length || !customId.current) return;
    const data: TCustomImageReq[] = files.current.map((file) => ({
      image: file,
      name: file.name,
      width: file.width,
      height: file.height,
      timestamp: file.timestamp,
      custom: {
        connect: {
          id: customId.current as string,
        },
      },
    }));
    uploadFiles({ variables: { data } });
    await client.refetchQueries({
      include: [GET_CUSTOM_DETAIL],
    });
    setDisabled(true);
  };

  const onChangeFiles = (newFiles: FileWithPreview[]) => {
    files.current = newFiles;
    checkValid();
  };

  const checkValid = () => {
    if (!files.current.length || !customId.current) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  };

  const onSelectMotorcycle = async (
    selectedItem: { id: string; label: string } | null
  ) => {
    fetchDetail({
      variables: {
        where: {
          id: selectedItem?.id,
        },
      },
    });
    customId.current = selectedItem?.id;
    checkValid();
  };

  return (
    <PageContainer header="Upload thumbnails">
      <div key={id}>
        <AutoComplete
          label="Select custom:"
          options={
            customData?.customs.map(({ id, name }) => ({ id, label: name })) ||
            []
          }
          onSelect={onSelectMotorcycle}
        />
        <div className="container">
          <span>Upload images:</span>
          <UploadImages
            onChange={onChangeFiles}
            images={customDetailData?.custom?.images || []}
          />
        </div>
        <button
          className={`btnSave ${disabled ? "disabled" : ""}`}
          onClick={saveChange}
        >
          Save changes
        </button>
      </div>
      <ToastContainer />
    </PageContainer>
  );
};

export default withApollo(UploadCustomImages);
