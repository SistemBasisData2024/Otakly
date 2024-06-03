import { useEffect, useRef, useState } from "react";

const UploadWidget = ({ onImageUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dscilmmzw",
        uploadPreset: "d5lnnj4u",
      },
      function (error, result) {
        if (result.event === "success") {
          console.log(result);
          setImageUrl(result.info.secure_url);
          onImageUpload(result.info.secure_url); 
        }
      }
    );
  }, [onImageUpload]);

  return (
    <>
      <button
        onClick={() => widgetRef.current.open()}
        className="bg-[#C2855F] hover:bg-[#9e6c4e] text-white font-bold py-2 px-4 rounded"
      >
        Upload Image
      </button>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Uploaded" style={{ width: '100px', height: 'auto' }} />
        </div>
      )}
    </>
  );
};

export default UploadWidget;
