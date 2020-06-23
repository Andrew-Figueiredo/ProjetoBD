import React, { useState } from 'react';
import './styles.css';

import api from '../../api/connection'


const Cadastro = () => {

    const [ formData, setFormData ] = useState({
        nome: '',
        email: '',
        password: '',
        endereco: ''
    })
    
    function handleinput(event){
        const { name, value } = event.target;

        setFormData({ ...formData, [name] : value});

    }

    async function handlesubmit(event) {


        event.preventDefault();

        const { nome, email, senha, endereco } = formData;

        const data = [
            nome,
            email,
            senha,
            endereco
        ]
        const client = await api.post("clientsCreate", data);
        console.log(client);


    }

    return (

        <div className="geral-box">

            <span className="title">Cadastro Cliente</span>

            <div className="form-box">

                <form className="form" onSubmit={handlesubmit}>

                    <input type="nome" required placeholder="Nome" name="nome" onChange={handleinput}/>
                    <input type="Email" required placeholder="Email" name="email" onChange={handleinput}/>
                    <input type="password" required placeholder="Senha" name="password" onChange={handleinput}/>
                    <input type="text" required placeholder="Endereço" name="endereco" onChange={handleinput}/>

                    <button type="submit" className="button-form">Cadastrar</button>
                    <a className="sub" href="/login">já tem cadastro? arrocha o nó no login.</a>

                </form>
            </div>
        </div>
    );
}

    //988659605

export default Cadastro;
