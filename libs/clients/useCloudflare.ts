interface CreateImageUrlProps {
  imageId: string;
  variant?: string;
}

const useCloudflare = () => {
  const createImageUrl = ({
    imageId,
    variant = "public",
  }: CreateImageUrlProps) => {
    return `https://imagedelivery.net/_YZKPw51blNYrdvZChBC7w/${imageId}/${variant}`;
  };

  return {
    createImageUrl,
  };
};

export default useCloudflare;
