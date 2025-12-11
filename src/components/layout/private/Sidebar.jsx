import React, { useState } from 'react'
import avatar from "../../../assets/img/user.png"
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {

    // Hook personalizado que devuelve datos de autenticación y contadores
    const { auth, counters } = useAuth();

    // Hook personalizado para controlar formulario (devuelve form y changed)
    const { form, changed } = useForm({})

    // Estado para controlar si la publicación se guardó, hubo error, etc.
    // valores: "not_stored" | "stored" | "error" | "" (vacio para neutral)
    const [stored, setStored] = useState("not_stored")

    /**
     * savePublication
     * - Función que se ejecuta al enviar el formulario
     * - 1) Evita el comportamiento por defecto del form
     * - 2) Recoge los datos del formulario (text) desde form
     * - 3) Envia petición POST para guardar la publicación en la BD
     * - 4) Si se guarda correctamente, intenta subir la imagen (si hay)
     * - 5) Muestra mensajes de éxito/error y limpia el formulario tras éxito
     */
    const savePublication = async (e) => {
        try {
            // 1) Evitar que el form recargue la página
            e.preventDefault();

            // 2) Recoger datos del formulario desde el hook useForm
            //    `form` contiene los campos que está seteo el onChange del textarea
            let newPublication = { ...form }; // clonar por seguridad
            newPublication.user = auth._id;    // añadir id del usuario al objeto publikación

            // 3) Hacer request para guardar en la BD la publicación (sin imagen)
            const request = await fetch(Global.url + "publication/save", {
                method: "POST",
                body: JSON.stringify(newPublication),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            // Parsear la respuesta JSON del backend
            const data = await request.json();

            // 4) Mostrar mensaje inmediato si hubo éxito/ error al crear la publicación
            if (data.status === "success") {
                // No marcamos todavía "stored" definitivo hasta comprobar subida de imagen (si procede).
                // Guardamos un estado neutral por ahora para mostrar que la creación fue ok.
                setStored("stored");
            } else {
                setStored("error");
            }

            // 5) Subir imagen asociada (si el usuario seleccionó un archivo)
            //    Buscamos el input file en el DOM por su id 'file'
            const fileInput = document.querySelector("#file");

            // Comprobamos que la respuesta del guardado fue success y que existe un archivo seleccionado
            if (data.status === "success" && fileInput && fileInput.files && fileInput.files[0]) {
                // Crear FormData y anexar el archivo con la clave esperada por el backend
                const formData = new FormData();
                formData.append("file0", fileInput.files[0]);

                // Enviar petición para subir la imagen, pasando el id de la publicación creada.
                const uploadRequest = await fetch(Global.url + "publication/upload/" + data.publication._id, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                });

                // IMPORTANTE: hacer await aquí para obtener el JSON final de la subida
                const uploadData = await uploadRequest.json();
    

                // Si la subida fue correcta, confirmamos stored; si no, marcamos error
                if (uploadData.status === "success") {
                    setStored("stored");
                    // --- LIMPIAR FORMULARIO AQUÍ ---
                    // Vaciamos textarea y el input file manualmente en el DOM.
                    const textarea = document.querySelector('textarea[name="text"]');
                    if (textarea) textarea.value = "";

                    // Limpiar input file
                    fileInput.value = "";
                } else {
                    setStored("error");
                }

            } else {
                // Si no había archivo, ya quedó creada la publicación en DB.
                // opcional: limpiar el textarea si se quiere limpiar aunque no hubiera archivo
                if (data.status === "success") {
                    const textarea = document.querySelector('textarea[name="text"]');
                    if (textarea) textarea.value = "";

                    if (fileInput) fileInput.value = "";
                } else {
                    // si no se creó la publicación, no limpiamos nada
                }
            }

        } catch (error) {
            // Capturamos cualquier excepción que ocurra durante el proceso
            console.log("Error al guardar la publicacion", error);
            setStored("error");
        }
    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image !== "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>

                        <div className="general-info__container-names">
                            <Link to={"/social/perfil/"+auth._id} className="container-names__name">{auth.name} {auth.surname}</Link>
                            <p className="container-names__nickname">{auth.nick}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={"siguiendo/" + auth._id} className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{counters.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={"seguidores/" + auth._id} className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{counters.followed}</span>
                            </Link>
                        </div>

                        <div className="stats__following">
                            <Link to={"/social/perfil/"+auth._id} className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{counters.publications}</span>
                            </Link>
                        </div>

                    </div>
                </div>

                <div className="aside__container-form">

                    {/* Mensajes de estado */}
                    {stored === "stored" && (<strong className="alert alert-success">Publicada correctamente !!</strong>)}
                    {stored === "error" && (<strong className="alert alert-error">No se ha publicado nada !!</strong>)}

                    <form className="container-form__form-post" onSubmit={savePublication}>

                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">¿Qué estás pensando hoy?</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed} />
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="file" className="form-post__label">Sube tu foto</label>
                            <input type="file" name="file0" id="file" className="form-post__image" />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>
    )
}