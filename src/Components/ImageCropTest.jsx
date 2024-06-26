import React, { useState } from "react";
import FileInput from "./FileInput";
import ImageCropper from "./ImageCropper2";
import { Dialog } from "primereact/dialog";

function ImageCropTest() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState("");

  // Invoked when new image file is selected
  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setVisible(true);
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImgAfterCrop(dataURL);
      setCurrentPage("img-cropped");
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  return (
    <>
      <Dialog
        header={"Crop Image"}
        visible={visible}
        onHide={() => setVisible(false)}
      >
         <ImageCropper
            image={image}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
      </Dialog>
        <FileInput setImage={setImage} onImageSelected={onImageSelected} />
      {/* <div className="container">
        {currentPage === "choose-img" ? (
        ) : currentPage === "crop-img" ? (
          <ImageCropper
            image={image}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
        ) : (
          <div>
            <div>
              <img src={imgAfterCrop} className="cropped-img" />
            </div>

            <button
              onClick={() => {
                setCurrentPage("crop-img");
              }}
              className="btn"
            >
              Crop
            </button>

            <button
              onClick={() => {
                setCurrentPage("choose-img");
                setImage("");
              }}
              className="btn"
            >
              New Image
            </button>
          </div>
        )}
      </div> */}
    </>
  );
}

export default ImageCropTest;
