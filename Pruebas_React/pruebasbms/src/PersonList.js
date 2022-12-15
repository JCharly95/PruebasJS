import React from 'react';
import axios from 'axios';

export default class PersonList extends React.Component{
    //Este es el codigo para hacer una peticion GET
    state = {
        personas: []
    }

    componentDidMount(){
        axios.get(`https://jsonplaceholder.typicode.com/users`).then(res => {
            const personas = res.data;
            this.setState({personas});
        })
    }

    render(){
        return(
            <ul>
                {this.state.personas.map(persona => <li>{persona.name}</li>)}
            </ul>
        )
    }

    /* Y este para hacer una peticion POST para envio de datos
    state = {
        nombre: '',
    }

    handleChange = event => {
        this.setState({nombre: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();

        const usuario = {
            nombre: this.state.nombre
        };

        axios.post(`https://jsonplaceholder.typicode.com/users`, { usuario }).then(res => {
            console.log(res);
            console.log(res.data);
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                <label>
                    Nombre de la Persona:
                    <input type="text" name="name" onChange={this.handleChange} />
                </label>
                <button type="submit">Add</button>
                </form>
            </div>
        )
    }*/
}