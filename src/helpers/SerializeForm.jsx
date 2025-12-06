import React from 'react'

// Función que recibe un formulario HTML y convierte todos sus
// campos en un objeto JavaScript.
export const SerializeForm = (form) => {

    // FormData permite leer fácilmente los inputs del formulario
    // (name, value) de cada campo.
    const formData = new FormData(form);

    // Objeto donde guardaremos pareja clave-valor del formulario
    const completeObj = {}

    // Recorremos cada par (name, value) que contiene el formulario.
    // "name" será el atributo name del input, y "value" su contenido.
    for (let [name, value] of formData) {
        // Añadimos cada dato al objeto final
        completeObj[name] = value;
    }

    // Devolvemos un objeto listo para enviar al backend o usar en React
    return completeObj;
}