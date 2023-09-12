import { useEffect, useState, useRef } from "react";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import Button from "@mui/material/Button";
import CustomAlert from "src/app/main/customAlerts/customAlert";
import { environment } from "src/environment/environment";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";
import Loader from "src/app/main/components/Loader/Loader";

const UploadPic = ({ onCancel, product }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [catalogo, setCatalogo] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const inputRef = useRef();

  const handleCancel = () => {
    onCancel();
  };

  const saveFile = async () => {
    console.log("saving file...");
    try {
      setLoadOpen(true);
      const formData = new FormData();
      formData.append("File", file);

      const headers = {
        "Content-Type": "undefined",
      };
      const apiUrl = environment.apiUrl + "ArchiveManager/SaveArchiveImage";
      const response = await axios.post(apiUrl, formData, { headers: headers });
      console.log("file saved");
      const newPath = response.data.data;
      if (catalogo) {
        const apiProd = environment.apiUrl + "Producto/UpdateCatalogo";
        const body = {
          idCatalogo: catalogo.idCatalogo,
          imagen: newPath,
          descripcion: null,
        };
        const response2 = await axios.put(apiProd, body);
        console.log("product photo updated");
      } else if (!catalogo) {
        const apiProd = environment.apiUrl + "Producto/SaveCatalogo";
        const body = {
          idProducto: product.idProducto,
          imagen: newPath,
          descripcion: null,
        };
        const response2 = await axios.post(apiProd, body);
        console.log("product photo created");
      }
      setLoadOpen(false);
      onCancel();
    } catch (error) {
      console.log(error);
      setLoadOpen(false);
    }
  };

  const saveEmptyFile = async () => {
    try {
      if (catalogo) {
        setLoadOpen(true);
        const apiProd = environment.apiUrl + "Producto/UpdateCatalogo";
        const body = {
          idCatalogo: catalogo.idCatalogo,
          imagen: null,
          descripcion: null,
        };
        const response2 = await axios.put(apiProd, body);
        console.log("product photo updated");
      }
      setLoadOpen(false);
      onCancel();
    } catch (error) {
      console.log(error);
      setLoadOpen(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const getCatalogo = async (idProducto) => {
    try {
      setLoadOpen(true);
      const apiUrl = environment.apiUrl + "Producto/GetCatalogoByProducto";
      const response = await axios.get(apiUrl, {
        params: { IdProducto: idProducto },
      });
      const res = response.data.data[0];
      setLoadOpen(false);
      return res;
    } catch (error) {
      console.log(error);
      setLoadOpen(false);
      return null;
    }
  };

  const getImage = async (filePath) => {
    try {
      setLoadOpen(true);

      const apiUrl = environment.apiUrl + "ArchiveManager/GetArchiveImage";
      const response = await axios.get(apiUrl, {
        params: { Ruta: filePath },
      });
      const res = response.data.data;
      setLoadOpen(false);
      return res;
    } catch (error) {
      console.log(error);
      setLoadOpen(false);
      return null;
    }
  };

  const showCurrentImage = async () => {
    setLoadOpen(true);
    const catalogo = await getCatalogo(product.idProducto);
    if (catalogo) {
      setCatalogo(catalogo);
      const filePath = catalogo.imagen;
      if (filePath) {
        const photo = await getImage(filePath);
        setCurrentImage("data:image/jpg;base64," + photo);
        setFile("data:image/jpg;base64," + photo);
      }
    }
  };

  const deleteImage = () => {
    setFile(null);
    setCurrentImage(null);
  };

  useEffect(() => {
    if (product) {
      showCurrentImage();
    }
  }, [product]);

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex justify-between">
        <button type="button" onClick={() => handleCancel()}>
          <ArrowCircleLeftSharpIcon /> Regresar
        </button>
      </div>

      {!file ? (
        <div className="flex flex-col items-center gap-10">
          <h2>{product.descripcionProducto} </h2>
          <div className="bg-white flex items-center justify-center text-center p-24 w-[300px] h-[300px] border-2 border-dashed border-black">
            <h2> Este producto no tiene imagen.</h2>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            hidden
            ref={inputRef}
          />
          <div className="flex gap-10">
            <Button
              onClick={() => inputRef.current.click()}
              color="primary"
              variant="contained"
            >
              Elige un archivo
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => saveEmptyFile()}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <h2>{product.descripcionProducto} </h2>

          <img
            src={currentImage ? currentImage : previewUrl}
            alt="Preview"
            className="w-[300px] h-[300px]"
          />
          <div className="flex gap-10">
            <Button
              color="primary"
              variant="contained"
              onClick={() => deleteImage()}
            >
              Eliminar imagen
            </Button>
            {!currentImage && (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => saveFile()}
              >
                Guardar cambios
              </Button>
            )}
          </div>
        </div>
      )}

      <CustomAlert
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="¡Alerta!"
        message="¿Desea guardar la imagen del producto?"
        onConfirm={() => saveFile()}
      />
      <Loader open={loadOpen}></Loader>
    </div>
  );
};

export default UploadPic;
