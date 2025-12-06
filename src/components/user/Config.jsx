import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png"
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {
  const { auth, setAuth } = useAuth();

  const { form, changed } = useForm({});

  const [saved, setSaved] = useState("not_sended");

  const updateUser = async (e) => {

    // Evita que la página se recargue al enviar el formulario
    e.preventDefault();

    // Recuperamos el token de autenticación almacenado en localStorage
    const token = localStorage.getItem("token");

    // Convertimos todos los campos del formulario en un objeto JS
    let newDataUser = SerializeForm(e.target);

    // Eliminamos el campo de archivo porque solo queremos enviar texto en esta petición
    delete newDataUser.file0;

    // ----------------------------------
    // 1) PETICIÓN PARA ACTUALIZAR DATOS DE TEXTO DEL USUARIO
    // ----------------------------------
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser), // Enviamos los datos como JSON
      headers: {
        "Content-Type": "application/json", // Indicamos que el body es JSON
        "Authorization": token              // Enviamos el token para autorizar la acción
      }
    });

    // Recibimos la respuesta del servidor en formato JSON
    const data = await request.json();

    // Si el servidor responde correctamente
    if (data.status == "success" && data.user) {
      delete data.user.password;   // Nunca guardamos la contraseña en el estado
      setAuth(data.user);          // Actualizamos los datos del usuario en el contexto global
      setSaved("saved");           // Cambiamos el estado para mostrar mensaje de éxito
    } else {
      setSaved("error");           // Mostramos error si algo salió mal
    }

    // ----------------------------------
    // 2) SUBIDA DE IMAGEN (solo si existe archivo)
    // ----------------------------------

    // Obtenemos el input de archivo por su ID
    const fileInput = document.querySelector("#file");

    // Si el usuario subió una imagen, procedemos a enviarla
    if (data.status == "success" && fileInput.files[0]) {

      // Creamos un nuevo FormData para enviar la imagen
      const fornData = new FormData();
      fornData.append("file0", fileInput.files[0]); // Adjuntamos el archivo

      // Enviamos la imagen al servidor
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: fornData,               // FormData se envía sin headers de tipo
        headers: {
          "Authorization": token      // Enviamos token para validar la operación
        }
      });

      // Obtenemos la respuesta del servidor
      const uploadData = await uploadRequest.json();
      // Si la imagen se subió correctamente
      if (uploadData.status == "success" && uploadData.user) {
        delete uploadData.user.password;  // Eliminamos contraseña por seguridad
        setAuth(uploadData.user);         // Actualizamos avatar y datos del usuario
        setSaved("saved");                // Mostramos mensaje de actualización correcta
      } else {
        setSaved("error");                // Mostramos error si algo falló
      }
    }
  };



  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
      </header>
      <div className="content__post">
        {saved == "saved" ? (
          <strong className="alert alert-success">
            "Usuario actualizado correctamente !!"
          </strong>
        ) : (
          ""
        )}
        {saved == "error" ? (
          <strong className="alert alert-error">
            {" "}
            "No se ha podido actualizar el usuario !!"
          </strong>
        ) : (
          ""
        )}

        <form className="register-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" defaultValue={auth.name} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input type="text" name="surname" defaultValue={auth.surname} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={auth.nick} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografia</label>
            <textarea name="bio" defaultValue={auth.bio} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" name="email" defaultValue={auth.email} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" />
          </div>

          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>
            <br />
            <input type="file" name="file0" id="file" />
            <br />
          </div>

          <input type="submit" value="Registrate" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
