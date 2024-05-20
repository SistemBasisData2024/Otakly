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
        cropping: true, 
        croppingAspectRatio: 1, 
        croppingShowBackButton: true,
        showAdvancedOptions: true, 
        multiple: false, 
        defaultSource: 'local',
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          },
          fonts: {
            default: null, 
          }
        }
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
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
