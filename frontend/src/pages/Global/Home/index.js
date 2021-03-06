import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './styles.css';
import api from '../../../api';

const Home = () => {

    const [ formData, setFormData ] = useState({
        email: '',
        pass: ''
    })
    const history = useHistory();

    function handleinput(e) {

        const { name, value } = e.target;
        setFormData({...formData, [name]: value});


    }

    async function handleAuth(e) {

        e.preventDefault();
        const { data } = await api.post('login', formData);

        localStorage.setItem('id', data[0].id);
        localStorage.setItem('type', data[0].tipo);
        
        if (data.tipo !== null){
            localStorage.setItem('isAuth', true);
            history.push('/home');
        }else {
            localStorage.setItem('isAuth', false);
        }

    }

    

    return (

        <div className="home">

            <aside className="slogan">
                    <h1>Oxe food!</h1>
                    <span>
                        Deixe de arrudeio e vem comer.<br />
                        As melhores comidas da região<br />
                        e se não for eu cegue.
                    </span>
            </aside>

            <form className="form-box" onSubmit={handleAuth}>

                <h2>Login</h2>

                <input name="email" onChange={handleinput} placeholder="Email" type="email" />
                <input name="pass" onChange={handleinput} placeholder="Senha" type="password"/>

                <button type="submit">Entrar</button>
                <Link className="link" to="/cadastro">Cadastre-se, é sem frescura</Link>

            </form>

        </div>

    );
}

export default Home;